const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ["student", "teacher"],
      // default: "student",
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  versionKey: false,
});

const User = model("User", userSchema);

module.exports = User;
