'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Status = 'Not started' | 'In progress' | 'Done';

interface Control {
  id: string;
  area: string;
  label: string;
  status: Status;
  notes: string;
}

interface CompanyInfo {
  name: string;
  email: string;
}

const CONTROLS_TEMPLATE: Omit<Control, 'status' | 'notes'>[] = [
  { id: 'fw1', area: 'Firewalls', label: 'Boundary firewall configured and rules documented' },
  { id: 'fw2', area: 'Firewalls', label: 'No unnecessary ports/services exposed to the internet' },
  { id: 'sc1', area: 'Secure Configuration', label: 'Default passwords changed on all devices and software' },
  { id: 'sc2', area: 'Secure Configuration', label: 'Unnecessary software and services removed or disabled' },
  { id: 'ua1', area: 'User Access Control', label: 'Admin accounts used only for admin tasks (not email/browsing)' },
  { id: 'ua2', area: 'User Access Control', label: 'MFA enabled for all remote and privileged access' },
  { id: 'ua3', area: 'User Access Control', label: 'Password policy enforced: min 8 chars, no shared/default passwords' },
  { id: 'mp1', area: 'Malware Protection', label: 'Antivirus/anti-malware active and updating on all devices' },
  { id: 'pm1', area: 'Patch Management', label: 'OS patches applied within 14 days of release' },
  { id: 'pm2', area: 'Patch Management', label: 'Application patches applied within 14 days of release' },
];

const STATUS_OPTIONS: Status[] = ['Not started', 'In progress', 'Done'];
const STORAGE_KEY = 'ce_evidence_pack_v1';

