module.exports = (app) => {
    const Customer = require("../controllers/customer.controller.js");
    var router = require("express").Router();
    
    router.post("/customers/", Customer.create);
    router.get("/customers/", Customer.findAll);
    router.get("/customers/:id", Customer.findOne);
    router.put("/customers/:id",  Customer.update);
    router.delete("/customers/:id", Customer.delete);
    router.delete("/customers/", Customer.deleteAll);
    app.use(router);
  };
  