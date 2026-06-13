const caseRoutes = require("./routes/caseRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const reportRoutes = require("./routes/reportRoutes");
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes (we'll add these soon)
app.get('/', (req, res) => {
  res.send('Tower Dump Analyzer API running');
});

const PORT = process.env.PORT || 5000;
app.use("/api/cases", caseRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/report", reportRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));