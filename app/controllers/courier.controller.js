const db = require("../models");
const Courier = db.courier;
const Customer = db.customer;
const Location = db.location;
const Op = db.Sequelize.Op;
const User = db.user;

exports.create = (req, res) => {
  if (req.body.dateForPickup === undefined) {
    const error = new Error("dateForPickup cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  }
 else if (req.body.timeForPickup === undefined) {
    const error = new Error("timeForPickup cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.pickupFrom === undefined) {
    const error = new Error("pickupFrom cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.deliveryTo === undefined) {
    const error = new Error("deliveryTo cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.cost === undefined) {
    const error = new Error("cost cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.distance === undefined) {
    const error = new Error("distance cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.timeTakesForDelivery === undefined) {
    const error = new Error("time cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.pickupLocation === undefined) {
    const error = new Error("pickup location cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.deliveryLocation === undefined) {
    const error = new Error("delivery location cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  } 
  req.body.status = req.body.status || "PENDING"
  Courier.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the courier.",
      });
    });
};

exports.findDistance = async(req, res) => {
 if (req.body.pickup_street === undefined) {
    const error = new Error("pickup_street cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  }
  else if (req.body.pickup_avenue === undefined) {
    const error = new Error("pickup_avenue cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  } 
  else if (req.body.delivery_street === undefined) {
    const error = new Error("delivery_street cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  }
  else if (req.body.delivery_avenue === undefined) {
    const error = new Error("delivery_avenue cannot be empty for courier!");
    error.statusCode = 400;
    throw error;
  }
  const distance = await findShortestPath(req.body)
  console.log("shrt", distance)
  if(distance) {
    res.send({
      distance: distance
    });
  }
  else {
    res.status(500).send({
      message: "Error in calculating the distance",
    });
  }
};
exports.findAll = (req, res) => {
  Courier.findAll({ include: [  { model: Customer, as: 'pickup_from' },{ model: Customer, as: 'delivery_to_customerDetails' },{ model: User, as: 'courier_boy_details' }] })
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

  Courier.findByPk(id)
    .then((data) => {
        if (data) {
            res.json(data);
          } else {
            res.status(404).json({ error: 'courier not found' });
          }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
};
exports.assignOrder = (req, res) => {
  const {id,courierBoyId} = req.params.id;

  Courier.update({courierBoyId}, {
    where: { id: id },
  })
    .then((response) => {
      if (response == 1) {
        res.send({
          message: "courier was assigned successfully.",
        });
      } else {
        res.send({
          message: `Cannot assign courier`,
        });
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

  Courier.update(req.body, {
    where: { id: id },
  })
    .then((response) => {
      if (response == 1) {
        res.send({
          message: "courier was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update courier with id=${id}.`,
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

  Courier.destroy({
    where: { id: id },
  })
    .then((response) => {
      if (response == 1) {
        res.send({
          message: "courier was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete courier with id=${id}.`,
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
  Courier.destroy({
    where: {},
    truncate: false,
  })
    .then((response) => {
      res.send({ message: `${response} categories were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Internal Server Error",
      });
    });
};

exports.deliveryBoyCouriers = (req,res) => {
  const id = req.params.id;
  const status = req.query.status;
  const condition = {
    courierBoyId: id,
    status: status
  };
  Courier.findAll({ where: condition, include: [  { model: Customer, as: 'pickup_from' },{ model: Customer, as: 'delivery_to_customerDetails' },{ model: User, as: 'courier_boy_details' }] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
}
exports.deliveryToCustomer = (req,res) => {
  const id = req.params.id;
  const condition = {
    deliveryTo: id,
  };
  Courier.findAll({ where: condition, include: [  { model: Customer, as: 'pickup_from' },{ model: Customer, as: 'delivery_to_customerDetails' },{ model: User, as: 'courier_boy_details' }] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
}
exports.courieredByCustomer = (req,res) => {
  const id = req.params.id;
  const condition = {
    pickupFrom: id,
  };
  Courier.findAll({ where: condition, include: [  { model: Customer, as: 'pickup_from' },{ model: Customer, as: 'delivery_to_customerDetails' },{ model: User, as: 'courier_boy_details' }] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
}
exports.couriersByClerk = (req,res) => {
  const id = req.params.id;
  const condition = {
    clerkId: id,
  };
  Courier.findAll({ where: condition, include: [  { model: Customer, as: 'pickup_from' },{ model: Customer, as: 'delivery_to_customerDetails' },{ model: User, as: 'courier_boy_details' }] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
}
// Dijkstra's algorithm
async function findShortestPath(body) {
  const { pickup_street,pickup_avenue,delivery_street,delivery_avenue} = body
  const pickup = pickup_street+pickup_avenue
  const delivery = delivery_street+delivery_avenue
  const locations = await Location.findAll();
  const graphForLocations = {};
  locations.forEach((entry) => {
    const { source, destination } = entry;
    if (!graphForLocations[source]) {
      graphForLocations[source] = {};
    }
    graphForLocations[source][destination] = 1;
  });
  const distances = {};
  const visited = {};
  Object.keys(graphForLocations).forEach((vertex) => {
    distances[vertex] = Infinity;
  });
  distances[pickup] = 0;
  while (true) {
    let closestVertex = null;
    let closestDistance = Infinity;
    Object.keys(graphForLocations).forEach((vertex) => {
      if (!visited[vertex] && distances[vertex] < closestDistance) {
        closestVertex = vertex;
        closestDistance = distances[vertex];
      }
    });
    if (closestVertex === null) {
      break;
    }
    visited[closestVertex] = true;
    Object.keys(graphForLocations[closestVertex]).forEach((neighbor) => {
      const distance = closestDistance + graphForLocations[closestVertex][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
      }
    });
  }
  return distances[delivery];
}
