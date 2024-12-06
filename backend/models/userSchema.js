const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],  // Role can be admin, teacher, or student
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin", // Assuming there's an admin model that represents a school or institution
      required: true,
    },
    sclassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass", // Reference to the sclass collection if needed for students/teachers
    },
    extraInfo: {
      // Optional field to store additional information, such as department for teachers, etc.
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
