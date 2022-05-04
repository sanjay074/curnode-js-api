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
async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://userProfiles:MoBohTt3PGtlsyCy@cluster0.nx0ry.mongodb.net/eHospiDatabase?retryWrites=true&w=majority"
    );
    console.log("Database connected sucessfully");
  } catch (error) {
    console.log(error);
  }
}
main();
app.use('/login', userRoute);
app.use('/api',usersRoute);
app.use('/api',hospitalRoutes);
app.use('/api',physicians);
app.use('/api',controllers);
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server is running on: ' + PORT));