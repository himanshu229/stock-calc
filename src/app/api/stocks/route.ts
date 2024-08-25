import { connectToDatabase } from "@/db/dbConnection";
import StocksUnit from "@/db/models/StocksUnits";

export async function GET() {
  try {
    await connectToDatabase();

    const results = await StocksUnit.aggregate([
      {
        $match: {
          action: "buy",
        },
      },
      {
        $group: {
          _id: "$stockName",
          totalQuantity: { $sum: "$remainingQuantity" },
          totalAmount: { $sum: "$totalAmount" },
          totalValueBuySell: { $sum: "$valueBuySell" },
          totalProfitMargin: { $sum: "$profitMargin" },
        },
      },
      {
        $project: {
          _id: 0,
          stockName: "$_id",
          totalQuantity: 1,
          totalAmount: 1,
          totalValueBuySell: 1,
          totalProfitMargin: 1,
          averagePrice: {
            $cond: {
              if: { $eq: ["$totalQuantity", 0] },
              then: 0,
              else: { $divide: ["$totalAmount", "$totalQuantity"] },
            },
          },
        },
      },
      {
        $sort: {
          stockName: 1,
        },
      },
    ]);

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(request: {
  json: () =>
    | PromiseLike<{
        stockName: string;
        date: any;
        quantity: any;
        valueBuySell: any;
        action: string;
        totalAmount: any;
      }>
    | {
        stockName: string;
        date: any;
        quantity: any;
        valueBuySell: any;
        action: string;
        totalAmount: any;
      };
}) {
  try {
    await connectToDatabase();

    const { stockName, date, quantity, valueBuySell, action } =
      await request.json();

    if (!stockName || !date || !quantity || !valueBuySell || !action) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return new Response(JSON.stringify({ message: "Invalid date format" }), {
        status: 400,
      });
    }

    if (action.toLowerCase() === "sell") {
      let tempQuantity = parseInt(quantity);

      let existingStock = await StocksUnit.aggregate([
        {
          $match: {
            stockName: stockName.toLowerCase(),
            action: "buy",
            remainingQuantity: { $gt: 0 },
            isSell: false,
          },
        },
        { $sort: { valueBuySell: 1 } },
      ]);

      existingStock = existingStock
        .map((stock) => {
          if (tempQuantity > 0) {
            tempQuantity = tempQuantity - stock.remainingQuantity;
            let calQuantity = tempQuantity >= 0 ? 0 : Math.abs(tempQuantity);
            let calValueBuySellProfit = valueBuySell - stock.valueBuySell;

            let calProfitMargin =
              calQuantity === 0
                ? stock.profitMargin > 0
                  ? stock.profitMargin +
                    calValueBuySellProfit * stock.remainingQuantity
                  : calValueBuySellProfit * stock.quantity
                : stock.profitMargin > 0
                ? stock.profitMargin +
                  calValueBuySellProfit *
                    (stock.remainingQuantity - calQuantity)
                : calValueBuySellProfit * (stock.quantity - calQuantity);

            return {
              updateOne: {
                filter: { _id: stock._id },
                update: {
                  $set: {
                    remainingQuantity: calQuantity,
                    totalAmount: stock.valueBuySell * calQuantity,
                    profitMargin: calProfitMargin,
                    isSell: calQuantity === 0,
                  },
                },
              },
            };
          }
          return null;
        })
        .filter((stock) => stock !== null);
      console.log(existingStock);

      await StocksUnit.bulkWrite(existingStock);
      const newStockUnit = new StocksUnit({
        stockName: stockName.toLowerCase(),
        date: parsedDate,
        quantity,
        valueBuySell,
        action: action.toLowerCase(),
        totalAmount: valueBuySell * quantity,
        remainingQuantity: 0,
        profitMargin: 0,
      });

      await newStockUnit.save();
    } else {
      const newStockUnit = new StocksUnit({
        stockName: stockName.toLowerCase(),
        date: parsedDate,
        quantity,
        valueBuySell,
        action: action.toLowerCase(),
        totalAmount: valueBuySell * quantity,
        remainingQuantity: quantity,
        profitMargin: 0,
      });

      await newStockUnit.save();
    }

    return new Response(
      JSON.stringify({ message: "Stock unit created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
