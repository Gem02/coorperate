const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
} = require('../controller/ticketController');

router.post('/', createTicket);
router.get('/', getAllTickets);
router.get('/:ticketId', getTicketById);
router.patch('/:ticketId/status', updateTicketStatus);

module.exports = router;
