import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Application = sequelize.define(
  "Application",
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

    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    resumeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "Applied",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected"
      ),
      defaultValue: "Applied",
      allowNull: false,
    },
  },
  {
    tableName: "Applications",
    timestamps: true,
  }
);

export default Application;