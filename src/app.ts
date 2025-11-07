import "reflect-metadata"
import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import session from "express-session";
import passport from "passport";
import { setupJwtStrategy } from "./config/passport/jwt-stratery";
import userRouter from "./features/auth/auth.routes";
import studentRouter from "./features/student/student.routes";
import reportCardRouter from "./features/report-card/report-card.routes";
import paymentRouter from "./features/payment/payment.routes";
import classRateRouter from "./features/class-rate/class-rate.routes";
dotenv.config();
const app = express();

app.use(cors({ origin: '*', credentials: true })); // Allow all origins for development


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(useragent.express());

app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.session());
app.use(passport.initialize());
setupJwtStrategy(passport);

app.use("/api/auth", userRouter);
app.use("/api/student", studentRouter);
app.use("/api/report_card", reportCardRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/class-rate",classRateRouter);
export default app;