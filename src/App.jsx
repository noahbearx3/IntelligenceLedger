import { useEffect, useState } from "react";

const rssItems = [
  {
    label: "Injury Wire",
    detail: "TE status upgraded to limited practice.",
  },
  {
    label: "Local Beat",
    detail: "Defensive scheme shift expected in cold weather.",
  },
  {
    label: "Official Team",
    detail: "Travel schedule adjusted for weather risk.",
  },
];

const initialTidbits = [
  { text: "Josh Allen is 10-2 in games under 30°F.", votes: 214 },
  { text: "Bills are 6-1 ATS when favored by 3+ after a loss.", votes: 128 },
  { text: "Dolphins allow 4.8 YPC vs zone-heavy offenses.", votes: 96 },
];

const ledgerRows = [
  {
    date: "Jan 17",
    pick: "Bills -3.5",
    units: "1.0",
    anchor: "Cold weather edge",
    status: "Loss",
  },
  {
    date: "Jan 16",
    pick: "Chiefs ML",
    units: "1.5",
    anchor: "Travel fatigue data",
    status: "Win",
  },
  {
    date: "Jan 15",
    pick: "Eagles O24.5",
    units: "0.75",
    anchor: "Injury mismatch",
    status: "Pending",
  },
];

const flowSteps = [
  {
    title: "Research",
    detail: "Open a team to see RSS and tidbits in one view.",
  },
  {
    title: "Validate",
    detail: "Audit a pro by reviewing every pick, wins and losses.",
  },
  {
    title: "Commit",
    detail: "Post a 1-unit pick with a data anchor before lock.",
  },
  {
    title: "Review",
    detail: "Loss prompts encourage cool-downs and reflection.",
  },
];

const personaFeatures = [
  {
    title: "Aggregated Intelligence Terminal",
    points: [
      "Unified feed mixer with source tags and recency scoring.",
      "Change tracker for odds, injury, and sentiment deltas.",
      "First-to-market alerts on verified tidbits.",
    ],
  },
  {
    title: "Credibility & Verification",
    points: [
      "Verified analyst weighting for sentiment heat maps.",
      "Tipster audit view with full, immutable pick history.",
      "Tidbit validator badges with evidence links.",
    ],
  },
  {
    title: "Anti-Chase Controls",
    points: [
      "Configurable cooldowns after loss streaks.",
      "Loss-streak guardrails requiring data anchors.",
      "Daily unit-cap mode until next day.",
    ],
  },
  {
    title: "Research Efficiency Toolkit",
    points: [
      "Source credibility scores based on accuracy.",
      "Stat snapshot cards for verified data anchors.",
      "Noise filter to hide unverified content.",
    ],
  },
];

const statusClasses = {
  Win: "text-accent-2",
  Loss: "text-danger",
  Pending: "text-warning",
};

