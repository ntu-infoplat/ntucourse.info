//還沒建
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schedule', {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true,
      primaryKey: true
    },

  });
}
