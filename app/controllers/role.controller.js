const db = require("../models");
const Role = db.role;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (req.body.name === undefined) {
    const error = new Error("name cannot be empty");
    error.statusCode = 400;
    throw error;
  }
  const role = {
    name: req.body.name,
  };
  Role.create(role)
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

  Role.findAll({ where: condition })
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

  Role.findByPk(id)
    .then((data) => {
        if (data) {
            res.json(data);
          } else {
            res.status(404).json({ error: 'role not found' });
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

  Role.update(req.body, {
    where: { id: id },
  })
    .then((response) => {
      if (response == 1) {
        res.send({
          message: "role was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update role with id=${id}`,
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

  Role.destroy({
    where: { id: id },
  })
    .then((response) => {
      if (response == 1) {
        res.send({
          message: "role was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete role with id=${id}`,
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
  Role.destroy({
    where: {},
    truncate: false,
  })
    .then((response) => {
      res.send({ message: `${response} roles were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Internal Server Error",
      });
    });
};