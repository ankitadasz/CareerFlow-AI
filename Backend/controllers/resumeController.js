import { Resume } from "../models/index.js";

export const createResume = async (req, res) => {
  try {
    const { title, resumeText } = req.body;

    if (!title || !resumeText) {
      return res.status(400).json({
        message: "Title and resume text are required",
      });
    }

    const resume = await Resume.create({
      userId: req.user.id,
      title,
      resumeText,
    });

    res.status(201).json({
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    console.error("Create resume error:", error);

    res.status(500).json({
      message: "Failed to create resume",
    });
  }
};
export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);

    res.status(500).json({
      message: "Failed to fetch resumes",
    });
  }
};
export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;

    //user can only access their own resume
    const resume = await Resume.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.json({
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    res.status(500).json({
      message: "Failed to fetch resume",
    });
  }
};
export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, resumeText } = req.body;

    const resume = await Resume.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    await resume.update({
      title,
      resumeText,
    });

    res.json({
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error("Update resume error:", error);

    res.status(500).json({
      message: "Failed to update resume",
    });
  }
};
export const deleteResume = async(req,res)=>{
    try {
        const {id}= req.params;
        const resume = await Resume.findOne({
            where:{
                id,
                userId:req.user.id,
            },
        });
        if(!resume){
            return res.status(404).json({
                message: "Resume Not Found",
            });
        }
        await resume.destroy();
        res.json({
            message:"Resume Deleted Successfully",
        });
        
    } catch (error) {
        console.error("Error in deleting the Resume:",error);
        res.status(500).json({
            message:"Failed to delete the resume",
        })
        
    }

};
