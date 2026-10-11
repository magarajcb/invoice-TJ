
const Invoice = require("../invoice/invoice.model");

const getSummary = async () => {
  const [summary] = await Invoice.aggregate([
    {
      $match: {
        status: { $ne: "Voided" }
      }
    },
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        totalSalesRevenue: {
          $sum: {
            $cond: [
              { $eq: ["$status", "Issued"] },
              "$grandTotal",
              0
            ]
          }
        },
        amountPaid: {
          $sum: {
            $cond: [
              { $eq: ["$status", "Issued"] },
              "$amountPaid",
              0
            ]
          }
        },
        outstandingBalance: {
          $sum: {
            $cond: [
              { $eq: ["$status", "Issued"] },
              { $subtract: ["$grandTotal", "$amountPaid"] },
              0
            ]
          }
        },
        draftInvoices: {
          $sum: {
            $cond: [{ $eq: ["$status", "Draft"] }, 1, 0]
          }
        },
        paidInvoices: {
          $sum: {
            $cond: [{ $eq: ["$paymentStatus", "Paid"] }, 1, 0]
          }
        },
        unpaidInvoices: {
          $sum: {
            $cond: [{ $eq: ["$paymentStatus", "Unpaid"] }, 1, 0]
          }
        },
        partialInvoices: {
          $sum: {
            $cond: [{ $eq: ["$paymentStatus", "Partial"] }, 1, 0]
          }
        }
      }
    },
    { $project: { _id: 0 } }
  ]);

  return summary || {
    totalInvoices: 0,
    totalSalesRevenue: 0,
    amountPaid: 0,
    outstandingBalance: 0,
    draftInvoices: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
    partialInvoices: 0
  };
};

const getRecentInvoices = () =>
  Invoice.find({ status: { $ne: "Voided" } })
    .populate("customer", "name phone email")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

module.exports = {
  getSummary,
  getRecentInvoices
};
    