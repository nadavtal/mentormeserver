module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
      id: {
        type: DataTypes.NUMBER
      },
      fname : {
        type: DataTypes.STRING
      },
      lname : {
        type: DataTypes.STRING
      },
      email : {
        type: DataTypes.STRING
      },
      password : {
        type: DataTypes.STRING
      },
      image : {
        type: DataTypes.STRING
      },
      token : {
        type: DataTypes.STRING
      },
      
      balance : {
        type: DataTypes.NUMBER
      },
      status : {
        type: DataTypes.STRING
      },
      type : {
        type: DataTypes.STRING
      },
      

    });
  
    return User;
  };