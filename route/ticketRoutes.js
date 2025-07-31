const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
} = require('../controller/ticketController');

router.post('/tickets', createTicket);
router.get('/tickets', getAllTickets);
router.get('/tickets/:ticketId', getTicketById);
router.patch('/tickets/:ticketId/status', updateTicketStatus);

module.exports = router;
