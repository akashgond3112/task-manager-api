const mongoose=require('mongoose');

const username =process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DATABASE;



const url =
  "mongodb+srv://" +
  username +
  ":" +
  password +
  "@tutorial.tzzkl.mongodb.net/" +
  database +
  "?retryWrites=true&w=majority";

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true,
  useFindAndModify: true
});

