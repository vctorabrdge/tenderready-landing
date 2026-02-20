import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 font-extrabold text-slate-950">
            TR
          </div>
          <div>
            <div className="font-extrabold">TenderReady</div>
            <div className="text-xs text-[color:var(--muted)]">Working title</div>
          </div>
        </div>
        <nav className="text-sm text-[color:var(--muted)] flex gap-4">
          <Link href="/resources">Resources</Link>
          <a href="#how">How it works</a>
          <a href="#pack">Handoff pack</a>
        </nav>
      </header>

      <section className="py-14">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Win tenders faster with a Cyber Essentials-ready evidence pack.
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[color:var(--muted)]">
          A DIY readiness workflow for UK construction & trades teams (10–50 staff): assign fixes, collect evidence as you go,
          then export a clean handoff pack for your MSP/assessor.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            className="rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 px-4 py-3 font-semibold text-slate-950"
            href="mailto:rob@leanspace.co?subject=Early%20access%3A%20Cyber%20Essentials%20Readiness%20Tracker"
          >
            Get early access
          </a>
          <a className="rounded-xl border border-white/10 bg-[color:var(--btn)] px-4 py-3 font-semibold" href="#pack">
            See what’s in the handoff pack
          </a>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Tender deadline driven</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Evidence vault</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Gap report export</span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[var(--shadow)]">
          <h2 className="text-xl font-bold">The problem</h2>
          <ul className="mt-3 list-disc pl-5 text-[color:var(--muted)] leading-relaxed">
            <li>Tasks aren’t owned (“someone needs to change that setting”).</li>
            <li>Evidence is scattered (screenshots in WhatsApp, docs in Drive).</li>
            <li>MSP/assessor handoff is messy (context lost → rework → delays).</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[var(--shadow)]">
          <h2 className="text-xl font-bold">The fix</h2>
          <ul className="mt-3 list-disc pl-5 text-[color:var(--muted)] leading-relaxed">
            <li>Controls checklist mapped to the 5 areas.</li>
            <li>Tasks with owners + due dates.</li>
            <li>Evidence per control (screenshots, exports, policies).</li>
            <li>Readiness score + blockers.</li>
            <li>
              <strong className="text-[color:var(--text)]">Exportable handoff pack</strong> (gap report + evidence index).
            </li>
          </ul>
        </div>
      </section>

      <section id="how" className="py-12">
        <h2 className="text-2xl font-extrabold">How it works</h2>
        <ol className="mt-4 list-decimal pl-5 text-[color:var(--muted)] leading-relaxed">
          <li>Quick setup about your environment (M365/Google, devices, remote working).</li>
          <li>Work through controls: assign tasks + upload evidence as you go.</li>
          <li>Export a single handoff pack for your MSP/assessor.</li>
        </ol>
      </section>

      <section id="pack" className="py-12">
        <h2 className="text-2xl font-extrabold">What’s in the handoff pack</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            {
              h: 'Gap report',
              p: 'Tender-friendly summary: what’s done, what’s missing, and what’s blocking readiness.',
            },
            {
              h: 'Evidence index',
              p: 'Control-by-control list of evidence items (file, date, note) so your MSP/assessor moves quickly.',
            },
            {
              h: 'Control notes',
              p: 'Plain-English notes per control: what you changed, where it lives, and who owns it.',
            },
          ].map((c) => (
            <div key={c.h} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[var(--shadow)]">
              <h3 className="font-bold">{c.h}</h3>
              <p className="mt-2 text-[color:var(--muted)] leading-relaxed">{c.p}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-violet-400/50 bg-violet-500/10 p-4">
          <strong>Built for construction & trades:</strong> busy teams, tender deadlines, MSP handoff — not a compliance textbook.
        </div>
      </section>

      <footer className="mt-10 border-t border-white/10 py-8 text-sm text-[color:var(--muted)] flex flex-wrap justify-between gap-3">
        <div>© {new Date().getFullYear()} TenderReady (working title)</div>
        <div>
          Resources: <Link className="underline" href="/resources">/resources</Link>
        </div>
      </footer>
    </main>
  );
}
