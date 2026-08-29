import { Job ,Interview,InterviewQuestion} from "../models/index.js";
import { generateAIResponse } from "../services/geminiService.js";

// START INTERVIEW
export const startInterview = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: "jobId is required",
      });
    }

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Create Interview
    const interview = await Interview.create({
      userId: req.user.id,
      jobId,
    });

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

Return ONLY valid JSON:

{
  "questionNumber": 1,
  "question": ""
}
`;

    const responseText = await generateAIResponse(prompt);

    const interviewQuestion = JSON.parse(responseText);

    // Save Question 1
    const savedQuestion = await InterviewQuestion.create({
      interviewId: interview.id,
      questionNumber: interviewQuestion.questionNumber,
      question: interviewQuestion.question,
    });

    res.status(201).json({
      message: "Interview started successfully",
      interviewId: interview.id,
      question: savedQuestion,
    });
  } catch (error) {
    console.error("Start interview error:", error);

    res.status(500).json({
      message: "Failed to start interview",
    });
  }
};


// SUBMIT ANSWER
export const submitInterviewAnswer = async (req, res) => {
  try {
    const {
      interviewId,
      questionId,
      answer,
    } = req.body;

    if (!interviewId || !questionId || !answer) {
      return res.status(400).json({
        message: "interviewId, questionId and answer are required",
      });
    }

    // Find interview
    const interview = await Interview.findOne({
      where: {
        id: interviewId,
        userId: req.user.id,
      },
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    // Find question
    const interviewQuestion = await InterviewQuestion.findOne({
      where: {
        id: questionId,
        interviewId: interview.id,
      },
    });

    if (!interviewQuestion) {
      return res.status(404).json({
        message: "Interview question not found",
      });
    }

    // Get job
    const job = await Job.findByPk(interview.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const prompt = `
You are an AI interviewer evaluating a candidate's answer.

JOB:
Title: ${job.title}
Required Skills: ${job.requiredSkills}
Experience: ${job.experience}

QUESTION:
${interviewQuestion.question}

CANDIDATE ANSWER:
${answer}

Evaluate the candidate's answer.

Return ONLY valid JSON:

{
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

    // Update question with candidate's answer
    await interviewQuestion.update({
      answer,
      score: evaluation.score,
      feedback: JSON.stringify({
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
      }),
    });

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


// GENERATE NEXT QUESTION
export const getNextInterviewQuestion = async (req, res) => {
  try {
    const {
      interviewId,
      questionNumber,
    } = req.body;

    if (!interviewId || !questionNumber) {
      return res.status(400).json({
        message: "interviewId and questionNumber are required",
      });
    }

    const interview = await Interview.findOne({
      where: {
        id: interviewId,
        userId: req.user.id,
      },
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    // If 5 questions are completed
    if (questionNumber >= 5) {
      return res.json({
        message: "Interview completed",
      });
    }

    const job = await Job.findByPk(interview.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const nextQuestionNumber = questionNumber + 1;

    const previousQuestion = await InterviewQuestion.findOne({
      where: {
        interviewId: interview.id,
        questionNumber,
      },
    });

    const prompt = `
You are conducting a 5-question technical interview.

JOB:
Title: ${job.title}
Required Skills: ${job.requiredSkills}
Experience: ${job.experience}
Description: ${job.description}

PREVIOUS QUESTION:
${previousQuestion.question}

Generate question ${nextQuestionNumber} of 5.

Requirements:
- Ask ONE question only.
- Make it relevant to the job.
- Do not repeat the previous question.
- Test a different skill or concept.
- Keep the difficulty appropriate for the candidate.

Return ONLY valid JSON:

{
  "questionNumber": ${nextQuestionNumber},
  "question": ""
}
`;

    const responseText = await generateAIResponse(prompt);

    const nextQuestion = JSON.parse(responseText);

    // Save next question
    const savedQuestion = await InterviewQuestion.create({
      interviewId: interview.id,
      questionNumber: nextQuestion.questionNumber,
      question: nextQuestion.question,
    });

    res.json({
      message: "Next interview question generated",
      question: savedQuestion,
    });
  } catch (error) {
    console.error("Next interview question error:", error);

    res.status(500).json({
      message: "Failed to generate next interview question",
    });
  }
};


// FINAL INTERVIEW RESULT
export const getInterviewResult = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        message: "interviewId is required",
      });
    }

    const interview = await Interview.findOne({
      where: {
        id: interviewId,
        userId: req.user.id,
      },
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    const questions = await InterviewQuestion.findAll({
      where: {
        interviewId: interview.id,
      },
      order: [["questionNumber", "ASC"]],
    });

    if (questions.length < 5) {
      return res.status(400).json({
        message: "Interview is not completed yet",
      });
    }

    const job = await Job.findByPk(interview.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const interviewData = questions.map((q) => ({
      questionNumber: q.questionNumber,
      question: q.question,
      answer: q.answer,
      score: q.score,
      feedback: q.feedback,
    }));

    const prompt = `
You are an AI interview evaluator.

Evaluate the candidate's complete 5-question interview.

JOB:
Title: ${job.title}
Required Skills: ${job.requiredSkills}
Experience: ${job.experience}

INTERVIEW:
${JSON.stringify(interviewData, null, 2)}

Return ONLY valid JSON:

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
- recommendation must be one of:
  "Strong Candidate",
  "Potential Candidate",
  "Needs Improvement"
`;

    const responseText = await generateAIResponse(prompt);

    const result = JSON.parse(responseText);

    // Save final result in Interview
    await interview.update({
      score: result.overallScore,
      feedback: JSON.stringify({
        technicalKnowledge: result.technicalKnowledge,
        communication: result.communication,
        problemSolving: result.problemSolving,
        strengths: result.strengths,
        improvements: result.improvements,
        finalFeedback: result.finalFeedback,
        recommendation: result.recommendation,
      }),
    });

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

export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: Job,
          attributes: ["id", "title", "company"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      interviews,
    });
  } catch (error) {
    console.error("Get interviews error:", error);

    res.status(500).json({
      message: "Failed to fetch interviews",
    });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findOne({
      where: {
        id,
        userId: req.user.id,
      },
      include: [
        {
          model: Job,
          attributes: ["id", "title", "company"],
        },
        {
          model: InterviewQuestion,
          order: [["questionNumber", "ASC"]],
        },
      ],
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.json({
      interview,
    });
  } catch (error) {
    console.error("Get interview error:", error);

    res.status(500).json({
      message: "Failed to fetch interview",
    });
  }
};