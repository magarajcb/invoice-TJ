
const dashboardRepository = require("./dashboard.repository");

const getDashboard = async () => {
  const [summary, recentInvoices] = await Promise.all([
    dashboardRepository.getSummary(),
    dashboardRepository.getRecentInvoices()
  ]);

  return {
    ...summary,
    recentInvoices
  };
};

module.exports = { getDashboard };
