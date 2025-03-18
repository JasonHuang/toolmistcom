const mongoose = require('mongoose');

const lotterySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  drawDate: {
    type: Date,
    required: true
  },
  prize: {
    type: String,
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1
  },
  participants: [{
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    registrationDate: {
      type: Date,
      default: Date.now
    }
  }],
  isOpen: {
    type: Boolean,
    default: true
  },
  result: {
    type: String,
    default: null
  },
  winner: {
    type: String,
    default: null
  },
  excludedNumbers: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

const Lottery = mongoose.model('Lottery', lotterySchema);

module.exports = Lottery; 