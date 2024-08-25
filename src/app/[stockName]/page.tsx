"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";

const StockDetails = () => {
  const { stockName }: { stockName: string } = useParams();
  const [stockData, setStockData] = useState<any[]>([]);
  const [buyStockData, setBuyStockData] = useState<any[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/api/stocks/${stockName}`);
      setStockData(data);
      setBuyStockData(
        data.filter(
          (stock: any) =>
            stock.remainingQuantity !== 0 && stock.action !== "sell"
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <nav className="h-14 bg-black">
        <p className="text-white text-2xl text-center pt-3">
          {stockName.replace("-", " ").toUpperCase()}
        </p>
      </nav>
      <div>
        <button
          className="p-2 bg-blue-500 rounded-md text-white m-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          {"<- Back"}
        </button>
      </div>
      <div className="m-4">
        <table className="">
          <thead>
            <tr>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Date
              </th>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Action
              </th>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Quantiy
              </th>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Value of Sell/Buy
              </th>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Remaining Quantity
              </th>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {buyStockData?.map((stock: any) => (
              <tr
                key={stock._id}
                className={`${
                  stock.action.includes("buy")
                    ? stock.remainingQuantity === 0
                      ? "bg-gray-400"
                      : "bg-green-600"
                    : "bg-red-600"
                } text-white`}
              >
                <td className="border border-black px-3 py-3 text-center">
                  {moment(stock.date).format("DD-MM-YYYY")}
                </td>
                <td className="border border-black px-3 py-3 text-center uppercase">
                  {stock.action.toUpperCase()}
                </td>
                <td className="border border-black px-3 py-3 text-center">
                  {stock.quantity}
                </td>
                <td className="border border-black px-3 py-3 text-center">
                  {stock.valueBuySell}
                </td>
                <td className="border border-black px-3 py-3 text-center">
                  {stock.remainingQuantity}
                </td>
                <td className="border border-black px-3 py-3 text-center">
                  {stock.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="m-4">
        <table className="">
          <thead>
            <tr>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Date
              </th>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Action
              </th>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Quantiy
              </th>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Value of Sell/Buy
              </th>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Remaining Quantity
              </th>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Amount
              </th>
              <th className="bg-gray-600 text-white border border-black px-6 py-3">
                Profit / Loss
              </th>
            </tr>
          </thead>
          <tbody>
            {stockData?.map((stock: any) => (
              <tr
                key={stock._id}
                className={`${
                  stock.action.includes("buy")
                    ? stock.isSell
                      ? "bg-gray-400"
                      : "bg-green-600"
                    : "bg-red-600"
                } text-white`}
              >
                <td className="border border-black px-3 py-3 text-center">
                  {moment(stock.date).format("DD-MM-YYYY")}
                </td>
                <td className="border border-black px-3 py-3 text-center uppercase">
                  {stock.action.toUpperCase()}
                </td>
                <td className="border border-black px-3 py-3 text-center">
                  {stock.quantity}
                </td>
                <td className="border border-black px-3 py-3 text-center">
                  {stock.valueBuySell}
                </td>
                <td className="border border-black px-3 py-3 text-center">
                  {stock.remainingQuantity}
                </td>
                <td className="border border-black px-3 py-3 text-center">
                  {stock.totalAmount}
                </td>
                <td className="border border-black px-3 py-3 text-center">
                  {stock.profitMargin}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StockDetails;
