module.exports = (sequelize, Sequelize) => {
    const Courier = sequelize.define("courier", {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        dateForPickup: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        timeForPickup: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        cost: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        timeTakesForDelivery: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        distance: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        deliveredTime: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        isDeliveredInTime: {
            type: Sequelize.BOOLEAN,
            allowNull: true, 
        },
        pickedupTime: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        pickupLocation: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        deliveryLocation: {
            type: Sequelize.STRING,
            allowNull: false,
        }, 
        CourierBoyPoints: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 0
        } 
    },
    {
     timestamps: true, 
    }
    );
  
    return Courier;
  };