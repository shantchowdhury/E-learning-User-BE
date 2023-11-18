const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {profileValidate, emailValidate} = require('../helpers/validation');
const {verificationToken} = require('../helpers/token.js');
const mail = require('../mail/mail.js');
const Student = require('../model/student.js');
const EmailModel = require('../model/email.js');

const updateProfile = async (req, res) => {
    try {
        const {error} = profileValidate(_.omit(req.body, ['id']));
        if(error) return res.status(400).send(error.details[0].message); 
        
        const student = await Student.findById(req.body.id);
        if(!student.verified) return res.status(400).send('First you need to verify your email');
        if((student.Name === req.body.Name) && student.Address === req.body.Address) return res.status(400).send("Change your profile information");

        const updatedData = await Student.findByIdAndUpdate(req.body.id, {
            Name: req.body.Name,
            Address: req.body.Address
        }, {new: true})

        res.send(_.pick(updatedData, ['Name', 'Address']));

    } catch (err) {
        res.status(500).send('Internal server error')
    }
}

const updatePhone = async (req, res) => {
    try{
        const {Phone, Password, id} = req.body;

        // VALIDATE THE PASSWORD 
        const student = await Student.findById(id);
        const validPassword = await bcrypt.compare(Password, student.Password);
        if(!validPassword) return res.status(400).send('Incorrect password');
        if(!student.verified) return res.status(401).send('First you need to verify your email');
        
        const checkPhone = await Student.findOne({Phone});
        if(checkPhone) return res.status(400).send('This number is already in use!'); 
        await Student.findByIdAndUpdate(id, {Phone});
        res.send({Phone});
    }catch(err){
        res.status(500).send('Internal server error');
    }
}

const updateEmail = async (req, res) => {
    try{
        const {Email, Password, id} = req.body;

        // CHECK IF THE EMAIL IS VALID 
        const {error} = emailValidate({Email});
        if(error) return res.status(400).send(error.details[0].message);

        // VALIDATE THE PASSWORD 
        const student = await Student.findById(id);
        const validPassword = await bcrypt.compare(Password, student.Password);

        if(!validPassword) return res.status(400).send('Incorrect password');
        if(!student.verified) return res.status(400).send("Email is not verified");
        
        const checkEmail = await Student.findOne({Email});
        if(checkEmail) return res.status(400).send('Email is already in use'); 

        const updatedDate = await Student.findByIdAndUpdate(id, {Email, verified: false, login_type: 'normal'}, {new: true});
        
        const emailToken = verificationToken();
        const newEmail = new EmailModel({student: id, token: emailToken});
        await newEmail.save();
        mail({student: {Name: student.Name, Email, _id: id}, emailToken, type:'email_update'});

        res.send(_.pick(updatedDate, ['Email', 'verified', 'login_type']));
    }catch(err){
        res.status(500).send('Internal server error');
    }
}





module.exports = {updateProfile, updateEmail, updatePhone};