const pool = require("../config/db");
class UrlRepository {
	async create(originalUrl){
		const query = `
			INSERT INTO urls (original_url)
			VALUES ($1)
			RETURNING *
		`;
		const values = [originalUrl];
		const result = await pool.query(query, values);
		return result.rows[0];
	}
	async updateShortKey(id, shortKey){
		const query = `
			UPDATE urls
			SET short_key = $1
			WHERE id = $2
			RETURNING *;
		`;

		const result = await pool.query(query, [shortKey, id]);
		return result.rows[0];
	}
	async findByShortKey(shortKey){
		const query = `
			SELECT * FROM urls 
			WHERE short_key = $1;
		`;
		const result = await pool.query(query, [shortKey]);
		return result.rows[0];
	}
}
module.exports = new UrlRepository();
