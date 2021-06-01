const mongoose = require("mongoose");
const validator = require("validator");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tasks= require("./task")


//User Schema

const userSchema = new mongoose.Schema(
  {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Email is invalid");
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) throw new Error("Age msut be a positive number");
    },
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 7,
    validate(value) {
      if (validator.equals(value, "password"))
        throw new Error("You cannot fill password as 'password' !!! ");
    },
  },
  tokens:[{
    token:{
      type: String,
      required: true
    }
  }],
  avatar:{
    type:Buffer
  }
},
  {
    timestamps:true
  }
);

userSchema.virtual("tasks", {
  ref: "Tasks",
  localField: "_id",
  foreignField: "owner",
});

//Generating auth token
userSchema.methods.generateAuthToken =async function(){
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "1 days",
  });
  user.tokens = user.tokens.concat({token})
  user.save()
  return token
}

//Generating user profile
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

userSchema.statics.findByCredentials = async(email, password) => {
  const user = await User.findOne({ email})

  if(!user) throw new Error('Unable to Login')

  const isMatched= await bycrypt.compare(password,user.password)

  if(!isMatched) throw new Error('Password did not match')

  return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
  const user=this

  if (user.isModified('password')){
    user.password = await bycrypt.hash(user.password, 8);
  }

  next()
})

// Delete user task when user is removed
userSchema.pre('remove' , async function(next) {
  const user=this
  await Tasks.deleteMany({owner:user._id})
  next()
})

// User moldel
const User = mongoose.model("User", userSchema);


module.exports = User