require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { secureHeaders,limiter,hpp} = require('./middleware/security');



const authRoutes = require('./route/authRoutes');
const webhookRoutes = require('./route/webhookRoute');
const userRoutes = require('./route/userRoute');
const product = require('./route/productRoutes');
const tickets = require('./route/ticketRoutes');
const paymentRoute = require('./route/paymentRoutes');
const report = require('./route/managerReportRoutes');
const accouts = require('./route/bankWalletRoutes');
const withdraw = require('./route/withdrawalRoutes');
const payment = require('./route/paymentReceiptRoutes');
const chart = require('./route/salesChartRoute');

const app = express();

connectDB();
app.set('trust proxy', 1);

app.use(cors({
  origin: ['https://aydevelopers.com.ng','https://ambassador.aydevelopers.com.ng','https://sgm.aydevelopers.com.ng','https://admin.aydevelopers.com.ng' ],
  methods: 'GET,POST,PUT,DELETE,PATCH',
  credentials: true,
}));

// Webhook route (must come after CORS but before json parser)
app.use("/paystack/webhook", express.raw({ type: "application/json" }), webhookRoutes);

app.use(cookieParser());
app.use(express.json());
app.use(secureHeaders);
app.use(hpp);

app.use(limiter);
console.log('the app loaded here')
//routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', product);
app.use('/api/tickets', tickets);
app.use('/api/payment', paymentRoute);
app.use('/api/reports', report);
app.use('/api/account', accouts);
app.use('/api/withdrawal', withdraw);
app.use('/api/promotion', payment);
app.use('/api/sales-chart', chart);

app.get("/", (req, res) => {
  res.json({
    message: "API IS LIVE...",
    })
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`);
})
