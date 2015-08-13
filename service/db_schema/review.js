var moment = require('moment');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('review', {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true,
      primaryKey: true
    },

    authorId: {
      type: DataTypes.STRING,
      allowNull: false
    },

    courseName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    teacherName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    semester: {
      type: DataTypes.STRING,
      allowNull: false
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    //NICKNAME, PRIVATE
    privateConfig: {
      type: DataTypes.STRING,
      defaultValue: 'NICKNAME'
    }

  },{
    getterMethods: {
      parseTime: function(){
        //return this.getDataValue('createdAt');
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      title: function(){
        return this.getDataValue('semester') + " " + this.getDataValue('teacherName') + " " + this.getDataValue('courseName');
      }
    },
  });
}
