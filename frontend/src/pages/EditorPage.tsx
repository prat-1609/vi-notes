import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getSessionById,
  recordPasteEvent,
  startSession,
  updateSessionText,
} from '../services/sessionApi'
import { Link } from 'react-router-dom'

type PasteLog = {
  timestamp: number
  charCount: number
  wordCount: number
  lineCount: number
  cursorStart?: number
  cursorEnd?: number
}

const SESSION_STORAGE_KEY = 'vi_notes_session_id'

function getPasteSeverity(charCount: number) {
  if (charCount <= 20) return 'Micro Paste'
  if (charCount <= 100) return 'Short Paste'
  if (charCount <= 300) return 'Medium Paste'
  return 'Large Paste'
}

export default function EditorPage() {
  const textSaveTimeoutRef = useRef<number | null>(null)

  const [sessionId, setSessionId] = useState('')
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [pasteLogs, setPasteLogs] = useState<PasteLog[]>([])

  useEffect(() => {
    const initSession = async () => {
      try {
        const existingSessionId = localStorage.getItem(SESSION_STORAGE_KEY)

        if (existingSessionId) {
          const existingSession = await getSessionById(existingSessionId)
          setSessionId(existingSession._id)
          setPasteLogs(existingSession.pasteEvents || [])
          setText(existingSession.currentText || '')
          return
        }

        const data = await startSession()
        const newSessionId = data.session._id

        setSessionId(newSessionId)
        setPasteLogs(data.session.pasteEvents || [])
        localStorage.setItem(SESSION_STORAGE_KEY, newSessionId)
      } catch (error) {
        console.error('Failed to initialize session:', error)
        localStorage.removeItem(SESSION_STORAGE_KEY)
      } finally {
        setLoading(false)
      }
    }

    initSession()
  }, [])

  useEffect(() => {
    if (!sessionId) return

    if (textSaveTimeoutRef.current) {
      window.clearTimeout(textSaveTimeoutRef.current)
    }

    textSaveTimeoutRef.current = window.setTimeout(async () => {
      try {
        await updateSessionText(sessionId, text)
      } catch (error) {
        console.error('Failed to save session text:', error)
      }
    }, 500)

    return () => {
      if (textSaveTimeoutRef.current) {
        window.clearTimeout(textSaveTimeoutRef.current)
      }
    }
  }, [sessionId, text])

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!sessionId) return

    const pastedText = e.clipboardData.getData('text/plain')
    const target = e.currentTarget

    const payload: PasteLog = {
      timestamp: Date.now(),
      charCount: pastedText.length,
      wordCount: pastedText.trim() ? pastedText.trim().split(/\s+/).length : 0,
      lineCount: pastedText ? pastedText.split(/\r\n|\r|\n/).length : 0,
      cursorStart: target.selectionStart,
      cursorEnd: target.selectionEnd,
    }

    try {
      await recordPasteEvent(sessionId, payload)
      setPasteLogs((prev) => [payload, ...prev])
    } catch (error) {
      console.error('Failed to record paste event:', error)
    }
  }

  const handleNewSession = async () => {
    try {
      setLoading(true)
      const data = await startSession()
      const newSessionId = data.session._id

      setSessionId(newSessionId)
      setPasteLogs([])
      setText('')
      localStorage.setItem(SESSION_STORAGE_KEY, newSessionId)
    } catch (error) {
      console.error('Failed to create new session:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPastedChars = useMemo(
    () => pasteLogs.reduce((sum, log) => sum + log.charCount, 0),
    [pasteLogs]
  )

  const totalPastedWords = useMemo(
    () => pasteLogs.reduce((sum, log) => sum + log.wordCount, 0),
    [pasteLogs]
  )

  const latestSeverity = pasteLogs.length
    ? getPasteSeverity(pasteLogs[0].charCount)
    : 'No events'

  return (
    <div className="min-h-screen bg-[#120701] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#120701]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-lg font-bold text-black shadow-lg shadow-orange-900/30">
              V
            </div>
            <h1 className="bg-gradient-to-r from-pink-300 to-amber-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              Vi-Notes
            </h1>
            <Link to="/" className="rounded-xl bg-amber-500/15 px-4 py-2 font-medium text-amber-300">Home</Link>
          </div>

          <button
            onClick={handleNewSession}
            className="rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-black transition hover:bg-amber-400"
          >
            Start New Session
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.8fr_0.9fr]">
          <section className="space-y-8">
            <div className="rounded-[28px] border border-white/8 bg-gradient-to-br from-[#1d0902] via-[#180701] to-[#130601] p-7 shadow-[0_0_60px_rgba(255,140,0,0.08)]">
              <h2 className="text-5xl font-extrabold leading-tight">
                Paste Detection Dashboard
              </h2>
              <p className="mt-3 max-w-3xl text-xl text-white/65">
                This session only tracks pasted text events and the amount of text inserted.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <div className="rounded-[24px] border border-red-500/20 bg-gradient-to-br from-[#3a0606] to-[#1a0a0a] p-6">
                  <p className="text-4xl font-extrabold">{pasteLogs.length}</p>
                  <p className="mt-2 text-lg text-white/70">Paste Events</p>
                </div>

                <div className="rounded-[24px] border border-indigo-500/20 bg-gradient-to-br from-[#120c22] to-[#0d0b18] p-6">
                  <p className="text-4xl font-extrabold">{totalPastedChars}</p>
                  <p className="mt-2 text-lg text-white/70">Pasted Characters</p>
                </div>

                <div className="rounded-[24px] border border-amber-500/20 bg-gradient-to-br from-[#2b1905] to-[#171008] p-6">
                  <p className="text-4xl font-extrabold">{totalPastedWords}</p>
                  <p className="mt-2 text-lg text-white/70">Pasted Words</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/8 bg-[#120f18] p-6">
              <div className="mb-5">
                <h3 className="text-2xl font-bold">Writing Workspace</h3>
                <p className="mt-1 text-white/60">
                  Type normally or paste text. Only paste events are recorded.
                </p>
              </div>

              <div className="mb-4 flex flex-wrap gap-3 text-sm">
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/80">
                  Session ID:{' '}
                  <span className="font-semibold text-white">
                    {loading ? 'Loading...' : sessionId || 'Not created'}
                  </span>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/80">
                  Latest Severity:{' '}
                  <span className="font-semibold text-amber-300">{latestSeverity}</span>
                </div>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onPaste={handlePaste}
                className="h-[360px] w-full rounded-[24px] border border-white/10 bg-[#09070d] p-5 text-[17px] leading-8 text-white outline-none placeholder:text-white/30 focus:border-amber-400/50"
                placeholder="Start writing here... paste events will be tracked."
              />
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-white/8 bg-gradient-to-br from-[#1b0c04] to-[#120701] p-6 shadow-[0_0_50px_rgba(255,166,0,0.08)]">
              <h3 className="text-2xl font-bold">Paste Snapshot</h3>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-white/60">Pasted Characters</span>
                  <span className="font-bold">{totalPastedChars}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-white/60">Pasted Words</span>
                  <span className="font-bold">{totalPastedWords}</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span className="text-white/60">Paste Events</span>
                  <span className="font-bold">{pasteLogs.length}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/8 bg-[#100d15] p-6">
              <h3 className="text-2xl font-bold">Tracked Feature</h3>
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-[#09070d] p-4 text-white/85">
                  Detect when pasted text is inserted into the editor
                </div>
                <div className="rounded-2xl bg-[#09070d] p-4 text-white/85">
                  Store pasted character, word, and line counts
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/report"
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
                >
                  View Report
                </Link>
              </div>
          </aside>
        </div>
      </main>
    </div>
  )
}