import { Job } from "../models/index.js";

export const createJob = async (req, res) => {
  try {
   const {
  title,
  company,
  location,
  description,
  experience,
  requiredSkills,
  salary,
  employmentType,
} = req.body;

    if (!title || !company || !location || !description || !experience || !requiredSkills) {
      return res.status(400).json({
        message: "Title, company, location and description are required",
      });
    }

   const job = await Job.create({
  title,
  company,
  location,
  description,
  experience,
  requiredSkills,
  salary,
  employmentType,
});

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    res.status(500).json({
      message: "Failed to create job",
    });
  }
};
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
};
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json({
      job,
    });
  } catch (error) {
    console.error("Get job error:", error);

    res.status(500).json({
      message: "Failed to fetch job",
    });
  }
};
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const {
      title,
      company,
      location,
      description,
      experience,
      requiredSkills,
      salary,
      employmentType,
    } = req.body;

    await job.update({
      title,
      company,
      location,
      description,
      experience,
      requiredSkills,
      salary,
      employmentType,
    });

    res.json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error);

    res.status(500).json({
      message: "Failed to update job",
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    await job.destroy();

    res.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);

    res.status(500).json({
      message: "Failed to delete job",
    });
  }
};