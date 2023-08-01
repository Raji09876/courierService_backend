const { Op } = require("sequelize");
const db = require("../models");
const Courier = db.courier;
const Customer = db.customer;
const Location = db.location;
const User = db.user;
const nodemailer = require('nodemailer');
const Sequelize = db.Sequelize;

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
      sendEmailToCustomer(data,"Thank you for placing your order.")
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
  Courier.findAll({ include: [  { model: Customer, as: 'pickup_from' },{ model: Customer, as: 'delivery_to_customerDetails' },{ model: User, as: 'courier_boy_details' },{ model: User, as: 'clerk_details'}] })
    .then(async (data) => {
      const dataWithPaths = await Promise.all(
        data.map(async (temp) => {
          const order = temp.dataValues;
          const dist = await findShortestPath({pickup_street:order.pickupLocation.charAt(0),pickup_avenue:order.pickupLocation.charAt(1),delivery_street:order.deliveryLocation.charAt(0),delivery_avenue:order.deliveryLocation.charAt(1)});
          console.log("dis",dist)
          if (dist) {
            const directions = await find_route(order.pickupLocation,order.deliveryLocation);
            const newData = {
              ...order,
              directions
            };
            return newData;
          } else {
            return order;
          }
        })
      );
      res.send(dataWithPaths);
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

  Courier.findByPk(id,{ include: [  { model: Customer, as: 'pickup_from' },{ model: Customer, as: 'delivery_to_customerDetails' },{ model: User, as: 'courier_boy_details' },{ model: User, as: 'clerk_details'}] })
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
exports.assignCourier = async(req, res) => {
  const {id,courierBoyId} = req.params.id;
  const courier = await Courier.findByPk(id)
  Courier.update({courierBoyId}, {
    where: { id: id },
  })
    .then((response) => {
      if (response == 1) {
        res.send({
          message: "courier was assigned successfully.",
        });
        sendEmailToCourierBoy(courier)
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
exports.update = async(req, res) => {
  const id = req.params.id;
  const courier = await Courier.findByPk(id)
  Courier.update(req.body, {
    where: { id: id },
  })
    .then(async(response) => {
      if(req.body.courierBoyId && req.body.courierBoyId != courier.courierBoyId){
        const courier = await Courier.findByPk(id)
        sendEmailToCourierBoy(courier)
      }
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

exports.courierBoyCouriers = (req,res) => {
  const id = req.params.id;
  const condition = {
    courierBoyId: id,
    status: "DELIVERED"
  };
  Courier.findAll({ where: condition, include: [  { model: Customer, as: 'pickup_from' },{ model: Customer, as: 'delivery_to_customerDetails' },{ model: User, as: 'courier_boy_details' },{ model: User, as: 'clerk_details'}] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
}
exports.courierBoyNotDeliveredCouriers = (req,res) => {
  const id = req.params.id;
  const condition = {
    courierBoyId: id,
    status: {
      [Op.or]: ['PENDING', 'PROGRESS']
    }
  };
  Courier.findAll({ where: condition, include: [  { model: Customer, as: 'pickup_from' },{ model: Customer, as: 'delivery_to_customerDetails' },{ model: User, as: 'courier_boy_details' },{ model: User, as: 'clerk_details'}] })
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
  Courier.findAll({ where: condition, include: [  { model: Customer, as: 'pickup_from' },{ model: Customer, as: 'delivery_to_customerDetails' },{ model: User, as: 'courier_boy_details' },{ model: User, as: 'clerk_details'}] })
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
  Courier.findAll({ where: condition, include: [  { model: Customer, as: 'pickup_from' },{ model: Customer, as: 'delivery_to_customerDetails' },{ model: User, as: 'courier_boy_details' },{ model: User, as: 'clerk_details'}] })
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
  Courier.findAll({ where: condition, include: [  { model: Customer, as: 'pickup_from' },{ model: Customer, as: 'delivery_to_customerDetails' },{ model: User, as: 'courier_boy_details' },{ model: User, as: 'clerk_details'}] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Internal Server Error",
      });
    });
}

exports.taken  = async(req, res) => {
  try{
  const id = req.params.id;
  const courier = await Courier.findByPk(id)
  Courier.update({pickedupTime: Sequelize.literal('CURRENT_TIMESTAMP'),status:"PROGRESS"}, {
    where: { id: id },
  })
    .then((response) => {
      if (response == 1) {
        res.send({
          message: "courier was updated successfully.",
        });
        sendEmailToCustomer(courier,"Your Order is Pickedup!")
      } else {
        res.send({
          message: `Cannot update courier with id=${id}. Maybe courier was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating courier with id=" + id,
      });
    });
  }
  catch(e) {
    res.status(500).send({
      message: e.message || "Error updating courier with id=" + id,
    });
  }
};


function deliveredIn(pickedupTime, timeTakesForDelivery) {
  const currentTime = new Date();
  const pickTime = new Date(pickedupTime);
  const timeDifference = currentTime - pickTime;
  const minutesDifference = Math.floor(timeDifference / 1000 / 60); // Convert milliseconds to minutes

  return minutesDifference <= timeTakesForDelivery;
}

exports.done  = async(req, res) => {
  try {
  const id = req.params.id;
  const courier  = await Courier.findByPk(id)
  const deliveredInTime = deliveredIn(courier.pickedupTime,courier.timeTakesForDelivery)
  Courier.update({ deliveredTime: Sequelize.literal('CURRENT_TIMESTAMP'),status:"DELIVERED",isDeliveredInTime: deliveredInTime ? 1 : 0, CourierBoyPoints: deliveredInTime ? 10 : 0 }, {
    where: { id: id },
  })
    .then((response) => {
      if (response == 1) {
        res.send({
          message: "courier was updated successfully.",
        });
        sendEmailToCustomer(courier,"Your Order is Delivered!")
      } else {
        res.send({
          message: `Cannot update courier with id=${id}. Maybe courier was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating courier with id=" + id,
      });
    });
  }
  catch(e) {
    res.status(500).send({
      message: e.message || "Error updating courier with id=" + id,
    });
  }
};

const sendEmailToCustomer = async(data,text) => {
  const customer = await Customer.findByPk(data.pickupFrom);

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Rajitha.Gadiparthi@eagles.oc.edu',
      pass: 'swshondwxvcqwznz'
    }
  });

  // Define the email options
  const mailOptions = {
    from: 'Rajitha.Gadiparthi@eagles.oc.edu',
    to: customer.email,
    subject: "ACME COURIERS",
    text
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent successfully:', info.response);
    }
  });
}

const sendEmailToCourierBoy = async(data) => {
  console.log("data",data)
  const courierBoy = await User.findByPk(data.courierBoyId);
  console.log("courer",courierBoy)

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Rajitha.Gadiparthi@eagles.oc.edu',
      pass: 'swshondwxvcqwznz'
    }
  });

  // Define the email options
  const mailOptions = {
    from: 'Rajitha.Gadiparthi@eagles.oc.edu',
    to: courierBoy.email,
    subject: "ACME COURIERS",
    text: "You are assigned to a new courier with id "+data.id+", please check the website!"
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent successfully:', info.response);
    }
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

// Function to find the shortest path using Dijkstra's algorithm
async function find_route(source, destination) {
  // Retrieve all data from the Location table
  const allLocationData = await Location.findAll();

  // Form the graph using the retrieved data
  const graph = {};
  allLocationData.forEach((entry) => {
    const { source, destination } = entry;
    if (!graph[source]) {
      graph[source] = {};
    }
    graph[source][destination] = 1;
  });

  // Initialize distance, visited, and previous arrays
  const distances = {};
  const visited = {};
  const previous = {};

  // Initialize distances with Infinity and set source distance to 0
  Object.keys(graph).forEach((vertex) => {
    distances[vertex] = Infinity;
  });
  distances[source] = 0;

  while (true) {
    let closestVertex = null;
    let closestDistance = Infinity;

    // Find the closest unvisited vertex
    Object.keys(graph).forEach((vertex) => {
      if (!visited[vertex] && distances[vertex] < closestDistance) {
        closestVertex = vertex;
        closestDistance = distances[vertex];
      }
    });

    if (closestVertex === null) {
      break; // No reachable vertices left
    }

    // Mark the closest vertex as visited
    visited[closestVertex] = true;

    // Update distances to its neighbors
    Object.keys(graph[closestVertex]).forEach((neighbor) => {
      const distance = closestDistance + graph[closestVertex][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = closestVertex;
      }
    });
  }

  // Reconstruct the shortest path
  const path = [destination];
  let current = destination;
  while (current !== source) {
    current = previous[current];
    path.unshift(current);
  }
  return path;
}
