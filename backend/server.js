import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {connectDB} from "./lib/initDB.js";

import authRouter from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";

// Configs
dotenv.config();

// App
const app = express();

// Constants
const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI;
const WEBSITE_URL = process.env.WEBSITE_URL;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: WEBSITE_URL,
        credentials: true,
    }),
);

// Redirect To frontend
app.get("/", (req, res) => {
    res.redirect(WEBSITE_URL);
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/tests", testRoutes);

app.listen(PORT, async () => {
    await connectDB(DATABASE_URI);

    console.log(`Server is listening: http://localhost:${PORT}`);
});
