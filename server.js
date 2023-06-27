const express = require('express');
const app = express();
const sequelize = require('./app/config/database');
const User = require('./app/models/User');
const Role = require('./app/models/Role');
const userRoutes = require('./app/routers/userRouter');
const locationRoutes = require('./app/routers/locationRouter');
const orderRoutes = require('./app/routers/orderRouter');
const deliveryBoyRoutes = require('./app/routers/deliveryBoyRouter');
const orderHistoryLogRoutes = require('./app/routers/orderHistoryRouter');

// Connect to the database
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/locations', locationRoutes);
app.use('/orders', orderRoutes);
app.use('/delivery-boys', deliveryBoyRoutes);
app.use('/order-history-logs', orderHistoryLogRoutes);

// Seed dummy data
const seedData = async () => {
  try {
    await sequelize.sync({ force: true });

    // Seed roles
    await Role.bulkCreate([
      { name: 'admin' },
      { name: 'clerk' },
      { name: 'delivery boy' },
    ]);

    // Seed users
    await User.bulkCreate([
      {
        username: 'admin',
        password: 'admin123',
        role_id: 1,
        name: 'John Doe',
        email: 'admin@example.com',
        phone: '1234567890',
      },
      {
        username: 'clerk',
        password: 'clerk123',
        role_id: 2,
        name: 'Jane Smith',
        email: 'clerk@example.com',
        phone: '9876543210',
      },
      {
        username: 'deliveryboy',
        password: 'delivery123',
        role_id: 3,
        name: 'Michael Johnson',
        email: 'delivery@example.com',
        phone: '5555555555',
      },
    ]);

    console.log('Dummy data seeded successfully.');
  } catch (error) {
    console.error('Failed to seed dummy data:', error);
  }
};

// Start the server
const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  // Seed dummy data
  seedData();
});