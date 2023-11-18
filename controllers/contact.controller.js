const _ = require('lodash');
const Contact = require('../model/contact.js');
const {contactValidate} = require('../helpers/validation');

const SaveMessage = async (req, res) => {
    try {
        const {error} = contactValidate(_.omit(req.body,['date']));
        if(error) return res.status(400).send(error.details[0].message);

        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).send('Your message has been sent');
    } catch (err) {
        res.status(500).send('Internal server error');
    }
}

module.exports = SaveMessage;