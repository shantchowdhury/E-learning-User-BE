const Sponsor = require('../model/sponsor.js');
const Faq = require('../model/faq.js');
const Testimonial = require('../model/testimonial.js');
const Team = require('../model/team.js');
const Post = require('../model/post.js');


const fetchSponsors = async (req, res) => {
    try {
    const sponsors = await Sponsor.find().select('-__v');
    res.send(sponsors); 

    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const fetchFaqs = async (req, res) => {
    try {
    const faqs = await Faq.find().select('-__v -date');
    res.send(faqs); 

    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const fetchTestimonials = async (req, res) => {
    try {
    const testimonials = await Testimonial.find().select('-__v');
    res.send(testimonials); 

    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const fetchMembers = async (req, res) => {
    try {
    const members = await Team.find().select('-_id -__v');
    res.send(members); 

    } catch (error) {
        res.status(500).send('Internal server error');
    }
}

const fetchPosts = async (req, res) => {
    try {
    const posts = await Post.find().select('-_id -__v').populate({path: 'author category', select: "-_id Name image"});
    res.send(posts); 

    } catch (error) {
        res.status(500).send('Internal server error' + error.message);
    }
}

module.exports = {fetchSponsors, fetchFaqs, fetchTestimonials, fetchMembers, fetchPosts};