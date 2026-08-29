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

export const startInterview = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const prompt = `
You are an AI interviewer.

Create the FIRST interview question for this job.

JOB:
Title: ${job.title}
Company: ${job.company}
Experience: ${job.experience}
Required Skills: ${job.requiredSkills}
Description: ${job.description}

The interview will contain 5 questions.

For the first question:
- Focus on an important technical skill required for this job.
- Ask only ONE question.
- Do not provide the answer.
- Keep it suitable for the candidate's experience level.

Return ONLY valid JSON in this format:

{
  "questionNumber": 1,
  "question": ""
}
`;

    const responseText = await generateAIResponse(prompt);

    const interviewQuestion = JSON.parse(responseText);

    res.json({
      message: "Interview started successfully",
      jobId,
      interviewQuestion,
    });
  } catch (error) {
    console.error("Start interview error:", error);

    res.status(500).json({
      message: "Failed to start interview",
    });
  }
};

export const submitInterviewAnswer = async (req, res) => {
  try {
    const { jobId, questionNumber, question, answer } = req.body;

    if (!jobId || !questionNumber || !question || !answer) {
      return res.status(400).json({
        message: "jobId, questionNumber, question and answer are required",
      });
    }

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const prompt = `
You are an AI interviewer evaluating a candidate's interview answer.

JOB:
Title: ${job.title}
Required Skills: ${job.requiredSkills}
Experience: ${job.experience}

QUESTION ${questionNumber}:
${question}

CANDIDATE ANSWER:
${answer}

Evaluate the candidate's answer.

Return ONLY valid JSON in exactly this format:

{
  "questionNumber": ${questionNumber},
  "score": 0,
  "feedback": "",
  "strengths": [],
  "improvements": []
}

Rules:
- score must be between 0 and 10.
- Evaluate correctness, relevance and understanding.
- strengths should mention what the candidate explained well.
- improvements should mention what could be improved.
- Keep feedback concise.
`;

    const responseText = await generateAIResponse(prompt);

    const evaluation = JSON.parse(responseText);

    res.json({
      message: "Answer evaluated successfully",
      evaluation,
    });
  } catch (error) {
    console.error("Interview answer error:", error);

    res.status(500).json({
      message: "Failed to evaluate interview answer",
    });
  }
};

export const getNextInterviewQuestion = async (req, res) => {
  try {
    const {
      jobId,
      questionNumber,
      previousQuestion,
      previousAnswer,
    } = req.body;

    if (
      !jobId ||
      !questionNumber ||
      !previousQuestion ||
      !previousAnswer
    ) {
      return res.status(400).json({
        message:
          "jobId, questionNumber, previousQuestion and previousAnswer are required",
      });
    }

    if (questionNumber >= 5) {
      return res.json({
        message: "Interview completed",
      });
    }

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const nextQuestionNumber = questionNumber + 1;

    const prompt = `
You are conducting a 5-question technical interview.

JOB:
Title: ${job.title}
Required Skills: ${job.requiredSkills}
Experience: ${job.experience}
Description: ${job.description}

PREVIOUS QUESTION:
${previousQuestion}

CANDIDATE'S PREVIOUS ANSWER:
${previousAnswer}

Generate question ${nextQuestionNumber} of 5.

Requirements:
- Ask ONE question only.
- Make it relevant to the job.
- Do not repeat the previous question.
- Gradually test different skills or concepts.
- Keep the difficulty appropriate for the candidate.

Return ONLY valid JSON:

{
  "questionNumber": ${nextQuestionNumber},
  "question": ""
}
`;

    const responseText = await generateAIResponse(prompt);

    const nextQuestion = JSON.parse(responseText);

    res.json({
      message: "Next interview question generated",
      nextQuestion,
    });
  } catch (error) {
    console.error("Next interview question error:", error);

    res.status(500).json({
      message: "Failed to generate next interview question",
    });
  }
};

export const getInterviewResult = async (req, res) => {
  try {
    const { jobId, interviewData } = req.body;

    if (!jobId || !interviewData || !Array.isArray(interviewData)) {
      return res.status(400).json({
        message: "jobId and interviewData are required",
      });
    }

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const prompt = `
You are an AI interview evaluator.

Evaluate the candidate's complete 5-question interview.

JOB:
Title: ${job.title}
Required Skills: ${job.requiredSkills}
Experience: ${job.experience}

INTERVIEW:
${JSON.stringify(interviewData, null, 2)}

Analyze the candidate's overall performance.

Return ONLY valid JSON in exactly this format:

{
  "overallScore": 0,
  "technicalKnowledge": 0,
  "communication": 0,
  "problemSolving": 0,
  "strengths": [],
  "improvements": [],
  "finalFeedback": "",
  "recommendation": ""
}

Rules:
- All scores must be between 0 and 100.
- overallScore should reflect the complete interview.
- technicalKnowledge evaluates technical correctness.
- communication evaluates clarity and explanation.
- problemSolving evaluates reasoning and approach.
- strengths should contain the candidate's strongest areas.
- improvements should contain specific areas to work on.
- finalFeedback should summarize the interview.
- recommendation should be one of:
  "Strong Candidate",
  "Potential Candidate",
  "Needs Improvement"
`;

    const responseText = await generateAIResponse(prompt);

    const result = JSON.parse(responseText);

    res.json({
      message: "Interview completed successfully",
      result,
    });
  } catch (error) {
    console.error("Interview result error:", error);

    res.status(500).json({
      message: "Failed to generate interview result",
    });
  }
};