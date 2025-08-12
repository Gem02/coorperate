// routes/webhook.js
const  express = require( "express");
const  { handlePaystackWebhook } = require( "../controller/webhookController");

const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), handlePaystackWebhook);

module.exports =  router;
