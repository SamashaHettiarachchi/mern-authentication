import express from "express";
import cors from "cors"
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js'
import authRoutes from './Routes/AuthRoutes.js'


const app = express();
const port = process.env.PORT || 5000;
// connect to database
connectDB().catch(err => console.error('DB connection error:', err));
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials :true}))

//APi Endpoits

app.get('/',(req,res)=>res.send("API Working  finee"));
app.use('/api/auth', authRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});