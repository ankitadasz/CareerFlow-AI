import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Interview = sequelize.define(
  "Interview",
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
    tableName: "Interviews",
    timestamps: true,
  }
);

export default Interview;