require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
//GOOGLE LOGIN 
const userRoute = require('./auth/routes/googleRoute');
require('./auth/controllers/passport')(passport);
// Email $ phone login 
const usersRoute = require('./auth/routes/userRoutes');
const hospitalRoutes = require('./hospital/routes/hospital');
const physicians = require('./physicians/routes/physicians');
const controllers = require('./consultation/routes/schedule');
//Db
mongoose.connect("mongodb://localhost:27017/curaster", {
  useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
}) 
app.use('/login', userRoute);
app.use('/api',usersRoute);
app.use('/api',hospitalRoutes);
app.use('/api',physicians);
app.use('/api',controllers);
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server is running on: ' + PORT));