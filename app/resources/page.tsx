import Link from 'next/link';
import { resources } from './resources';

export const dynamic = 'force-static';

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 font-extrabold text-slate-950">
            TR
          </div>
          <div>
            <div className="font-extrabold">Resources</div>
            <div className="text-xs text-[color:var(--muted)]">All articles</div>
          </div>
        </div>
        <nav className="text-sm text-[color:var(--muted)] flex gap-4">
          <Link href="/">Home</Link>
        </nav>
      </header>

      <section className="py-10">
        <h1 className="text-3xl font-extrabold">Cyber Essentials guides (SME, tender-first)</h1>
        <p className="mt-3 text-[color:var(--muted)] max-w-3xl">
          Short guides with evidence prompts. For UK SMEs doing Cyber Essentials because a customer or tender requires it.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <ul className="grid gap-2">
            {resources.map((r) => (
              <li key={r.href}>
                <a className="underline" href={r.href}>
                  {r.title}
                </a>
                <div className="text-xs text-[color:var(--muted)]">{r.keyword}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
