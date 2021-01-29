const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization;
		if (!token) {
			res.status(401).json({ errorMessage: "token required" });
		} else if (token) {
			jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
				if (err) {
					res.status(401).json({ errorMessage: "token invalid" });
				} else {
					next();
				}
			});
		}
	} catch (err) {
		next(err);
	}
	/*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
