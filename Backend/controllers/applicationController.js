import { Application, Job, Resume,User} from "../models/index.js";
export const applyForJob = async (req, res) => {
  try {
    const { jobId, resumeId } = req.body;

    if (!jobId || !resumeId) {
      return res.status(400).json({
        message: "Job ID and Resume ID are required",
      });
    }

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

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

    const existingApplication = await Application.findOne({
      where: {
        userId: req.user.id,
        jobId,
      },
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      userId: req.user.id,
      jobId,
      resumeId,
      status: "Applied",
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply job error:", error);

    res.status(500).json({
      message: "Failed to submit application",
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      applications,
    });
  } catch (error) {
    console.error("Get applications error:", error);

    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};
export const getApplicationById = async (req,res) =>{
  try {
    const {id}=req.params;
    const application=await Application.findOne({
      where:{
        id,
        userId:req.user.id,
      }
    })
    if(!application){
      return res.status(400).json({
        message:"Application Not Found",
      })
    }
    res.json({
      application,
    })
    
  } catch (error) {
    console.error("Get application error:",error);
    res.status(500).json({
      message: "Failed to fetch application",
    });
    
  }
};

export const withdrawApplication = async(req,res) =>{
  try {
    const {id}=req.params;
    const application = await Application.findOne({
      where:{
        id,
        userId:req.user.id,
      }
    })
    if(!application){
      return res.status(404).json({
        message:"Application Not Found",
      })
    }
    await application.destroy();
      res.json({
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    console.error("Withdraw application error:", error);

    res.status(500).json({
      message: "Failed to withdraw application",
    });
    
  }
}


export const getAllApplications = async (req,res) =>{
  try {
    const application=await Application.findAll({
      include:[
        {
          model:user,
          attributes:["id","name","email"],
        },
        {
          model:Job,
        },
        {
          model:Resume,
          attributes:["id","title"],
        },

      ],
      order:[["createdAt","DESC"]],
    });
    res.json({
      application,
    })
  } catch (error) {
    console.log("Get All Application Error:",error);
    res.status(500).json({
      message:"Failed to fetch applications",
    });
  }
};