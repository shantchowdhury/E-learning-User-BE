const Course = require("../model/course");
const courseSection = require("../model/courseSection");
const courseSectionSubsection = require("../model/courseSectionSubsection");

const Student = require("../model/student");

const getAll = async (req, res) => {
  try {
    const course = await Course.find();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCourseByStudent = async (req, res) => {
  try {
    const studentId = req.body.id;
    console.log(studentId)
    const StudentInfo = await Student.findById(studentId);
    console.log(studentId)
    let result = [];

    const enrolledCourses = StudentInfo.courses;
    if(enrolledCourses.length>0){
      for (let i = 0; i < enrolledCourses.length; i++) {
        const courseId = enrolledCourses[i];
        const courseInfo = await Course.findById(courseId);
        result.push(courseInfo);
      }
      console.log(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getByCourseId = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllDataById = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const result = {
      courseId: course._id,
      courseName: course.name,
      coursePic: course.image,
      sections: [],
    };

    const sections = await courseSection.find({ courseId });
    for (const section of sections) {
      const sectionId = section._id;
      const sectionName = section.name;
      const sectionPic = section.image;

      const subSections = await courseSectionSubsection.find({
        courseSectionId: sectionId,
      });
      const subArr = subSections.map((subsection) => ({
        subSectionId: subsection._id,
        subSectionName: subsection.name,
        subSectionPic: subsection.image,
        subSectionVideo: subsection.video,
        subSectionFiles: subsection.file,
      }));

      result.sections.push({
        sectionId,
        sectionName,
        sectionPic,
        subsections: subArr,
      });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getAllDataById,
  getByCourseId,
  getCourseByStudent
};