const Modal = ({ open, onClose, children, tone = "default" }) => {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-xl border border-border bg-card p-6 ${
          tone === "alert" ? "shadow-[0_0_0_1px_rgba(245,158,11,0.3)]" : ""
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("team");
  const [tidbits, setTidbits] = useState(initialTidbits);
  const [tidbitInput, setTidbitInput] = useState("");
  const [vault, setVault] = useState(25);
  const [sentiment, setSentiment] = useState(45);
  const [stopLoss, setStopLoss] = useState(5);
  const [lossToday, setLossToday] = useState(3);
  const [cooldown, setCooldown] = useState(30);
  const [unitCap, setUnitCap] = useState(5);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginName, setLoginName] = useState("Bob");
  const [pickOpen, setPickOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [blurOpen, setBlurOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSentiment(35 + Math.random() * 50);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const handleAddTidbit = () => {
    const value = tidbitInput.trim();
    if (!value) {
      return;
    }
    setTidbits((prev) => [{ text: value, votes: 1 }, ...prev]);
    setTidbitInput("");
  };

  const handlePickSubmit = (event) => {
    event.preventDefault();
    alert("Pick locked. Backend verification is required for immutable storage.");
    setPickOpen(false);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    setLoginOpen(false);
  };

  const handleKillSwitch = () => {
    if (lossToday >= stopLoss && stopLoss > 0) {
      alert(
        "Kill-Switch active. Posting and feed viewing are disabled until tomorrow."
      );
    } else {
      alert("Kill-Switch set. You are within your stop-loss range.");
    }
  };

  return (
    <div className="min-h-screen bg-ink text-slate-200">
      <header className="sticky top-0 z-20 border-b border-border bg-ink/95">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-12">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 font-bold text-ink">
              IL
            </span>
            <div>
              <h1 className="text-xl font-semibold">The Intelligence Ledger</h1>
              <p className="text-sm text-muted">
                Social intelligence for sports betting
              </p>
            </div>
          </div>
          <nav className="flex gap-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted">
                  <span className="h-2 w-2 rounded-full bg-accent-2" />
                  {loginName}
                </div>
                <button
                  className="rounded-xl border border-border px-4 py-2 text-sm"
                  onClick={() => setSettingsOpen(true)}
                >
                  Logic Filter
                </button>
                <button
                  className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink"
                  onClick={() => setPickOpen(true)}
                >
                  Post Pick
                </button>
              </>
            ) : (
              <>
                <button
                  className="rounded-xl border border-border px-4 py-2 text-sm"
                  onClick={() => setLoginOpen(true)}
                >
                  Log In
                </button>
                <button className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink">
                  Request Access
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex flex-col gap-6 px-6 py-8 md:px-12 md:py-10">
        <section className="rounded-xl border border-border bg-panel">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Team/Player DNA</h2>
            <div className="flex gap-2">
              {["team", "player"].map((tab) => (
                <button
                  key={tab}
                  className={`rounded-full border px-4 py-1 text-sm ${
                    activeTab === tab
                      ? "border-transparent bg-accent text-ink"
                      : "border-border"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "team" ? "Team" : "Player"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6 px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="flex flex-col gap-2 text-sm text-muted">
                Entity
                <select className="w-60 rounded-xl border border-border bg-card px-4 py-2 text-sm text-slate-200">
                  <option>Buffalo Bills</option>
                  <option>Miami Dolphins</option>
                  <option>Kansas City Chiefs</option>
                  <option>Philadelphia Eagles</option>
                </select>
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {["NFL", "AFC East", "2025 Season"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-accent/15 px-3 py-1 text-accent"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <article className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold">RSS Aggregator</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {rssItems.map((item) => (
                    <li key={item.label}>
                      <span className="font-semibold">{item.label}:</span>{" "}
                      {item.detail}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold">Sentiment Heat Map</h3>
                <div className="mt-4 space-y-3">
                  <div className="h-4 overflow-hidden rounded-full border border-border bg-ink">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500"
                      style={{ width: `${sentiment}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>Bullish</span>
                    <span>Neutral</span>
                    <span>Bearish</span>
                  </div>
                  <p className="text-xs text-muted">
                    Weighted by verified analyst ROI. Scans X and Reddit every 15
                    minutes to estimate public lean.
                  </p>
                </div>
              </article>
              <article className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-semibold">Tidbit Feed</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {tidbits.map((tidbit) => (
                    <li
                      key={`${tidbit.text}-${tidbit.votes}`}
                      className="flex items-start justify-between gap-3"
                    >
                      <span>{tidbit.text}</span>
                      <button className="rounded-full border border-border px-3 py-1 text-xs">
                        ▲ {tidbit.votes}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-3">
                  <input
                    value={tidbitInput}
                    onChange={(event) => setTidbitInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddTidbit();
                      }
                    }}
                    className="flex-1 rounded-xl border border-border bg-ink px-4 py-2 text-sm"
                    placeholder="Add a verified tidbit..."
                  />
                  <button
                    className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink"
                    onClick={handleAddTidbit}
                  >
                    Post
                  </button>
                </div>
                <p className="mt-3 text-xs text-muted">
                  Tidbits marked as verified receive a badge and higher ranking.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-panel">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Immutable Ledger</h2>
            <span className="rounded-full bg-accent-2/15 px-3 py-1 text-xs text-accent-2">
              Verified Analyst: 0% hidden picks
            </span>
          </div>
          <div className="space-y-6 px-6 py-6">
            <div className="grid gap-5 md:grid-cols-4">
              <div>
                <h3 className="text-2xl font-semibold text-slate-100">
                  +18.4 Units
                </h3>
                <p className="text-sm text-muted">Past 90 days</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted">Win/Loss</h4>
                <p className="text-base">61 - 47</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted">Last 7 Picks</h4>
                <p className="text-base">4W / 3L</p>
              </div>
              <div className="flex items-center">
                <button className="rounded-xl border border-border px-4 py-2 text-sm">
                  View Full History
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-5 gap-4 rounded-xl bg-ink px-4 py-2 text-xs uppercase tracking-widest text-muted">
                <span>Date</span>
                <span>Pick</span>
                <span>Units</span>
                <span>Anchor</span>
                <span>Status</span>
              </div>
              {ledgerRows.map((row) => (
                <div
                  key={`${row.date}-${row.pick}`}
                  className="grid grid-cols-5 gap-4 rounded-xl border border-border bg-card px-4 py-3"
                >
                  <span>{row.date}</span>
                  <span>{row.pick}</span>
                  <span>{row.units}</span>
                  <span>{row.anchor}</span>
                  <span className={statusClasses[row.status]}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
            {!isLoggedIn && (
              <div className="rounded-xl border border-border bg-ink px-4 py-3 text-xs text-muted">
                Log in to view full ledger history and verified analyst details.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-panel">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Logic Filter</h2>
          </div>
          <div className="grid gap-5 px-6 py-6 lg:grid-cols-4">
            <article className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold">The Blur Alert</h3>
              <p className="mt-3 text-sm text-slate-300">
                Triggers after 3 picks in 30 minutes following a loss. Offers a
                cool-down and forces review of data anchors.
              </p>
              <button
                className="mt-4 rounded-xl border border-border px-4 py-2 text-sm"
                onClick={() => setBlurOpen(true)}
              >
                Simulate Blur
              </button>
            </article>
            <article className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold">Kill-Switch</h3>
              <p className="mt-3 text-sm text-slate-300">
                Stops posting and feed access after a daily stop-loss is hit.
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                <label>Stop-loss (Units)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={stopLoss}
                  onChange={(event) => setStopLoss(Number(event.target.value))}
                  className="w-20 rounded-lg border border-border bg-ink px-2 py-1"
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <label>Losses today</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={lossToday}
                  onChange={(event) => setLossToday(Number(event.target.value))}
                  className="w-20 rounded-lg border border-border bg-ink px-2 py-1"
                />
              </div>
              <button
                className="mt-4 w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink"
                onClick={handleKillSwitch}
              >
                Apply Kill-Switch
              </button>
            </article>
            <article className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold">Anti-Chase Guardrails</h3>
              <p className="mt-3 text-sm text-slate-300">
                Adds friction after loss streaks and enforces unit caps.
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                <label>Cooldown (minutes)</label>
                <select
                  className="rounded-lg border border-border bg-ink px-2 py-1"
                  value={cooldown}
                  onChange={(event) => setCooldown(Number(event.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={30}>30</option>
                  <option value={60}>60</option>
                </select>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <label>Daily unit cap</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={unitCap}
                  onChange={(event) => setUnitCap(Number(event.target.value))}
                  className="w-20 rounded-lg border border-border bg-ink px-2 py-1"
                />
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm text-slate-300">
                <input type="checkbox" defaultChecked className="accent-accent" />
                Require data anchor after 2 losses
              </div>
            </article>
            <article className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-semibold">Recovery Fund Vault</h3>
              <p className="mt-3 text-sm text-slate-300">
                Protect survival funds by marking them as off-limits during
                staking.
              </p>
              <div className="mt-4">
                <label className="text-sm">Vaulted %</label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={vault}
                  onChange={(event) => setVault(Number(event.target.value))}
                  className="mt-2 w-full"
                />
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>{vault}%</span>
                  <span className="text-muted">Off-limits bankroll</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-panel">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Persona-Driven Additions</h2>
            <p className="text-sm text-muted">
              Built for Bob: reduce research friction and prevent chase behavior.
            </p>
          </div>
          <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
            {personaFeatures.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {feature.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-panel">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Analyst Flow</h2>
          </div>
          <div className="grid gap-5 px-6 py-6 md:grid-cols-2 lg:grid-cols-4">
            {flowSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h4 className="text-base font-semibold">{step.title}</h4>
                <p className="mt-2 text-sm text-slate-300">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-6 pb-12 text-center text-xs text-muted md:px-12">
        Beta build prototype. Data shown is sample-only. Ledger immutability and
        verified picks require backend integration.
      </footer>

      <Modal open={pickOpen} onClose={() => setPickOpen(false)}>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Post a Verified Pick</h3>
          <button
            className="text-xl"
            onClick={() => setPickOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <form className="space-y-3" onSubmit={handlePickSubmit}>
          <label className="text-sm">
            Pick
            <input
              type="text"
              placeholder="Bills -3.5"
              required
              className="mt-2 w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Units
            <input
              type="number"
              min="0.25"
              step="0.25"
              defaultValue="1"
              required
              className="mt-2 w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Data Anchor
            <textarea
              placeholder="What is the data anchor for this pick?"
              required
              className="mt-2 min-h-[90px] w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
            />
          </label>
          <button className="w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink">
            Lock Pick
          </button>
        </form>
      </Modal>

      <Modal open={loginOpen} onClose={() => setLoginOpen(false)}>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Log in</h3>
          <button
            className="text-xl"
            onClick={() => setLoginOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <form className="space-y-3" onSubmit={handleLoginSubmit}>
          <label className="text-sm">
            Name
            <input
              type="text"
              value={loginName}
              onChange={(event) => setLoginName(event.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Email
            <input
              type="email"
              placeholder="bob@email.com"
              required
              className="mt-2 w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Password
            <input
              type="password"
              placeholder="••••••••"
              required
              className="mt-2 w-full rounded-xl border border-border bg-ink px-3 py-2 text-sm"
            />
          </label>
          <button className="w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink">
            Sign in
          </button>
        </form>
      </Modal>

      <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Logic Filter Settings</h3>
          <button
            className="text-xl"
            onClick={() => setSettingsOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <div className="space-y-3 text-sm">
          {[
            "Blur Alert enabled",
            "Kill-Switch enabled",
            "Loss-streak guardrails enabled",
            "Recovery Fund Vault enabled",
            "Noise filter for unverified tidbits",
          ].map((label) => (
            <label key={label} className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="accent-accent" />
              {label}
            </label>
          ))}
        </div>
        <button
          className="mt-5 w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink"
          onClick={() => setSettingsOpen(false)}
        >
          Save
        </button>
      </Modal>

      <Modal open={blurOpen} onClose={() => setBlurOpen(false)} tone="alert">
        <header className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-warning">
            Detecting Potential Chase
          </h3>
          <button
            className="text-xl"
            onClick={() => setBlurOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <p className="text-sm text-slate-300">
          You've placed 3 picks in the last 30 minutes after a loss. Review your
          tidbit data before proceeding.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className="rounded-xl border border-border px-4 py-2 text-sm"
            onClick={() => setBlurOpen(false)}
          >
            Review Tidbits
          </button>
          <button
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink"
            onClick={() => setBlurOpen(false)}
          >
            Bench Me 4 Hours
          </button>
        </div>
      </Modal>
    </div>
  );
}
