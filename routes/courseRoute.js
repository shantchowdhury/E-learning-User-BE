const router = require("express").Router();
const {
  getAll,
  getAllDataById,
  getByCourseId,
  getCourseByStudent
} = require("../controllers/course.controller");
const authrization = require("../middleware/authorization");

const auth = require("../middleware/authorization");

router.get("/", getAll);
router.get("/course-overview/:courseId", getByCourseId);
router.get("/data/:id", auth, getAllDataById);
router.get('/get_enrolled',authrization,getCourseByStudent)

module.exports = router;
