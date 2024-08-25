import mongoose from "mongoose";

const StocksUnitsSchema = new mongoose.Schema({
  stockName: { type: String, required: true },
  date: { type: Date, required: true },
  quantity: { type: Number, require: true },
  valueBuySell: { type: Number, require: true },
  action: { type: String, require: true },
  totalAmount: { type: Number, require: true },
  remainingQuantity: { type: Number, require: true },
  profitMargin: { type: Number, require: true },
  isSell: { type: Boolean, default: false },
});

const StocksUnit =
  mongoose.models.StocksUnit || mongoose.model("StocksUnit", StocksUnitsSchema);

export default StocksUnit;
