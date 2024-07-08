require('dotenv').config();
dbPassword=process.env.mongo_URI;
module.exports = {
  mongoURI: dbPassword
};