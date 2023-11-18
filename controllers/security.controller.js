const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {newPasswordValidate} = require('../helpers/validation');
const Student = require('../model/student.js');

const changePassword = async (req, res) => {
    try{
        const student = await Student.findById(req.body.id);

        // Verifying the student old password before update the new password 
        const validPassword = await bcrypt.compare(req.body.currentPass, student.Password);
        if(!validPassword) return res.status(400).send('Incorrect password');

        // Checking the new password complexity
        const {error} = newPasswordValidate(_.pick(req.body, ['New password']));
        if(error) return res.status(400).send(error.details[0].message);

        if(req.body['New password'] !== req.body.confirmPass) return res.status(400).send('Confirm password not matched');
        
        const hash = await bcrypt.hash(req.body['New password'], 12);
        await Student.findByIdAndUpdate(req.body.id, {Password: hash});
        res.send('Password updated');
        
    }catch(err){
        res.status(500).send('Internal server error');
    }
}

const googleDisconnect = async(req, res) => {
    try {
        const updatedData = await Student.findByIdAndUpdate(req.body.id, {
            login_type: 'normal'
        },{new: true})
        res.send(updatedData.login_type);
    } catch (error) {
        res.status(500).send('Internal server error. Try again');
    }
}


module.exports = {changePassword, googleDisconnect};