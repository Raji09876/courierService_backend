module.exports = (app) => {
    const Role = require("../controllers/role.controller.js");
    var router = require("express").Router();
  
    router.post("/roles/", Role.create);
    router.get("/roles/", Role.findAll);
    router.get("/roles/:id", Role.findOne);
    router.put("/roles/:id",  Role.update);
    router.delete("/roles/:id", Role.delete);
    router.delete("/roles/", Role.deleteAll);
    app.use(router);
  };
  