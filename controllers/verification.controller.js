const {verificationToken} = require('../helpers/token.js');
const mail = require('../mail/mail.js');
const Student = require('../model/student.js');
const Email = require('../model/email.js');

const emailVerification = async (req, res) => {
    try{
        const {studentId, token} = req.params;
        
        const student = await Student.findById(studentId);
        if(student.verified) return res.send('Email is already verified');

        const validToken = await Email.findOne({student: studentId, token});
        if(!validToken) return res.status(400).send('Link is not valid');

        student.verified = true;
        await student.save();
        await Email.deleteMany({student: studentId});
        res.send('Email is verified');

    }catch(err){
        return res.status(400).send('Link is not valid');
    }
}

const resendEmail = async(req, res) => {
    try {
        const {id} = req.body;
        const student = await Student.findById(id); 
        if(student.verified) return res.status(400).send('Email is already verified'); 

        const emailToken = verificationToken();
        await Email.deleteMany({student: id});

        const newEmail = new Email({student: id, token: emailToken});
        await newEmail.save();

        mail({student, emailToken, type: 'verification'});
        res.send('Email sent');
    } catch (err) {
        res.status(500).send('Internal server error')
    }
}


module.exports = {emailVerification, resendEmail,};