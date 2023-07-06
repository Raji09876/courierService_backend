const db = require("../models");
const Customer = db.customer;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (req.body.firstName === undefined) {
    const error = new Error("firstName cannot be empty!");
    error.statusCode = 400;
    throw error;
  } 
  else if (req.body.lastName === undefined) {
    const error = new Error("lastName cannot be empty!");
    error.statusCode = 400;
    throw error;
  }
  else if (req.body.email === undefined) {
    const error = new Error("email cannot be empty!");
    error.statusCode = 400;
    throw error;
  }
  else if (req.body.phoneNumber === undefined) {
    const error = new Error("phoneNumber cannot be empty!");
    error.statusCode = 400;
    throw error;
  }
  else if (req.body.streetNumber === undefined) {
    const error = new Error("streetNumber cannot be empty!");
    error.statusCode = 400;
    throw error;
  }
  else if (req.body.avenue === undefined) {
    const error = new Error("avenue cannot be empty!");
    error.statusCode = 400;
    throw error;
  }
  Customer.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Internal Server Error",
      });
    });
};
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id
    ? {
        id: {
          [Op.like]: `%${id}%`,
        },
      }
    : null;

  Customer.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Internal Server Error",
      });
    });
};
exports.findOne = (req, res) => {
  const id = req.params.id;

  Customer.findByPk(id)
    .then((data) => {
        if (data) {
            res.json(data);
          } else {
            res.status(404).json({ error: 'customer not found' });
          }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
};
exports.update = (req, res) => {
  const id = req.params.id;

  Customer.update(req.body, {
    where: { id: id },
  })
    .then((response) => {
      if (response == 1) {
        res.send({
          message: "customer was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update customer with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
};
exports.delete = (req, res) => {
  const id = req.params.id;

  Customer.destroy({
    where: { id: id },
  })
    .then((response) => {
      if (response == 1) {
        res.send({
          message: "customer was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete customer with id=${id}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
};
exports.deleteAll = (req, res) => {
  Customer.destroy({
    where: {},
    truncate: false,
  })
    .then((response) => {
      res.send({ message: `${response} customers were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Internal Server Error",
      });
    });
};