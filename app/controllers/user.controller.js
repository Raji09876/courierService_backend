const db = require("../models");
const User = db.user;
const Session = db.session;
const Op = db.Sequelize.Op;
const { encrypt, getSalt, hashPassword } = require("../authentication/crypto");

exports.create = async (req, res) => {
  try {
    if (req.body.firstName === undefined) {
      const error = new Error("First name cannot be empty");
      error.statusCode = 400;
      throw error;
    } else if (req.body.lastName === undefined) {
      const error = new Error("Last name cannot be empty");
      error.statusCode = 400;
      throw error;
    } else if (req.body.email === undefined) {
      const error = new Error("Email cannot be empty");
      error.statusCode = 400;
      throw error;
    } else if (req.body.password === undefined) {
      const error = new Error("Password cannot be empty");
      error.statusCode = 400;
      throw error;
    }
    else if (req.body.phoneNumber === undefined) {
      const error = new Error("phoneNumber cannot be empty");
      error.statusCode = 400;
      throw error;
    }

    await User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then(async (data) => {
        if (data) {
          res.status(500).send({
            message: "This email is already in use.",
          });
        } else {
          console.log("email not found");
          let salt = await getSalt();
          let hash = await hashPassword(req.body.password, salt);
          const user = {
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            roleId: req.body.role_id || 3,
            isAvailable: req.body.isAvailable || 0,
            phoneNumber: req.body.phoneNumber,
            salt: salt,
          };
          await User.create(user)
            .then(async (data) => {
              let userId = data.id;

              let expireTime = new Date();
              expireTime.setDate(expireTime.getDate() + 1);

              const session = {
                email: req.body.email,
                userId: userId,
                expirationDate: expireTime,
              };
              await Session.create(session).then(async (data) => {
                let sessionId = data.id;
                let token = await encrypt(sessionId);
                let userInfo = {
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  id: user.id,
                  token: token,
                  isAvailable: user.isAvailable,
                  role_id: user.roleId,
                  phoneNumber: user.phoneNumber
                };
                res.send(userInfo);
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the User.",
              });
            });
        }
      })
      .catch((err) => {
        return err.message || "Error retrieving User with email=" + email;
      });
    }
    catch(err) {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    }
};
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { id: { [Op.like]: `%${id}%` } } : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
};
exports.findAvailableCourierBoys = (req,res) => {
  const condition = {
    roleId: 3,
    isAvailable: 1
  };
  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
}
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id = ${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
};
exports.findByEmail = (req, res) => {
  const email = req.params.email;

  User.findOne({
    where: {
      email: email,
    },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send({ email: "not found" });
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

  User.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id = ${id}.`,
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

  User.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id = ${id}.`,
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
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} People were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Internal Server Error",
      });
    });
};
