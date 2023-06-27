const db_host = process.env.DB_HOST || "localhost";
const db_pw = process.env.DB_PW || "rajitha123";
const db_user = process.env.DB_USER || "rajitha";
const db_name = process.env.DB_NAME || "courier_service";

module.exports = {
  HOST: db_host,
  USER: db_user,
  PASSWORD: db_pw,
  DB: db_name,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
