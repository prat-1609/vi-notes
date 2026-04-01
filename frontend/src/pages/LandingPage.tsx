import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#120701] text-white">
      <header className="border-b border-white/10 bg-[#120701]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-lg font-bold text-black shadow-lg shadow-orange-900/30">
              V
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-300 to-amber-300 bg-clip-text text-transparent">
              Vi-Notes
            </h1>
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
        <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-[30px] border border-white/8 bg-gradient-to-br from-[#1d0902] via-[#180701] to-[#130601] p-8 shadow-[0_0_60px_rgba(255,140,0,0.08)]">
            <div className="max-w-4xl">
              <p className="mb-4 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300">
                Paste Detection
              </p>

              <h2 className="text-5xl font-extrabold leading-tight md:text-6xl">
                Detect when text is pasted into the editor.
              </h2>

              <p className="mt-5 max-w-3xl text-xl leading-8 text-white/65">
                Vi-Notes records paste events and measures how much text was inserted,
                helping distinguish pasted content from manually typed content.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/editor"
                  className="rounded-2xl bg-amber-500 px-6 py-4 font-semibold text-black transition hover:bg-amber-400"
                >
                  Start Demo
                </Link>

                <Link
                  to="/report"
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-semibold text-white transition hover:bg-white/10"
                >
                  View Report
                </Link>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-white/8 bg-gradient-to-br from-[#1b0c04] to-[#120701] p-6 shadow-[0_0_50px_rgba(255,166,0,0.08)]">
              <h3 className="text-2xl font-bold">What it does</h3>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-[#09070d] p-4 text-white/85">
                  1. Detects paste events in the editor
                </div>
                <div className="rounded-2xl bg-[#09070d] p-4 text-white/85">
                  2. Records pasted characters, words, and lines
                </div>
                <div className="rounded-2xl bg-[#09070d] p-4 text-white/85">
                  3. Stores session data in MongoDB
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/8 bg-[#100d15] p-6">
              <h3 className="text-2xl font-bold">Demo Flow</h3>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-white/45">Step 1</p>
                  <p className="mt-1 text-white/85">
                    Open the editor and start a session.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-white/45">Step 2</p>
                  <p className="mt-1 text-white/85">
                    Paste text into the editor.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-white/45">Step 3</p>
                  <p className="mt-1 text-white/85">
                    View the paste report and inserted text amount.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}