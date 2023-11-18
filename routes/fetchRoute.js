const router = require('express').Router();
const {
    fetchSponsors, 
    fetchFaqs, 
    fetchTestimonials,
    fetchMembers,
    fetchPosts} = require('../controllers/fetch.controller.js');

router.get('/sponsors', fetchSponsors);
router.get('/faqs', fetchFaqs);
router.get('/testimonials', fetchTestimonials);
router.get('/members', fetchMembers); 
router.get('/posts', fetchPosts); 

module.exports = router;
