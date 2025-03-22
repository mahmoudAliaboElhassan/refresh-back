const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  userName: {
    type: String,
    min: [3, "Must be at least 3, got {VALUE}"],
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true, // This field must be unique in the database
  },
  password: {
    type: String,
    required: true,
    min: [6, "Password must be at least 6 characters long"],
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
