const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    originalFile: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
      type: DataTypes.ENUM('pdf', 'docx', 'pptx'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    analysis: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    suggestions: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    summary: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    quiz: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    slides: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    studentNotes: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    practicalWork: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    exportPath: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'teacher'
    });
  };

  return Course;
}; 