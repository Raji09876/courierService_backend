module.exports = (sequelize, Sequelize) => {
    const Location = sequelize.define("location", {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        source: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        destination: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        }
    });
    return Location;
  };
