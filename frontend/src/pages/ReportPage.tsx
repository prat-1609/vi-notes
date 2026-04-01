import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSessionById } from '../services/sessionApi'

type PasteLog = {
  timestamp: number
  charCount: number
  wordCount: number
  lineCount: number
  cursorStart?: number
  cursorEnd?: number
}

type SessionData = {
  _id: string
  pasteEvents: PasteLog[]
  currentText?: string
}

const SESSION_STORAGE_KEY = 'vi_notes_session_id'

function getPasteSeverity(charCount: number) {
  if (charCount <= 20) return 'Micro Paste'
  if (charCount <= 100) return 'Short Paste'
  if (charCount <= 300) return 'Medium Paste'
  return 'Large Paste'
}

export default function ReportPage() {
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionId = localStorage.getItem(SESSION_STORAGE_KEY)
        if (!sessionId) {
          setLoading(false)
          return
        }

        const data = await getSessionById(sessionId)
        setSession(data)
      } catch (error) {
        console.error('Failed to load session report:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [])

  const pasteLogs = session?.pasteEvents ?? []
  const totalPastedChars = pasteLogs.reduce((sum, log) => sum + log.charCount, 0)
  const totalPastedWords = pasteLogs.reduce((sum, log) => sum + log.wordCount, 0)
  const totalPastedLines = pasteLogs.reduce((sum, log) => sum + log.lineCount, 0)

  return (
    <div className="min-h-screen bg-[#120701] text-white">
      <header className="border-b border-white/10 bg-[#120701]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-lg font-bold text-black shadow-lg shadow-orange-900/30">
              V
            </div>
            <h1 className="bg-gradient-to-r from-pink-300 to-amber-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              Vi-Notes
            </h1>
            <Link to="/" className="rounded-xl bg-amber-500/15 px-4 py-2 font-medium text-amber-300">Home</Link>
            <Link to="/editor" className="rounded-xl bg-amber-500/15 px-4 py-2 font-medium text-amber-300">Editor</Link>
          </div>

          <Link
            to="/editor"
            className="rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-black transition hover:bg-amber-400"
          >
            Open Editor
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-8">
        {loading ? (
          <div className="rounded-[28px] border border-white/8 bg-[#120f18] p-8 text-white/70">
            Loading session report...
          </div>
        ) : !session ? (
          <div className="rounded-[28px] border border-white/8 bg-[#120f18] p-8">
            <h2 className="text-3xl font-bold">No active session found</h2>
            <p className="mt-3 text-white/65">
              Start a session in the editor first, then come back to view the report.
            </p>
            <Link
              to="/editor"
              className="mt-6 inline-block rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-black transition hover:bg-amber-400"
            >
              Go to Editor
            </Link>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.6fr_0.9fr]">
            <div className="space-y-8">
              <div className="rounded-[30px] border border-white/8 bg-gradient-to-br from-[#1d0902] via-[#180701] to-[#130601] p-8 shadow-[0_0_60px_rgba(255,140,0,0.08)]">
                <h2 className="text-5xl font-extrabold leading-tight">
                  Paste detection report
                </h2>

                <p className="mt-5 max-w-3xl text-xl leading-8 text-white/65">
                  This report shows paste events detected during the session and how much text was inserted.
                </p>

                <div className="mt-10 grid gap-5 md:grid-cols-4">
                  <div className="rounded-[24px] bg-[#09070d] p-6">
                    <p className="text-5xl font-extrabold">{pasteLogs.length}</p>
                    <p className="mt-2 text-lg text-white/70">Paste Events</p>
                  </div>

                  <div className="rounded-[24px] bg-[#09070d] p-6">
                    <p className="text-5xl font-extrabold">{totalPastedChars}</p>
                    <p className="mt-2 text-lg text-white/70">Characters</p>
                  </div>

                  <div className="rounded-[24px] bg-[#09070d] p-6">
                    <p className="text-5xl font-extrabold">{totalPastedWords}</p>
                    <p className="mt-2 text-lg text-white/70">Words</p>
                  </div>

                  <div className="rounded-[24px] bg-[#09070d] p-6">
                    <p className="text-5xl font-extrabold">{totalPastedLines}</p>
                    <p className="mt-2 text-lg text-white/70">Lines</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/8 bg-[#120b0f] p-6">
                <h3 className="text-2xl font-bold">Paste Event Breakdown</h3>

                {pasteLogs.length === 0 ? (
                  <div className="mt-5 rounded-[22px] border border-dashed border-white/10 bg-black/20 p-10 text-center text-white/50">
                    No paste events found for this session.
                  </div>
                ) : (
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    {pasteLogs
                      .slice()
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map((event, index) => (
                        <div
                          key={index}
                          className="rounded-[22px] border border-white/10 bg-[#09070d] p-5"
                        >
                          <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                              <p className="text-lg font-semibold">
                                {new Date(event.timestamp).toLocaleTimeString()}
                              </p>
                              <p className="text-sm text-white/45">
                                Paste event #{pasteLogs.length - index}
                              </p>
                            </div>

                            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-sm font-medium text-amber-300">
                              {getPasteSeverity(event.charCount)}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="rounded-xl bg-white/5 p-3">
                              <p className="text-white/45">Characters</p>
                              <p className="mt-1 text-xl font-bold">{event.charCount}</p>
                            </div>
                            <div className="rounded-xl bg-white/5 p-3">
                              <p className="text-white/45">Words</p>
                              <p className="mt-1 text-xl font-bold">{event.wordCount}</p>
                            </div>
                            <div className="rounded-xl bg-white/5 p-3">
                              <p className="text-white/45">Lines</p>
                              <p className="mt-1 text-xl font-bold">{event.lineCount}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-white/8 bg-gradient-to-br from-[#1b0c04] to-[#120701] p-6">
                <h3 className="text-2xl font-bold">Summary</h3>

                <div className="mt-5 rounded-[22px] border border-white/10 bg-[#09070d] p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                    Session Result
                  </p>
                  <p className="mt-3 text-3xl font-extrabold text-orange-400">
                    {pasteLogs.length} paste event{pasteLogs.length === 1 ? '' : 's'}
                  </p>
                  <p className="mt-2 text-white/70">
                    Total inserted text: {totalPastedChars} characters, {totalPastedWords} words.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="rounded-2xl bg-amber-500 px-5 py-3 font-semibold text-black transition hover:bg-amber-400"
                >
                  Download PDF
              </button>
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  )
}