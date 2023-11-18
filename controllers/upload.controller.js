const AWS = require('aws-sdk');
const config = require('config');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const Student = require('../model/student.js');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const imageBucketName = process.env.STUDENTS_IMAGE_BUCKET;
const cvBucketName = process.env.STUDENTS_CV_BUCKET;

const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('File not found');
    const { id } = JSON.parse(JSON.stringify(req.body));
    const student = await Student.findById(id);

    if (student.profile_image.normal !== 'default.png') {
      // Delete the previous image from AWS S3
      const params = {
        Bucket: imageBucketName,
        Key: student.profile_image.normal,
      };
      s3.deleteObject(params, (err) => {
        if (err) {
          console.log('Error deleting previous image:', err);
        }
      });
    }

    const ext = req.file.mimetype.split('/')[1];
    const uid = uuidv4() + "-" + Date.now();
    if (!['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return res.status(400).send('Unsupported Image file');

    const params = {
      Bucket: imageBucketName,
      Key: uid + '.' + ext,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
      ContentDisposition: 'inline', 
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        return res.status(500).send('File upload error');
      }

      const updatedData = await Student.findByIdAndUpdate(id, {
        profile_image: {
          normal: data.Key,
          google_pic: null
        }
      }, { new: true });
      res.send(updatedData.profile_image);
    });

  } catch (error) {
    res.status(500).send('Internal server error' + error.message);
  }
}

const uploadCV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('File not found');
    const { id } = JSON.parse(JSON.stringify(req.body));

    const ext = req.file.mimetype.split('/')[1];
    const uid = uuidv4() + "-" + Date.now();
    if (ext !== 'pdf') return res.status(400).send('Upload a pdf file');

    const params = {
      Bucket: cvBucketName,
      Key: uid + '.' + ext,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
      ContentDisposition: 'inline', 
    };

    s3.upload(params, async (err, data) => {
      if (err) {
        return res.status(500).send('File upload error');
      }

      await Student.findByIdAndUpdate(id, { CV: data.Key });
      res.send(data.Key);
    });

  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

module.exports = { uploadImage, uploadCV };
