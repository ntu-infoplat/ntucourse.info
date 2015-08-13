var moment = require('moment');

//還沒用到
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('course', {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },{
    getterMethods: {
      updatedAt: function(){
        return moment(this.getDataValue('updatedAt')).format();
      }
    },
  });
}
