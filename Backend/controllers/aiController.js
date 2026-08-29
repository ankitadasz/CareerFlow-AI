import { Resume, Job } from "../models/index.js";
import { generateAIResponse } from "../services/geminiService.js";

export const analyzeResume = async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;

    const resume = await Resume.findOne({
      where: {
        id: resumeId,
        userId: req.user.id,
      },
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const prompt = `
You are an AI career assistant.

Analyze how well this resume matches the job.

JOB:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Required Skills: ${job.requiredSkills}
Experience: ${job.experience}

RESUME:
Title: ${resume.title}
Resume Text: ${resume.resumeText}

Provide:
1. Match score out of 100
2. Matching skills
3. Missing skills
4. Strengths
5. Suggestions for improvement

Keep the response clear and concise.
`;

    const analysis = await generateAIResponse(prompt);

    res.json({
      message: "Resume analyzed successfully",
      analysis,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    res.status(500).json({
      message: "Failed to analyze resume",
    });
  }
};