const {Pool, types} = require("pg");
const {dbUrl} = require("./env");

// Parse BIGINT as number
types.setTypeParser(20, (val) => parseInt(val, 10));

const pool = new Pool({
	connectionString: dbUrl,
});

pool.on("connect", () => {
	console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
	console.error("Connected to PostgreSQL");
	process.exit(1);
});

module.exports = pool;
