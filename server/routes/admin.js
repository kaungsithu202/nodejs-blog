const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const decoded = jwt.verify(token, jwtSecret);
		req.userId = decoded.userId;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

router.get("/admin", (req, res) => {
	const locals = {
		title: "Admin",
		description: "Admin Dashboard",
	};
	res.render("admin/index", {
		locals,
		layout: adminLayout,
		currentRoute: "/admin",
	});
});

router.post("/admin", async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ userId: user._id }, jwtSecret);
		res.cookie("token", token, { httpOnly: true });
		res.redirect("/dashboard");
	} catch (err) {
		console.log(err);
	}
});

// router.post("/admin", (req, res) => {
// 	try {
// 		const { username, password } = req.body;

// 		if (req.body.username === "admin" && req.body.password === "password") {
// 			res.send("You are logged in!");
// 		} else {
// 			res.send("Invalid credentials");
// 		}
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

router.post("/register", async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);

		try {
			const user = await User.create({ username, password: hashedPassword });
			res.status(201).json({ message: "User created successfully", user });
		} catch (err) {
			if (err.code === 11000) {
				res.status(409).json({ message: "Username already exists" });
			}
			res.status(500).json({ message: "Internal Server Error" });
		}
	} catch (err) {
		console.log(err);
	}
});

router.get("/dashboard", authMiddleware, async (req, res) => {
	try {
		const locals = {
			title: "Dashboard",
			description: "Welcome to the admin dashboard",
		};

		const data = await Post.find();

		res.render("admin/dashboard", {
			locals,
			data,
			layout: adminLayout,
			currentRoute: "/dashboard",
		});
	} catch (err) {
		console.log(err);
	}
});

router.get("/add-post", authMiddleware, async (req, res) => {
	try {
		const locals = {
			title: "Dashboard",
			description: "Welcome to the admin dashboard",
		};

		const data = await Post.find();

		res.render("admin/add-post", {
			locals,
			data,
			layout: adminLayout,
			currentRoute: "/add-post",
		});
	} catch (err) {
		console.log(err);
	}
});

router.post("/add-post", authMiddleware, async (req, res) => {
	try {
		console.log("", req.body);
		res.redirect("/dashboard");

		try {
			const newPost = new Post({
				title: req.body.title,
				body: req.body.content,
			});

			await Post.create(newPost);
		} catch (err) {
			console.log(err);
		}
	} catch (err) {
		console.log(err);
	}
});

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
	try {
		const slug = req.params.id;
		const data = await Post.findOne({ _id: slug });

		const locals = {
			title: "Edit Post",
			description: "Welcome to the admin dashboard",
		};

		res.render("admin/edit-post", {
			data,
			locals,
			layout: adminLayout,
		});
	} catch (err) {
		console.log(err);
	}
});

router.put("/edit-post/:id", authMiddleware, async (req, res) => {
	try {
		await Post.findByIdAndUpdate(req.params.id, {
			title: req.bdoy.title,
			body: req.body.body,
			updateAt: Date.now(),
		});

		res.redirect(`/edit-post/${req.params.id}`);
	} catch (err) {
		console.log(err);
	}
});

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
	try {
		await Post.deleteOne({ _id: req.params.id });

		res.redirect(`/dashboard`);
	} catch (err) {
		console.log(err);
	}
});

router.get("/logout", (req, res) => {
	res.clearCookie("token");
	res.redirect("/");
});

module.exports = router;
