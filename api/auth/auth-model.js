const db = require("../../data/dbConfig");

module.exports = {
	add,
	findBy,
};

async function add(user) {
	const [id] = await db("users").insert(user);
	return db("users").where("id", id);
}

async function findBy(params) {
	return db("users").where(params).first();
}
