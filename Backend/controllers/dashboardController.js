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

export const getJobStats = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      attributes: ["id", "title"],
    });

    const jobStats = await Promise.all(
      jobs.map(async (job) => {
        const totalApplicants = await Application.count({
          where: {
            jobId: job.id,
          },
        });

        const applied = await Application.count({
          where: {
            jobId: job.id,
            status: "Applied",
          },
        });

        const shortlisted = await Application.count({
          where: {
            jobId: job.id,
            status: "Shortlisted",
          },
        });

        const interview = await Application.count({
          where: {
            jobId: job.id,
            status: "Interview",
          },
        });

        const selected = await Application.count({
          where: {
            jobId: job.id,
            status: "Selected",
          },
        });

        const rejected = await Application.count({
          where: {
            jobId: job.id,
            status: "Rejected",
          },
        });

        return {
          jobTitle: job.title,
          totalApplicants,
          applied,
          shortlisted,
          interview,
          selected,
          rejected,
        };
      })
    );

    res.json({
      jobStats,
    });
  } catch (error) {
    console.error("Job stats error:", error);

    res.status(500).json({
      message: "Failed to fetch job statistics",
    });
  }
};

export const getApplicationStats = async (req, res) => {
  try {
    const applied = await Application.count({
      where: {
        status: "Applied",
      },
    });

    const shortlisted = await Application.count({
      where: {
        status: "Shortlisted",
      },
    });

    const interview = await Application.count({
      where: {
        status: "Interview",
      },
    });

    const selected = await Application.count({
      where: {
        status: "Selected",
      },
    });

    const rejected = await Application.count({
      where: {
        status: "Rejected",
      },
    });

    res.json({
      applied,
      shortlisted,
      interview,
      selected,
      rejected,
    });
  } catch (error) {
    console.error("Application stats error:", error);

    res.status(500).json({
      message: "Failed to fetch application statistics",
    });
  }
};