const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


function jwtToken(student){
    const privateKey = fs.readFileSync(path.join(__dirname, './private.key'), 'utf8');
    const iss = "NonAcademy";
    const aud = "http://nonacademy.org";
    const exp = '30 days';
    const payload = _.pick(JSON.parse(JSON.stringify(student)),['_id', 'Name', 'Email', 'verified']);

    return jwt.sign(payload, privateKey, {
        issuer: iss,
        subject: payload.Name,
        audience: aud,
        expiresIn: exp,
        algorithm: 'RS256'
    })
}


// Creating email verification token for the user email verification 
function verificationToken(){
    return crypto.randomBytes(64).toString('hex')
}

module.exports.jwtToken = jwtToken;
module.exports.verificationToken = verificationToken;