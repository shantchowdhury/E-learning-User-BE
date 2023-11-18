const joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

// SCHEMAs
const registerSchema = joi.object({
     Name: joi.string().trim().min(2).max(30).required(),
     Email : joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] }}).required(),
     Phone : joi.string().trim().required(),
     Address : joi.string().trim().required(),
     Password : new PasswordComplexity({
        min: 8,
        max: 255,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4,
    })
})

const profileSchema = joi.object({
  Name: joi.string().trim().min(2).max(30).required(),
  Address: joi.string().trim().min(3).max(200).required()
})

const emailSchema = joi.object({
  Email : joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] }}).required()
})

const passwordSchema = joi.object({
  Password : new PasswordComplexity({
    min: 8,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
  })
})

const newPasswordSchema = joi.object({
  'New password' : new PasswordComplexity({
    min: 8,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
  })
})

const contactSchema = joi.object({
  Name: joi.string().trim().min(3).max(30).required(),
  Email : joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] }}).required(),
  Subject: joi.string().trim().min(10).max(255).required(),
  Message: joi.string().trim().min(20).max(4000).required(),
})


const applicationSchema = joi.object({
  Name: joi.string().trim().min(3).max(30).required(),
  Institute: joi.string().trim().max(500).required(),
  Department: joi.string().trim().max(500).required(),
  Year_of_study: joi.number().required(),
  Phone: joi.string().trim().required(),
  Email : joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] }}).required(),
  Street: joi.string().trim().max(255).required(),
  City: joi.string().trim().max(255).required(),
  Zip: joi.string().trim().max(10).required(),
  Q1: joi.string().trim().max(2000).required(),
  Q2: joi.string().trim().max(2000).required(),
  Q3: joi.string().trim().max(2000).required(),
  Q4: joi.string().trim().max(2000).required(),
  Facebook: joi.string().uri().required(),
  LinkedIn: joi.string().uri().required(),
  Twitter: joi.string().uri().allow('') 
})


//FUNCTIONS
function registerValidation(data){
    return registerSchema.validate(data);
}

function profileValidation(data){
  return profileSchema.validate(data);
}

function emailValidation(data){
  return emailSchema.validate(data)
}

function passwordValidation(data){
  return passwordSchema.validate(data);
}

function newPasswordValidation(data){
  return newPasswordSchema.validate(data);
}

function contactValidation(data){
  return contactSchema.validate(data);
}

function applicatinValidation(data){
  return applicationSchema.validate(data);
}

module.exports.registerValidate = registerValidation;
module.exports.profileValidate = profileValidation;
module.exports.emailValidate = emailValidation;
module.exports.passwordValidate = passwordValidation;
module.exports.newPasswordValidate = newPasswordValidation;
module.exports.contactValidate = contactValidation;
module.exports.applicationValidate = applicatinValidation;