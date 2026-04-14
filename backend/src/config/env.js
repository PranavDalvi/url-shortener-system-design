require("dotenv").config();

module.exports = {
	port: process.env.PORT,
	dbUrl: process.env.DATABASE_URL,
	baseUrl: process.env.BASE_URL,
};
