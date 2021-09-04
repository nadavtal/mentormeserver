module.exports = (sequelize, DataTypes) => {
    const User = require("./user.model.js");

    const Event = sequelize.define("event", {

      title : {
        type: DataTypes.STRING
      },
      description : {
        type: DataTypes.STRING
      },
      image : {
        type: DataTypes.STRING
      },
      start : {
        type: DataTypes.DATE
      },
      // hostId: {
      //   type: DataTypes.INTEGER,
      //   references: 'users', // <<< Note, its table's name, not object name
      //   referencesKey: 'id' // <<< Note, its a column name
      // }
    }
    );

    const User = sequelize.define("user", {

      fullName : {
        type: DataTypes.STRING
      },
      description : {
        type: DataTypes.STRING
      },
      image : {
        type: DataTypes.STRING
      },

    });
    // Event.hasOne(User);
    Event.belongsTo(User, {as: 'host'})
  
    return Event;
  };