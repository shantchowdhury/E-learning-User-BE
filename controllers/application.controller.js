const AWS = require('aws-sdk');
const config = require('config');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Application = require('../model/application.js');
const { applicationValidate } = require('../helpers/validation.js');
const mail = require('../mail/applicationMail.js');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const imageBucketName = process.env.AMBASSADOR_IMAGE_BUCKET;

const submit = async (req, res) => {
  try {
    const data = req.body;
    const { error } = applicationValidate(data);
    if (error) return res.status(400).send(error.details[0].message);

    if (!req.file) return res.status(400).send('Upload your photo');
    const ext = req.file.mimetype.split('/')[1];
    const uid = uuidv4() + "-" + Date.now();
    if (!['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return res.status(400).send('Unsupported image');

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

      const application = new Application({
        ..._.omit(req.body, ['Q1', 'Q2', 'Q3', 'Q4']),
        profile_image: data.Key,
        answers: {
          'Question 1': req.body.Q1,
          'Question 2': req.body.Q2,
          'Question 3': req.body.Q3,
          'Question 4': req.body.Q4,
        }
      });
      await application.save();
      mail(application);
      res.status(200).send("Form submitted");
    });
  } catch (error) {
    res.status(500).send('Internal server error');
  }
}

module.exports = { submit };

