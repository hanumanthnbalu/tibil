const jwt = require("jsonwebtoken");
const { APP_SECRETE, HTML_STATUS_CODE } = require("../config.json");

module.exports = function (req, res, next) {
    if (!req.headers.authorization) {
        return res
            .status(HTML_STATUS_CODE.UNAUTHORIZED)
            .json({ message: "Unauthorized!" });
    }
    const token = req.headers.authorization
        .replace(/["']/g, "")
        .replace("Bearer ", "");
    if (!token)
        return res
            .status(HTML_STATUS_CODE.UNAUTHORIZED)
            .json({ message: "Access denied. No token provided." });

    try {
        const user = jwt.verify(token, APP_SECRETE);
        req.user = user;
        next();
    } catch (ex) {
        res
            .status(HTML_STATUS_CODE.BAD_REQUEST)
            .json({ message: "Session Expired or invalid token." });
    }
};
