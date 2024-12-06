const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const Routes = require("./routes/route.js");

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

connectDB();

// Root Route
app.get('/', (req, res) => {
    res.send("Welcome! The server is live.");
});

app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`🚀 Server is live on port ${PORT}`);
});

process.on("unhandledRejection", (error) => {
    console.error("Unhandled rejection:", error.message);
    process.exit(1);
});