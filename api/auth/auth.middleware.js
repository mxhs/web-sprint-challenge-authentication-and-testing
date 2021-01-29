const Auth = require("./auth-model");

module.exports = { validateRegister, checkKeys, validateLogin };

async function validateRegister(req, res, next) {
	const user = await Auth.findBy({ username: req.body.username });

	if (checkKeys(req.body)) {
		res.status(401).json({ errorMessage: "invalid keys on request object" });
	} else if (!req.body.username || !req.body.password) {
		res.status(401).json({ errorMessage: "username and password required" });
	} else if (user) {
		res.status(401).json({ errorMessage: "username taken" });
	} else {
		next();
	}
}

function checkKeys(obj) {
	let invalidKey = false;

	Object.keys(obj).forEach((key) => {
		if (!["username", "password"].includes(key)) {
			invalidKey = true;
		}
		return invalidKey;
	});
}

async function validateLogin(req, res, next) {
	const user = await Auth.findBy({ username: req.body.username });

	if (!req.body.username || !req.body.password) {
		res.status(401).json({ errorMessage: "username and password required" });
	} else if (!user) {
		res.status(401).json({ errorMessage: "invalid credentials" });
	} else {
		next();
	}
}
