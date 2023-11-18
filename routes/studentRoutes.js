const router = require("express").Router();
const authrization = require("../middleware/authorization");
const authorizeIp=require('../middleware/authorizeIp');
const {
  signup,
  googleSignin,
  signin,
  logout,
  forgotPassword,
  resetPassword,
  fetchUser,
} = require("../controllers/student.controller.js");

const { getCourseByStudent } = require("../controllers/course.controller");

router.get("/get",authrization,fetchUser);
router.get("/course-detail", authrization, getCourseByStudent);
router.post("/signup", signup);
router.post("/googleSignin", googleSignin);
router.post("/signin",authorizeIp, signin);
router.get("/logout", logout);
router.post("/forgot", forgotPassword);
router.put("/reset/:studentId/:token", resetPassword);

module.exports = router;
