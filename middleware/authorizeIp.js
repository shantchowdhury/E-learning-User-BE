const Student = require("../model/student");
const IP = require("ip");

const protectRouteByIP = async (req, res, next) => {
  try {
    const user = await Student.findOne({
      Email: req.body.Email,
    });
    const ipAddress =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";

    console.log(ipAddress);

    // Check if the user's allowedIPs include the current IP address
    if (!user.allowedIPs.includes(ipAddress)) {
      return res.status(403).send("Access Denied: IP address not allowed.");
    }

    // If the IP is allowed, proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

module.exports = protectRouteByIP;
