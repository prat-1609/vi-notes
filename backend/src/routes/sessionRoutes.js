const express = require('express')
const WritingSession = require('../models/WritingSession')

const router = express.Router()

router.post('/start', async (req, res) => {
  try {
    const session = await WritingSession.create({
      userId: 'demo-user',
    })

    res.status(201).json({
      message: 'Session started',
      session,
    })
  } catch (error) {
    console.error('Start session error:', error)
    res.status(500).json({ message: 'Failed to start session' })
  }
})

router.post('/:sessionId/text', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { text } = req.body

    const session = await WritingSession.findById(sessionId)
    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    session.currentText = text || ''
    await session.save()

    res.json({
      message: 'Text updated',
      currentText: session.currentText,
    })
  } catch (error) {
    console.error('Text update error:', error)
    res.status(500).json({ message: 'Failed to update text' })
  }
})

router.post('/:sessionId/paste-event', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { timestamp, charCount, wordCount, lineCount, cursorStart, cursorEnd } = req.body

    const session = await WritingSession.findById(sessionId)
    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    session.pasteEvents.push({
      timestamp,
      charCount,
      wordCount,
      lineCount,
      cursorStart,
      cursorEnd,
    })

    session.totalPastedChars += charCount

    await session.save()

    res.status(201).json({
      message: 'Paste event recorded',
      totalPastedChars: session.totalPastedChars,
      pasteEvents: session.pasteEvents,
    })
  } catch (error) {
    console.error('Paste event error:', error)
    res.status(500).json({ message: 'Failed to record paste event' })
  }
})

router.get('/:sessionId', async (req, res) => {
  try {
    const session = await WritingSession.findById(req.params.sessionId)

    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    res.json(session)
  } catch (error) {
    console.error('Get session error:', error)
    res.status(500).json({ message: 'Failed to fetch session' })
  }
})

module.exports = router