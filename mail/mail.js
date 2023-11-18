const ejs = require('ejs');
const path = require('path');
const config = require('config');
const transporter = require('./transporter.js');

// Collecting the student information where the mail function is called 
async function mail({student, emailToken, type}){
    let templatePath, subject;
    const {Name, Email, _id} = student;

    switch (type) {
        case 'verification':
            templatePath = path.join(__dirname, '../views/verification.ejs');
            subject = 'Verify your email address';
        break;

        case 'email_update' : 
            templatePath = path.join(__dirname, '../views/emailUpdate.ejs');
            subject = 'Verify your new email address';
        break;
    
        case 'password' : 
            templatePath = path.join(__dirname, '../views/passwordReset.ejs');
            subject = 'Reset your password'
        break;
        
        case 'deactivate':
            templatePath = path.join(__dirname, '../views/accountDeactivate.ejs');
            subject = 'Account deactivated';
        break;
    }


    try{  
        const url = config.get('client_url');
        const data = await ejs.renderFile(templatePath, {Name, token: emailToken, studentId: _id,  url}); 

        await transporter.sendMail({
            from: 'NonAcademy <nonacademy.net@gmail.com>', 
            to: Email,
            subject: subject,
            html: data
        })
        
    }catch(err){
        console.log('Mail not sent');
    }
}

module.exports = mail;