function loadState(): { company: CompanyInfo; controls: Control[] } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(data: { company: CompanyInfo; controls: Control[] }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export default function MvpPage() {
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState<CompanyInfo>({ name: '', email: '' });
  const [controls, setControls] = useState<Control[]>(
    CONTROLS_TEMPLATE.map((c) => ({ ...c, status: 'Not started', notes: '' }))
  );

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (saved.company) setCompany(saved.company);
      if (saved.controls) setControls(saved.controls);
    }
  }, []);

  useEffect(() => {
    saveState({ company, controls });
  }, [company, controls]);

  const doneCount = controls.filter((c) => c.status === 'Done').length;
  const totalCount = controls.length;
  const pct = Math.round((doneCount / totalCount) * 100);

  function updateControl(index: number, patch: Partial<Control>) {
    setControls((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function exportPack() {
    const pack = {
      exportedAt: new Date().toISOString(),
      company,
      readiness: `${doneCount}/${totalCount} controls complete (${pct}%)`,
      controls: controls.map((c) => ({
        area: c.area,
        control: c.label,
        status: c.status,
        notes: c.notes || '—',
      })),
    };
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ce-evidence-pack-${(company.name || 'export').replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function buildHandoffMailto() {
    const lines = controls.map(
      (c) =>
        `${c.status === 'Done' ? '[✓]' : c.status === 'In progress' ? '[~]' : '[ ]'} ${c.area}: ${c.label}${c.notes ? ` — ${c.notes}` : ''}`
    );
    const body = [
      `Hi,`,
      ``,
      `I'd like to arrange an assessor handoff for Cyber Essentials certification.`,
      ``,
      `Company: ${company.name}`,
      `Contact: ${company.email}`,
      `Readiness: ${doneCount}/${totalCount} controls complete (${pct}%)`,
      ``,
      `Control summary:`,
      ...lines,
      ``,
      `I've also attached the JSON evidence pack.`,
      ``,
      `Please get in touch to arrange a call.`,
      ``,
      `Thanks`,
    ].join('\n');
    const subject = encodeURIComponent(`Cyber Essentials Assessor Handoff – ${company.name}`);
    return `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
  }

  function buildEarlyAccessMailto() {
    return `mailto:rob@leanspace.co?subject=${encodeURIComponent('Early access: Cyber Essentials Evidence Pack')}&body=${encodeURIComponent(
      `Hi,\n\nI'm interested in the Cyber Essentials Evidence Pack Builder.\n\nCompany: ${company.name || '[your company]'}\nEmail: ${company.email || '[your email]'}\n\nPlease get in touch.\n\nThanks`
    )}`;
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 mb-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 font-extrabold text-slate-950">
            TR
          </div>
          <div>
            <div className="font-extrabold">TenderReady</div>
            <div className="text-xs text-[color:var(--muted)]">Evidence Pack Builder</div>
          </div>
        </Link>
        <Link href="/" className="text-sm text-[color:var(--muted)] hover:text-white transition-colors">
          ← Home
        </Link>
      </header>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {([
          { n: 1, label: 'Company details' },
          { n: 2, label: 'Controls checklist' },
          { n: 3, label: 'Export pack' },
        ] as const).map(({ n, label }, i) => (
          <div key={n} className="flex items-center gap-2">
            <button
              onClick={() => n < step && setStep(n)}
              title={label}
              className={`h-8 w-8 rounded-full text-sm font-bold transition-colors ${
                n === step
                  ? 'bg-gradient-to-br from-violet-500 to-sky-400 text-slate-950'
                  : n < step
                  ? 'bg-violet-700 text-white cursor-pointer hover:bg-violet-600'
                  : 'bg-white/10 text-[color:var(--muted)] cursor-default'
              }`}
            >
              {n}
            </button>
            {i < 2 && <div className={`h-0.5 w-10 ${n < step ? 'bg-violet-500' : 'bg-white/10'}`} />}
          </div>
        ))}
        <span className="ml-3 text-sm text-[color:var(--muted)]">
          {step === 1 ? 'Company details' : step === 2 ? 'Controls checklist' : 'Export pack'}
        </span>
      </div>

      {/* ── Step 1: Company details ── */}
      {step === 1 && (
        <section>
          <h1 className="text-2xl font-extrabold mb-1">Your details</h1>
          <p className="text-[color:var(--muted)] mb-6 leading-relaxed">
            Personalises your evidence pack. Stored only in your browser — nothing is sent to a server.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Company name</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                placeholder="Acme Construction Ltd"
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Contact email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                placeholder="you@company.co.uk"
                value={company.email}
                onChange={(e) => setCompany({ ...company, email: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-[color:var(--muted)]">
            Prefer to talk first?{' '}
            <a href={buildEarlyAccessMailto()} className="underline text-violet-300 hover:text-violet-200">
              Send us an email
            </a>{' '}
            and we'll be in touch.
          </div>

          <button
            className="mt-6 rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 px-6 py-3 font-semibold text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            disabled={!company.name.trim()}
            onClick={() => setStep(2)}
          >
            Next: Controls checklist →
          </button>
        </section>
      )}

      {/* ── Step 2: Controls checklist ── */}
      {step === 2 && (
        <section>
          <h1 className="text-2xl font-extrabold mb-1">Controls checklist</h1>
          <p className="text-[color:var(--muted)] mb-2 leading-relaxed">
            Rate each Cyber Essentials control and add evidence notes. Progress is saved automatically.
          </p>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-green-400 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-violet-300 whitespace-nowrap">
              {doneCount}/{totalCount} done
            </span>
          </div>

          <div className="space-y-3">
            {controls.map((ctrl, i) => (
              <div key={ctrl.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                      ctrl.status === 'Done'
                        ? 'bg-green-400'
                        : ctrl.status === 'In progress'
                        ? 'bg-yellow-400'
                        : 'bg-white/20'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-violet-300 mb-0.5">{ctrl.area}</div>
                    <div className="text-sm font-medium mb-2 leading-snug">{ctrl.label}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateControl(i, { status: s })}
                          className={`rounded-lg px-3 py-1 text-xs font-semibold border transition-colors ${
                            ctrl.status === s
                              ? s === 'Done'
                                ? 'bg-green-500/20 border-green-400 text-green-300'
                                : s === 'In progress'
                                ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                                : 'bg-white/10 border-white/40 text-white'
                              : 'border-white/10 text-[color:var(--muted)] hover:border-white/30 hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-400 resize-none transition-colors"
                      rows={2}
                      placeholder="Evidence notes: screenshot location, policy doc name, ticket #…"
                      value={ctrl.notes}
                      onChange={(e) => updateControl(i, { notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
              onClick={() => setStep(1)}
            >
              ← Back
            </button>
            <button
              className="rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 px-6 py-3 font-semibold text-slate-950"
              onClick={() => setStep(3)}
            >
              Next: Export pack →
            </button>
          </div>
        </section>
      )}

      {/* ── Step 3: Export ── */}
      {step === 3 && (
        <section>
          <h1 className="text-2xl font-extrabold mb-1">Export your evidence pack</h1>
          <p className="text-[color:var(--muted)] mb-6 leading-relaxed">
            Download as JSON or send a prefilled handoff email straight to an assessor.
          </p>

          {/* Summary card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6">
            <div className="font-bold text-base mb-0.5">{company.name}</div>
            <div className="text-[color:var(--muted)] text-sm mb-4">{company.email}</div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-green-400 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-sm font-bold">{pct}%</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {STATUS_OPTIONS.map((s) => (
                <div key={s} className="rounded-xl bg-white/5 py-2.5 px-1">
                  <div className="font-bold text-lg leading-none mb-1">
                    {controls.filter((c) => c.status === s).length}
                  </div>
                  <div className="text-xs text-[color:var(--muted)]">{s}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={exportPack}
              className="w-full rounded-xl bg-gradient-to-br from-violet-500 to-sky-400 px-6 py-3.5 font-semibold text-slate-950 text-center hover:opacity-90 transition-opacity"
            >
              Download evidence pack (JSON)
            </button>
            <a
              href={buildHandoffMailto()}
              className="block w-full rounded-xl border border-violet-400/50 bg-violet-500/10 px-6 py-3.5 font-semibold text-center text-violet-200 hover:bg-violet-500/20 transition-colors"
            >
              Book assessor handoff →
            </a>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-[color:var(--muted)] leading-relaxed">
            Your data is stored only in your browser (localStorage). The JSON export contains everything your MSP or
            assessor needs for a smooth handoff — company info, control statuses, evidence notes, and a timestamp.
          </div>

          <button
            className="mt-5 text-sm text-[color:var(--muted)] hover:text-white transition-colors"
            onClick={() => setStep(2)}
          >
            ← Back to checklist
          </button>
        </section>
      )}

      <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-[color:var(--muted)]">
        © {new Date().getFullYear()} TenderReady — Evidence stored locally in your browser, never uploaded.
      </footer>
    </main>
  );
}
