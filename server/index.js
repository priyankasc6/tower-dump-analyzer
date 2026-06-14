const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cases', require('./routes/cases'));
app.use('/api/evidence', require('./routes/evidence'));
app.use('/api/correlate', require('./routes/correlate'));
app.use('/api/audit', require('./routes/audit'));

app.get('/', (req, res) => res.send('CipherTrace API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));