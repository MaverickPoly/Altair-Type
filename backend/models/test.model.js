import mongoose from "mongoose";

const TestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    time: { type: Number, required: true }, // Number of seconds
    type: { type: String, required: true }, // Time, Word, Custom
    wordCount: { type: Number, required: true }, // Number of words in test
      language: {type: String, required: true},
  },
  {
    timestamps: true,
  },
);

const TestModel = mongoose.model("test", TestSchema);

export default TestModel;
