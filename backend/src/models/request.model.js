import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, index: true },
    image: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Request", RequestSchema);


