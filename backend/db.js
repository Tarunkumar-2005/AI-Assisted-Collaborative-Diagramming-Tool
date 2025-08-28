
const mongoose = require("mongoose");

module.exports = async () => {
	// const connectionParams = {
	// 	useNewUrlParser: true,
	// 	useUnifiedTopology: true,
	// };
	try {
		await mongoose.connect(process.env.DB, {});
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};
