const sequelize = require('../config/database');
const User = require('./User')(sequelize);
const Course = require('./Course')(sequelize);

// Définir les associations
Object.keys(sequelize.models).forEach(modelName => {
  if (sequelize.models[modelName].associate) {
    sequelize.models[modelName].associate(sequelize.models);
  }
});

module.exports = {
  sequelize,
  User,
  Course
}; 