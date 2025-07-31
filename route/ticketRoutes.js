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
router.get('/:ticketId', getTicketById);
router.patch('/:ticketId/status', updateTicketStatus);
router.patch('/reply/:ticketId', replyToTicket);

module.exports = router;
