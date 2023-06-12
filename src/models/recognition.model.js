const mongoose = require("mongoose");

const recognitionSchema = new mongoose.Schema(
  {
    code: String,
    description: String,
    isStart: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

recognitionSchema.set("toJSON", {
  versionKey: false,
});

// recognitionSchema.pre("remove", function () {
//   return Recognition.deleteMany({ recognitionId: this._id });
// });

module.exports = mongoose.model("Recognition", recognitionSchema);
