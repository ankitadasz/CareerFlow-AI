import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Resume = sequelize.define(
  "Resume",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    resumeText: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "Resumes",
    timestamps: true,
  }
);

export default Resume;