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
You are an AI-powered career and resume analysis system.

Analyze how well the candidate's resume matches the job requirements.

JOB DETAILS:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Required Experience: ${job.experience}
Required Skills: ${job.requiredSkills}
Job Description: ${job.description}

CANDIDATE RESUME:
Title: ${resume.title}
Resume Content: ${resume.resumeText}

Return ONLY valid JSON. Do not use markdown or explanations outside JSON.

Use EXACTLY this structure:

{
  "overallScore": 0,
  "scores": {
    "skills": 0,
    "experience": 0,
    "education": 0,
    "projectRelevance": 0
  },
  "matchingSkills": [],
  "missingSkills": [],
  "experienceGap": {
    "required": "",
    "candidate": "",
    "score": 0
  },
  "strengths": [],
  "gaps": [],
  "suggestions": []
}

SCORING RULES:

- All scores must be numbers from 0 to 100.
- Skills score: Compare required skills with skills demonstrated in the resume.
- Experience score: Compare required experience with the candidate's actual professional or relevant practical experience.
- Education score: Compare education information in the resume with the job requirements. If the job has no education requirement, estimate based on relevance to the role.
- Project relevance score: Evaluate how relevant the candidate's projects and practical work are to the job.
- overallScore must reflect all four categories and should not simply be an average.

ANALYSIS RULES:

- matchingSkills: Skills clearly present in both the job requirements and resume.
- missingSkills: Required skills mentioned in the job but not demonstrated in the resume.
- Do not put experience gaps inside missingSkills.
- experienceGap must specifically describe the difference between required experience and candidate experience.
- strengths: Strong aspects of the candidate relevant to this job.
- gaps: Important weaknesses or mismatches.
- suggestions: Specific, practical improvements.

Be realistic and do not give high scores without evidence from the resume.
`;

    const analysisText = await generateAIResponse(prompt);

const analysis = JSON.parse(analysisText);


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
