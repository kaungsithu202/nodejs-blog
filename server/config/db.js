// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri =
// 	"mongodb+srv://kaungsithu1998202:Lq22Ci1GMkBhcgqo@cluster0.pn8oxzb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
// 	serverApi: {
// 		version: ServerApiVersion.v1,
// 		strict: true,
// 		deprecationErrors: true,
// 	},
// });

// async function run() {
// 	try {
// 		// Connect the client to the server	(optional starting in v4.7)
// 		await client.connect();
// 		// Send a ping to confirm a successful connection
// 		await client.db("admin").command({ ping: 1 });
// 		console.log(
// 			"Pinged your deployment. You successfully connected to MongoDB!",
// 		);
// 	} finally {
// 		// Ensures that the client will close when you finish/error
// 		await client.close();
// 	}
// }
// run().catch(console.dir);
//

const mongoose = require("mongoose");
const connectDB = async () => {
	try {
		mongoose.set("strictQuery", false);
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`DB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(error);
	}
};

module.exports = connectDB;
