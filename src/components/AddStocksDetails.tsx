import axios from "axios";
import { useState } from "react";

export default function AddStocksDetails() {
  const [fieldDetails, setFieldDetails] = useState<any>({});

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      await axios.post("/api/stocks", fieldDetails);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event: { target: { name: any; value: any } }) => {
    setFieldDetails({
      ...fieldDetails,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="m-4 w-1/3">
      <div className="flex justify-between items-center mb-4">
        <span className="text-base me-4">Action:</span>
        <input
          type="text"
          name="action"
          autoCapitalize="off"
          value={fieldDetails.action}
          onChange={handleChange}
          className="border-2 border-blue-400 h-10 w-64 rounded-md p-1"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-base me-4">Name:</span>
        <input
          type="text"
          name="stockName"
          autoCapitalize="off"
          value={fieldDetails.stockName}
          onChange={handleChange}
          className="border-2 border-blue-400 h-10 w-64 rounded-md p-1"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-base me-4">Buy/Sell Value:</span>
        <input
          type="number"
          name="valueBuySell"
          autoCapitalize="off"
          value={fieldDetails.valueBuySell}
          onChange={handleChange}
          className="border-2 border-blue-400 h-10 w-64 rounded-md p-1"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-base me-4">Quantity:</span>
        <input
          type="number"
          name="quantity"
          autoCapitalize="off"
          value={fieldDetails.quantity}
          onChange={handleChange}
          className="border-2 border-blue-400 h-10 w-64 rounded-md p-1"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-base me-4">Date:</span>
        <input
          type="date"
          name="date"
          autoCapitalize="off"
          value={fieldDetails.date}
          onChange={handleChange}
          className="border-2 border-blue-400 h-10 w-64 rounded-md p-1"
        />
      </div>
      <button type="submit" className="p-2 bg-green-500 rounded-md">
        Submit
      </button>
    </form>
  );
}
