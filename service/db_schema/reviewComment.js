module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reviewComment', {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true,
      primaryKey: true
    },

    reviewId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    authorId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }

  });
}
