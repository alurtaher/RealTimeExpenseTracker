const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes')
var cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(cors())

// Routes
app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);

// Sync DB and start server
sequelize.sync({ alter: true}).then(() => {
  console.log('Database synced');
  app.listen(3000, () => console.log('Server running on port 3000'));
});