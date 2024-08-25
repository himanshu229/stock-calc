import { connectToDatabase } from "@/db/dbConnection";
import StocksUnit from "@/db/models/StocksUnits";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { pathname } = new URL(request.url);
    const stockName = pathname.split("/").pop()?.replace("-", " ");

    const results = await StocksUnit.aggregate([
      { $match: { stockName } },
      { $sort: { date: -1 } },
    ]);

    return new Response(JSON.stringify(results), { status: 200 }); //-
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
