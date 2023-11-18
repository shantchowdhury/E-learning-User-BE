const _ = require('lodash');
const bcrypt = require('bcryptjs');
const mail = require('../mail/mail');
const {registerValidate, passwordValidate} = require('../helpers/validation');
const {verificationToken, jwtToken} = require('../helpers/token')
const Student = require('../model/student');
const Email = require('../model/email');
const Forgot = require('../model/forgot');
const jwt=require('jsonwebtoken');

const IP = require('ip');

const fetchUser = async (req, res) => {
  try {
    const student = await Student.findById(req.body.id);
    res.send(student);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
}

const signup = async (req, res) => {
    try {
      const filteredData = function(studentData){
        return _.omit(JSON.parse(JSON.stringify(studentData)),['Password', 'is_active', '_id', '__v'])
      }

      const {error} = registerValidate(_.omit(req.body, ['joined']));
      if(error) return res.status(400).send(error.details[0].message);

      const checkEmail = await Student.findOne({Email : req.body.Email});
      if(checkEmail) return res.status(400).send('Email is already registered'); 

      const checkPhone = await Student.findOne({Phone : req.body.Phone});
      if(checkPhone) return res.status(400).send('Phone is already in use'); 

      const hash = await bcrypt.hash(req.body.Password, 12);
      req.body.Password = hash;

      const student = new Student(req.body);
      await student.save();

      const emailToken = verificationToken();
      const newEmail = new Email({student: student._id, token: emailToken});
      await newEmail.save();
      mail({student, emailToken, type: 'verification'});


      // const cookieOption = {path: '/', httpOnly: true, secure: true, sameSite: 'none', maxAge: 2592000 * 1000};
      // res.status(201).cookie('access_token',jwtToken(student), cookieOption).send(filteredData(student));
         // Generate and sign the new JWT token with the user's _id
         const token = jwt.sign({ id: student._id },process.env.JWT_SECRET , {
          expiresIn: 30 * 24 * 60 * 60,
      });
    
        res.status(201).json({ token, student: student});

    } catch (err) {
      res.status(500).send('Internal server error');
  }
}

const googleSignin = async(req, res) => {
  try {
      // const cookieOption = {path: '/', httpOnly: true, secure: true, sameSite: 'Lax', maxAge: 2592000 * 1000};
    //  const filteredData = function(studentData){
    //    return _.omit(JSON.parse(JSON.stringify(studentData)),['Password', 'is_active', '_id', '__v'])
    //  }

     const student = await Student.findOne({Email : req.body.Email});
     if(student) {
        if(student.login_type !== 'google') return res.status(400).send('Email is already registered');
        if(!student.is_active) return res.status(400).send('Your account is closed')
        // return res.cookie('access_token', jwtToken(student), cookieOption).send(filteredData(student)); 
        const token = jwt.sign({ id: student._id },process.env.JWT_SECRET , {
          expiresIn: 30 * 24 * 60 * 60,
      });
    
        res.status(200).json({ token, student: student});
     }else{
       const hash = await bcrypt.hash(req.body.Password, 12);
       req.body.Password = hash;

       const newStudent = new Student(req.body);
       await newStudent.save();

       if(!newStudent.verified){
          const emailToken = verificationToken();
          const newEmail = new Email({student: newStudent._id, token: emailToken});
          await newEmail.save();
          mail({student: newStudent, emailToken, type: 'verification'});
       };

      // res.status(201).cookie('access_token',jwtToken(newStudent), cookieOption).send(filteredData(newStudent));
      const token = jwt.sign({ id: student._id },process.env.JWT_SECRET , {
        expiresIn: 30 * 24 * 60 * 60,
    });
  
      res.status(201).json({ token, student: newStudent});
      
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
}

const signin = async (req, res) => {
  try {  
    console.log('controller')
      const student = await Student.findOne({Email: req.body.Email});
      if(!student) return res.status(400).send('Incorrect Email or Password');
      const validPassword = bcrypt.compare(req.body.Password, student.Password);
      if(!validPassword) return res.status(400).send('Incorrect Email or Password');

      if(!student.is_active) return res.status(400).send('Your account is closed');

      // Generate new jwt token 
      // const authToken = jwtToken(student);

      // res.cookie('access_token', authToken, {
      //     path: '/',
      //     httpOnly: true, 
      //     secure: true,
      //     sameSite: 'none',
      //     maxAge: 2592000 * 1000 // 30 days
      // }).send(_.omit(JSON.parse(JSON.stringify(student)), ['Password', 'is_active', '_id', '__v']));

     
      const token = jwt.sign({ id: student._id },process.env.JWT_SECRET , {
        expiresIn: 30 * 24 * 60 * 60,
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      });
      res.status(201).json({ token, student: student});

  } catch (err) {
    console.log(err);
      res.status(500).send('Internal server error');
  }
}

const logout = async (req, res) => {
  try{
      res.clearCookie('access_token').send('Logged out');
  }catch(err){
      res.status(500).send('Internal server error');
  }
}

const forgotPassword = async(req, res) => {
  try{
      const {email} = req.body;
      const student = await Student.findOne({Email: email});
      if(!student) return res.status(400).send("This email is not registered");
      if(!student.is_active) return res.status(400).send("Your account is closed");
      const emailToken = verificationToken();
      await Forgot.deleteMany({student: student._id});
      const forgot = new Forgot({student: student._id, token: emailToken, expire: Date.now() + 1800000});
      await forgot.save();

      mail({student, emailToken, type: 'password'});
      res.send('Check email for reset link');
  }catch(err){
      return res.status(500).send('Internal server error');
  }
}

const resetPassword = async(req, res) => {
  try{
      const {studentId, token} = req.params;
      
      const validToken = await Forgot.findOne({student: studentId, token});
      if(!validToken) return res.status(400).send('Link is not valid');
      if(Date.now() > validToken.expire) return res.status(400).send('Link is not valid');
      const {error} = passwordValidate({Password: req.body.Password});
      if(error) return res.status(400).send(error.details[0].message);

      if(req.body.Password !== req.body.confirmPass) return res.status(400).send('Confirm password not matched');

      const hash = await bcrypt.hash(req.body.Password, 12);
      await Student.findByIdAndUpdate(studentId, {Password: hash});
      await Forgot.deleteMany({student: studentId});
      res.send('Password updated');

  }catch(err){
      return res.status(500).send('Internal server error');
  }
}

module.exports = {fetchUser, signup, googleSignin, signin, logout, forgotPassword, resetPassword};