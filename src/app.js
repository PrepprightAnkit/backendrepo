import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";
import cors from "cors"


const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORGIN,
        credentials: true
    }
));

app.use(express.json({ limit: "16kb" }))
app.use(urlencoded())
app.use(express.urlencoded())
app.use(cookieParser())

//routes import 

import companyRouter from "./routes/company.routes.js"; // Adjust the path as necessary
//routes decalration 

app.use("/api/v1/users", companyRouter)

import professionalRouter from "./routes/professional.routes.js";

app.use("/api/v1/users", professionalRouter)

import studentRouter from "./routes/student.routes.js";

app.use("/api/v1/users", studentRouter)

// import authRoutes from './routes/login.routes.js'; // Adjust path as per your project structure

// app.use('/api/v1/users', authRoutes); // Mount the authRoutes under /api/v1/users

import categoryRoutes from './routes/categories.routes.js'

app.use('/api/v1/users', categoryRoutes)

import courseRoutes from './routes/courses.routes.js'

app.use('/api/v1/users', courseRoutes)

import questionRoutes from "./routes/question.routes.js"

app.use('/api/v1/users', questionRoutes)


import buyRoutes from "./routes/courseRoutes.js"

app.use('/api/v1/users', buyRoutes) 

import quizRoutes from "./routes/quiz.routes.js"

app.use('/api/v1/quiz', quizRoutes) 

import approveRoutes from "./routes/courseApproval.routes.js"

app.use('/api/v1/approve',  approveRoutes);

export { app }



