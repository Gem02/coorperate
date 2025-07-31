const Ticket = require('../models/Ticket');

// Generate random custom ticket ID like TKT-284193
const generateCustomId = async () => {
  let customId;
  let exists = true;

  while (exists) {
    const randomNum = Math.floor(100000 + Math.random() * 900000); 
    customId = `TKT-${randomNum}`;
    exists = await Ticket.findOne({ customId });
  }

  return customId;
};

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { name, role, email, description, priority, subject } = req.body;

    if (!name || !role || !email || !description || !priority || !subject) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const customId = await generateCustomId();

    const ticket = await Ticket.create({
      name,
      role,
      email,
      description,
      priority,
      subject,
      ticketId: customId
    });

    return res.status(201).json({
      message: 'Ticket submitted successfully.',
      ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    return res.status(500).json({ message: 'Failed to submit ticket.' });
  }
};


// Get all tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch tickets.' });
  }
};

// Get a single ticket
const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving ticket.' });
  }
};

// Update ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    return res.status(200).json({ message: 'Status updated.', ticket });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update status.' });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus
};
