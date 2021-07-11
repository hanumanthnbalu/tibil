const { HTML_STATUS_CODE } = require("../config.json");

module.exports = function (req, res, next) {
    if (req.user.role != 'ADMIN') return res.status(HTML_STATUS_CODE.FORBIDDEN).json({ message: "Access denied. Admin can only access" });
    next();
};
