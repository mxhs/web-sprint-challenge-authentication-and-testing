const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./auth-model");
const { validateRegister, validateLogin } = require("./auth.middleware");

router.post("/register", validateRegister, async (req, res, next) => {
	try {
		const credentials = req.body;

		const rounds = process.env.BCRYPT_ROUNDS || 8;
		const hash = bcryptjs.hashSync(credentials.password, rounds);

		credentials.password = hash;
		const newUser = await Users.add(credentials);
		res.status(201).json(newUser[0]);
	} catch (err) {
		next(err);
	}
	/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post("/login", validateLogin, async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findBy({ username });

		if (bcryptjs.compareSync(password, user.password)) {
			const token = generateToken(user);
			res.status(200).json({ message: `welcome, ${username}`, token });
		} else {
			res.status(401).json({ errorMessage: "invalid credentials" });
		}
	} catch (err) {
		next(err);
	}
	/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function generateToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
	};
	const options = {
		expiresIn: "1h",
	};
	const secret = process.env.JWT_SECRET;

	return jwt.sign(payload, secret, options);
}

module.exports = router;
