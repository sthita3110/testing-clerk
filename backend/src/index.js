import express from "express"
import dotenv from "dotenv"
dotenv.config();
import {clerkMiddleware} from "@clerk/express"
import cors from "cors"
import authRoutes from "./routes/auth.routes"

const app = express();
const PORT = process.env.PORT;

app.use(express.json());//to parse the json data
app.use(clerkMiddleware());//this will add auth to req obj => req.auth.userId
app.use(
    cors({
      origin: "http://localhost:3000", // Allow requests from this origin
      credentials: true, // Allow cookies and authorization headers
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow all necessary HTTP methods
      allowedHeaders: "Content-Type,Authorization", // Allow necessary headers
    })
  );
  app.options("*", cors());


  app.use("/api/auth", authRoutes);

  app.listen(PORT, () =>{
    console.log(`Server is running on Port: ${PORT}`);
})
connectDB();
