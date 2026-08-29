import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const InterviewQuestion = sequelize.define(
  "InterviewQuestion",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    interviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    questionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "InterviewQuestions",
    timestamps: true,
  }
);

export default InterviewQuestion;