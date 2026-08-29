import User from "./User.js";
import Job from "./Job.js";
import Resume from "./Resume.js";
import Application from "./Application.js";
import Interview from "./Interview.js";

// User → Resume
User.hasMany(Resume, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Resume.belongsTo(User, {
  foreignKey: "userId",
});

// User → Application
User.hasMany(Application, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Application.belongsTo(User, {
  foreignKey: "userId",
});

// Job → Application
Job.hasMany(Application, {
  foreignKey: "jobId",
  onDelete: "CASCADE",
});

Application.belongsTo(Job, {
  foreignKey: "jobId",
});

// Resume → Application
Resume.hasMany(Application, {
  foreignKey: "resumeId",
  onDelete: "CASCADE",
});

Application.belongsTo(Resume, {
  foreignKey: "resumeId",
});

// User → Interview
User.hasMany(Interview, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Interview.belongsTo(User, {
  foreignKey: "userId",
});

// Job → Interview
Job.hasMany(Interview, {
  foreignKey: "jobId",
});

Interview.belongsTo(Job, {
  foreignKey: "jobId",
});

export {
  User,
  Job,
  Resume,
  Application,
  Interview,
};