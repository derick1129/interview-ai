import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.route';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use("/api/auth", authRouter);

export default app;