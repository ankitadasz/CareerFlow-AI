import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    experience: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    salary: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    requiredSkills: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "closed"),
      defaultValue: "active",
      allowNull: false,
    },
  },
  {
    tableName: "Jobs",
    timestamps: true,
  }
);

export default Job;