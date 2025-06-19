const sequelize = require('../config/database');
const User = require('./User')(sequelize);
const Course = require('./Course')(sequelize);

// Définir les associations
Course.associate({ User });

module.exports = {
  sequelize,
  User,
  Course
}; 