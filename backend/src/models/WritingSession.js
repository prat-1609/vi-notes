const mongoose = require('mongoose')

const PasteEventSchema = new mongoose.Schema(
  {
    timestamp: { type: Number, required: true },
    charCount: { type: Number, required: true },
    wordCount: { type: Number, required: true },
    lineCount: { type: Number, required: true },
    cursorStart: { type: Number },
    cursorEnd: { type: Number },
  },
  { _id: false }
)

const WritingSessionSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'demo-user' },
    startedAt: { type: Date, default: Date.now },
    currentText: { type: String, default: '' },
    pasteEvents: { type: [PasteEventSchema], default: [] },
    totalPastedChars: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('WritingSession', WritingSessionSchema)