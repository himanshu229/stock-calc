"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import axios from "axios";
import AddStocksDetails from "@/components/AddStocksDetails";

export default function Home() {
  const [stocksData, setStockData] = useState<any[]>([]);
  const [isStockAdd, setIsStockAdd] = useState<boolean>(false);
  const router = useRouter()
  const fetchData = async () => {
    try {
      const { data } = await axios.get("/api/stocks");
      setStockData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <nav className="h-14 bg-black" />
      <div>
        <button
          className="p-2 bg-blue-500 rounded-md text-white m-4 cursor-pointer"
          onClick={() => setIsStockAdd(!isStockAdd)}
        >
          {isStockAdd ? "Back" : "Add stocks"}
        </button>
      </div>
      {isStockAdd ? (
        <AddStocksDetails />
      ) : (
        <div className="m-4">
          <table className="">
            <thead>
              <tr>
                <th className="bg-gray-600 text-white border border-black px-6 py-3">
                  Stock Name
                </th>
                <th className="bg-gray-600 text-white border border-black px-6 py-3">
                  Remaining Quantiy
                </th>
                <th className="bg-gray-600 text-white border border-black px-6 py-3">
                  Total Amount
                </th>
                <th className="bg-gray-600 text-white border border-black px-6 py-3">
                  Average Price
                </th>
                <th className="bg-gray-600 text-white border border-black px-6 py-3">
                  Total Profit Margin
                </th>
              </tr>
            </thead>
            <tbody>
              {stocksData?.map((stock: any) => (
                <tr key={stock._id} className="bg-orange-600 text-white  cursor-pointer hover:bg-red-500" onClick={()=>router.push(`/${stock.stockName.replace(" ","-")}`)}>
                  <td className="border border-black px-3 py-3 text-center uppercase">{stock.stockName}</td>
                  <td className="border border-black px-3 py-3 text-center">{stock.totalQuantity}</td>
                  <td className="border border-black px-3 py-3 text-center">{stock.totalAmount}</td>
                  <td className="border border-black px-3 py-3 text-center">{stock.averagePrice}</td>
                  <td className="border border-black px-3 py-3 text-center">{stock.totalProfitMargin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
