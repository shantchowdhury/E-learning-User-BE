const bcrypt = require('bcryptjs');
const mail = require('../mail/mail.js');
const Student = require('../model/student');


const accountDeactivate = async (req, res) => {
    try {
        // We are getting this id from the req.body that is assigned on authorization middlware  
        const {id, Password} = req.body;
        const student = await Student.findById(id);
        const validPassword = await bcrypt.compare(Password, student.Password);
        if(!validPassword) return res.status(400).send('Incorrect password');

        // We are not deleting the student data from the database permenantly. 
        student.is_active = false;
        await student.save(); 
        
        // Send an account deactivation mail to the student 
        mail({student, emailToken: null, type: 'deactivate'});
        res.clearCookie('access_token').send('Account Deactivated');

    } catch (err) {
        res.status(500).send('Internal server error')
    }
}

module.exports = {accountDeactivate};