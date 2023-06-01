module.exports = (mongoose) => {
  const userSchema = new mongoose.Schema(
    {
      name: String,
      fullname: String,
      email: String,
      avatar: String,
      role: {
        type: String,
        enum: ["student", "teacher", "admin"],
        default: "student",
      },
    },
    { timestamps: true }
  );

  userSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;

    return object;
  });
  return mongoose.model("user", userSchema);
};
