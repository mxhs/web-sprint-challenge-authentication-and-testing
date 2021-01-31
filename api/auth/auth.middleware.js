const Auth = require("./auth-model");

module.exports = { validateRegister, checkKeys, validateLogin };

async function validateRegister(req, res, next) {
	//? Why is try catch block needed for tests to pass? It worked before
	try {
		if (!req.body.username || !req.body.password) {
			res.status(401).json({ errorMessage: "username and password required" });
		}
		const user = await Auth.findBy({ username: req.body.username });
		if (checkKeys(req.body)) {
			res.status(401).json({ errorMessage: "invalid keys on request object" });
		} else if (user) {
			res.status(401).json({ errorMessage: "username taken" });
		} else {
			next();
		}
	} catch (err) {
		next(err);
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
	try {
		if (!req.body.username || !req.body.password) {
			res.status(401).json({ errorMessage: "username and password required" });
		}

		const user = await Auth.findBy({ username: req.body.username });

		if (!user) {
			res.status(401).json({ errorMessage: "invalid credentials" });
		} else {
			next();
		}
	} catch (err) {
		next(err);
	}
}
