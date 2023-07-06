module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define("customer", {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        streetNumber: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        avenue: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false, 
    }
    );
    return Customer;
  };