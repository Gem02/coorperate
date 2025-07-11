require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { secureHeaders,limiter,hpp} = require('./middleware/security');



const authRoutes = require('./route/authRoutes');
const userRoutes = require('./route/userRoute');

const app = express();

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(secureHeaders);
app.use(hpp);
app.use(cors({
  origin: ['http://localhost:5173','https://ambassador-admin.vercel.app','https://ay-developers.netlify.app'],
  methods: 'GET,POST,PUT,DELETE,PATCH',
  credentials: true,
}));

app.use(limiter);
console.log('the app loaded here')
//routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "API IS LIVE...",
    })
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`);
})
