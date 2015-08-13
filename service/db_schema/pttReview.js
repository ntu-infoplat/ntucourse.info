var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pttReview', {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true,
      primaryKey: true
    },

    pttId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    author: {
      type: DataTypes.STRING,
      allowNull: false
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    time: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },{
    getterMethods: {
      parseTime: function(){
        return moment(this.getDataValue('time')).format('YYYY-MM-DD');
      },
    },
  });
}
