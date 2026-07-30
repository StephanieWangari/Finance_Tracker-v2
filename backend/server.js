require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const transactionRoutes = require("./routes/transactionRoutes");

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", transactionRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));