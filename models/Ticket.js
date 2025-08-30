const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // reference to User
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  reply: { type: String, default: '' }, // New field for admin reply
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }, // New field for tracking updates
});

module.exports = mongoose.model('Ticket', TicketSchema);
