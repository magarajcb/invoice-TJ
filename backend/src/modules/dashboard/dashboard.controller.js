
const dashboardService = require("./dashboard.service");

const getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboard();

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard"
    });
  }
};

module.exports = { getDashboard };
