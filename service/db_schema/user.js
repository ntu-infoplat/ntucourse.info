module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER, 
      autoIncrement: true,
      primaryKey: true
    },

    fbid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    sid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    fbname: {
      type: DataTypes.STRING,
      allowNull: false
    },

    nickname: {
      type: DataTypes.STRING,
      allowNull: false
    },

    is_verify:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    verifyCode:{
      type: DataTypes.STRING,
      allowNull: false
    }
  });
}
