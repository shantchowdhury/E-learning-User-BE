require('dotenv').config();
require('./model/admin.js');
require('./model/category.js');

const config = require('config');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');

const IP = require('ip');


const app = express();
const path = require('path');
let port = process.env.PORT || 5050;


const studentRoutes = require('./routes/studentRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const profileRoutes = require('./routes/profileRoutes');
const securityRoutes = require('./routes/securityRoutes');
const deactivateRoute = require('./routes/deactivateRoute');
const uploadRoutes = require('./routes/uploadRoutes'); 
const deleteFileRoute = require('./routes/deleteFileRoutes');
const contactRoute = require('./routes/contactRoute');
const applicationRoute = require('./routes/applicationRoute');
const fetchRoute = require('./routes/fetchRoute');

const courseRoute = require('./routes/courseRoute.js');
const paymentRoute = require('./routes/paymentRouter.js');

require('./db/conn')();


const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.set('view engine', 'views');


app.get('/', (req, res) => {
    res.send('Welcome to NonAcademy.')
});


app.use('/api/student', studentRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/deleteFile', deleteFileRoute);
app.use('/api/security', securityRoutes);
app.use('/api/settings', deactivateRoute);
app.use('/api/contact', contactRoute);
app.use('/api/application', applicationRoute);
app.use('/api/fetch', fetchRoute);

app.use('/api/course',courseRoute);
app.use('/api/payment',paymentRoute);

app.use('/upload', express.static(path.join(__dirname, 'public')));


app.listen(port, function () {
    console.log(`You are listening to the port ${port}`)
});