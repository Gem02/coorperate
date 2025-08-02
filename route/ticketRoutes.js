const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus, replyToTicket
} = require('../controller/ticketController');

router.post('/', createTicket);
router.get('/', getAllTickets);
router.get('/:id', getTicketById);
router.patch('/:id/status', updateTicketStatus);
router.patch('/reply/:id', replyToTicket);

module.exports = router;
