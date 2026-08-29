import { User, Job, Application } from "../models/index.js";
export const getDashboardSummary = async (req, res) => {
  try {
    const totalUsers = await User.count({
      where: {
        role: "user",
      },
    });
    const totalJobs = await Job.count();

    const activeJobs = await Job.count({
      where: {
        status: "active",
      },
    });

    const closedJobs = await Job.count({
      where: {
        status: "closed",
      },
    });

    const totalApplications = await Application.count();

    res.json({
      totalUsers,
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard summary",
    });
  }
};


