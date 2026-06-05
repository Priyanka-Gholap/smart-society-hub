const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const societyRoutes = require("./routes/societyRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/societies", societyRoutes);


app.get("/", (req, res) => {
  res.send("Smart Society Hub API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});