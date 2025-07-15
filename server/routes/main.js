const express = require("express");
const router = express.Router();

const Post = require("../config/models/Post");

function insertPostData() {
	Post.insertMany([
		{
			title: "Building a blog",
			body: "This is a blog post about building a blog using Node.js and Express.",
		},
		{
			title: "Understanding JavaScript Promises",
			body: "Promises make asynchronous programming easier in JavaScript. In this post, we'll explore how they work.",
		},
		{
			title: "Getting Started with MongoDB",
			body: "MongoDB is a popular NoSQL database that's easy to learn. Let's see how to set up your first database.",
		},
		{
			title: "RESTful API Basics",
			body: "APIs are essential for backend development. Learn the basics of creating your own RESTful API with Express.",
		},
		{
			title: "Deploying Your Node.js App",
			body: "Ready to go live? Here's how you can deploy your Node.js application to popular cloud providers.",
		},
	]);
}

// insertPostData();

// GET HOME
router.get("", async (req, res) => {
	const locals = {
		title: "Nodejs Blog",
		description: "A blog built with Node.js and Express",
	};

	const perPage = 10;
	const page = req.query.page || 1;

	const data = await Post.aggregate([{ $sort: { createAt: -1 } }])
		.skip(perPage * page - perPage)
		.limit(perPage)
		.exec();

	const count = await Post.countDocuments();
	const nextPage = parseInt(page) + 1;
	const hasNextPage = nextPage <= Math.ceil(count / perPage);

	res.render("index", {
		locals,
		data,
		current: page,
		nextPage: hasNextPage ? nextPage : null,
	});
});

// Get POST
router.get("/post/:id", async (req, res) => {
	const locals = {
		title: "Nodejs Blog",
		description: "A blog built with Node.js and Express",
	};

	const slug = req.params.id;

	const data = await Post.findById({ _id: slug });

	res.render("post", {
		locals,
		data,
	});
});

router.get("/about", (req, res) => {
	res.render("about");
});

module.exports = router;
