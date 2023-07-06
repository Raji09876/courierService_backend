const dbConfig = require("../config/database.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.session = require("./session.js")(sequelize, Sequelize);
db.user = require("./user.js")(sequelize, Sequelize);
db.customer = require("./customer.js")(sequelize, Sequelize);
db.courier = require("./courier.js")(sequelize, Sequelize);
db.role = require("./role.js")(sequelize, Sequelize);
db.location = require("./location.js")(sequelize, Sequelize);

// foreign key for session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);
db.session.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);

// foreign key for user
db.role.hasMany(
  db.user,
  { as: "role" },
  { foreignKey: { 
    allowNull: true,
    onDelete: "CASCADE" 
   } }
);

//foreign key for couriers
db.user.hasMany(db.courier, {
  foreignKey: "clerkId",
  as: "courier1",
  onDelete: "CASCADE",
});

db.user.hasMany(db.courier, {
  foreignKey: "courierBoyId",
  as: "courier2",
  onDelete: "CASCADE",
});

db.customer.hasMany(db.courier, {
  foreignKey: "pickupFrom",
  as: "courier3",
  onDelete: "CASCADE",
});

db.customer.hasMany(db.courier, {
  foreignKey: "deliveryTo",
  as: "courier4",
  onDelete: "CASCADE",
});

db.courier.belongsTo(db.customer, {
  foreignKey: "pickupFrom",
  as: "pickup_from",
});

db.courier.belongsTo(db.customer, {
  foreignKey: "deliveryTo",
  as: "delivery_to_customerDetails",
});

db.courier.belongsTo(db.user, {
  foreignKey: "courierBoyId",
  as: "courier_boy_details",
});
db.courier.belongsTo(db.user, {
  foreignKey: "clerkId",
  as: "clerk_details",
});

module.exports = db;
