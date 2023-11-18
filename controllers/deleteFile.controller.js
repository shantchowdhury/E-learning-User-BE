const AWS = require('aws-sdk');
const config = require('config');
const path = require('path');
const Student = require('../model/student.js');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const cvBucketName = process.env.STUDENTS_CV_BUCKET;

const deleteCV = async (req, res) => {
  try {
    const student = await Student.findById(req.body.id);
    if (!student.verified) return res.status(400).send('First you need to verify your email');
    if (!student.CV) return res.status(400).send('CV not uploaded');

    const params = {
      Bucket: cvBucketName,
      Key: student.CV,
    };

    s3.deleteObject(params, async (err) => {
      if (err) {
        return res.status(500).send('File deletion error');
      }

      student.CV = '';
      await student.save();
      res.send('CV deleted');
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
}

module.exports = { deleteCV };
