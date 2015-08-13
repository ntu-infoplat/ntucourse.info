module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reviewComment', {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true,
      primaryKey: true
    },

    courseId: {
      type: DataTypes.INTEGER
    },

    authorId: {
      type: DataTypes.INTEGER
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }

  });
}
