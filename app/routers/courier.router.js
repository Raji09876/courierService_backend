module.exports = (app) => {
  const Courier = require("../controllers/courier.controller.js");
  var router = require("express").Router();

  router.post("/couriers/", Courier.create);
  router.post("/couriers/find-distance", Courier.findDistance);
  router.post("/couriers/assign", Courier.assignCourier);
  router.get("/couriers/delivery-boy-delivered/:id", Courier.courierBoyCouriers);
  router.get("/couriers/delivery-boy-not-delivered/:id", Courier.courierBoyNotDeliveredCouriers);
  router.get("/couriers/delivered-to-customer/:id", Courier.deliveryToCustomer);
  router.get("/couriers/couriered-by-customer/:id", Courier.courieredByCustomer);
  router.get("/couriers/clerk/:id", Courier.couriersByClerk); 
  router.post("/couriers/taken/:id", Courier.taken);
  router.post("/couriers/done/:id", Courier.done);   
  router.get("/couriers/", Courier.findAll);
  router.get("/couriers/:id", Courier.findOne);
  router.put("/couriers/:id",  Courier.update);
  router.delete("/couriers/:id", Courier.delete);
  router.delete("/couriers/", Courier.deleteAll);
  app.use(router);
};
