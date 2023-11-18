const ejs = require('ejs');
const path = require('path');
const transporter = require('./transporter.js');


async function mail(formData){
    const templatePath = path.join(__dirname, '../views/application.ejs'); 
    const {Name, Institute, Department, Study_of_year, Phone, Email, Street, City, Zip, answers, Facebook, LinkedIn, Twitter} = formData;
    try{
        const data = await ejs.renderFile(templatePath, {Name, Institute, Department, Study_of_year, Facebook, LinkedIn, Twitter, Phone, Email, Street, City, Zip, Q1: answers['Question 1'], Q2: answers['Question 2'], Q3: answers['Question 3'], Q4: answers['Question 4']}); 

        await transporter.sendMail({
            from: 'NonAcademy <nonacademy.net@gmail.com>', 
            to: 'nonacademy1@gmail.com',
            subject: "Campus Ambassador Application",
            html: data
        })
        
    }catch(err){
        console.log('Mail not sent');
    }
}

module.exports = mail;