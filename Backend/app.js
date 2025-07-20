const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
var cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(cors())

// Routes
app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/payment',paymentRoutes);

// Sync DB and start server
sequelize.sync({ force: false}).then(() => {
  console.log('Database synced');
  app.listen(3000, () => console.log('Server running on port 3000'));
});