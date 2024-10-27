const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['Owner', 'Admin', 'Member'], default: 'Member' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
