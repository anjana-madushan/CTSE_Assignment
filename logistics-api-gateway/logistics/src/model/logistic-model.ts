import mongoose from "mongoose";

const Schema = mongoose.Schema;

const logisticSchema = new Schema({
  order_id: {
    type: String,
    required: true,
  },
  order_name: {
    type: String,
    required: true,
  },
  order_description: {
    type: String,
    required: true,
  },
  order_price: {
    type: Number,
    required: true,
  },
  order_quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  delivery_name: {
    type: String,
    required: true,
  },
  delivery_address: {
    type: String,
    required: true,
  },
  delivery_phone: {
    type: String,
    required: true,
  },
  delivery_email: {
    type: String,
    required: true,
  },
  sendername: {
    type: String,
    required: true,
  },
  sender_address: {
    type: String,
    required: true,
  },
  sender_email: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: false,
  },
  updated_at: {
    type: Date,
    required: false,
  },
});

const Logistic = mongoose.model("logistic", logisticSchema);

export default Logistic;
