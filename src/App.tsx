import { type CSSProperties, type ReactNode, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpRight,
  BadgeDollarSign,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  Gift,
  Globe2,
  Home,
  Landmark,
  LayoutGrid,
  Pencil,
  Search,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRound,
  Users,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

type Screen = "home" | "numbers" | "countries" | "wallet" | "referral";
type NumberStep = "services" | "countries" | "assigned";
type WalletEdit = "trx" | "naira" | null;

type Service = {
  id: string;
  name: string;
  mark: string;
  accent: string;
  soft: string;
  countries: { name: string; code: string; stock: number; accent: string }[];
};

const services: Service[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    mark: "W",
    accent: "#25d366",
    soft: "#e8fff1",
    countries: [
      { name: "Guinea", code: "GN", stock: 42, accent: "#f39b24" },
      { name: "Nigeria", code: "NG", stock: 31, accent: "#16a365" },
      { name: "Ghana", code: "GH", stock: 18, accent: "#e6b23b" },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    mark: "f",
    accent: "#1877f2",
    soft: "#eaf2ff",
    countries: [
      { name: "Kenya", code: "KE", stock: 24, accent: "#cc2d42" },
      { name: "Nigeria", code: "NG", stock: 20, accent: "#16a365" },
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    mark: "T",
    accent: "#229ed9",
    soft: "#e8f7ff",
    countries: [
      { name: "United Kingdom", code: "GB", stock: 16, accent: "#4966b9" },
      { name: "Ghana", code: "GH", stock: 12, accent: "#e6b23b" },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    mark: "◎",
    accent: "#d62976",
    soft: "#fff0f6",
    countries: [
      { name: "South Africa", code: "ZA", stock: 22, accent: "#d8a82b" },
      { name: "United States", code: "US", stock: 11, accent: "#3a6ec8" },
    ],
  },
  {
    id: "google",
    name: "Google",
    mark: "G",
    accent: "#4285f4",
    soft: "#eef4ff",
    countries: [
      { name: "India", code: "IN", stock: 38, accent: "#f0822b" },
      { name: "Indonesia", code: "ID", stock: 14, accent: "#d84949" },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    mark: "♪",
    accent: "#111827",
    soft: "#eff2f6",
    countries: [
      { name: "Brazil", code: "BR", stock: 18, accent: "#28a36c" },
      { name: "Mexico", code: "MX", stock: 9, accent: "#d65f44" },
    ],
  },
  {
    id: "signal",
    name: "Signal",
    mark: "S",
    accent: "#3a76f0",
    soft: "#edf3ff",
    countries: [
      { name: "Canada", code: "CA", stock: 13, accent: "#da5353" },
      { name: "France", code: "FR", stock: 8, accent: "#4a79c6" },
    ],
  },
  {
    id: "viber",
    name: "Viber",
    mark: "V",
    accent: "#7357c9",
    soft: "#f1edff",
    countries: [
      { name: "Turkey", code: "TR", stock: 17, accent: "#d75055" },
      { name: "Egypt", code: "EG", stock: 8, accent: "#d29b27" },
    ],
  },
];

const allCountries = [
  { name: "Nigeria", code: "NG", stock: 73, accent: "#16a365" },
  { name: "Guinea", code: "GN", stock: 42, accent: "#f39b24" },
  { name: "India", code: "IN", stock: 38, accent: "#f0822b" },
  { name: "Ghana", code: "GH", stock: 30, accent: "#e6b23b" },
  { name: "Kenya", code: "KE", stock: 24, accent: "#cc2d42" },
  { name: "South Africa", code: "ZA", stock: 22, accent: "#d8a82b" },
  { name: "Brazil", code: "BR", stock: 18, accent: "#28a36c" },
  { name: "Turkey", code: "TR", stock: 17, accent: "#d75055" },
  { name: "United Kingdom", code: "GB", stock: 16, accent: "#4966b9" },
  { name: "Canada", code: "CA", stock: 13, accent: "#da5353" },
];

function BrandMark({
  mark,
  accent,
  size = "md",
}: {
  mark: string;
  accent: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={`brand-mark brand-mark-${size}`} style={{ "--mark": accent } as CSSProperties}>
      {mark}
    </span>
  );
}

function FlagMark({ code, accent }: { code: string; accent: string }) {
  return (
    <span className="flag-mark" style={{ "--flag": accent } as CSSProperties}>
      <span />
      <b>{code}</b>
    </span>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [numberStep, setNumberStep] = useState<NumberStep>("services");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<(typeof allCountries)[number] | null>(null);
  const [copied, setCopied] = useState("");
  const [walletEdit, setWalletEdit] = useState<WalletEdit>(null);
  const [walletSaved, setWalletSaved] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<"trx" | "naira" | null>(null);
  const [withdrawDone, setWithdrawDone] = useState(false);
  const [search, setSearch] = useState("");

  const availableCountries = useMemo(
    () => selectedService?.countries ?? allCountries,
    [selectedService],
  );

  const goHome = () => {
    setScreen("home");
    setNumberStep("services");
    setSelectedService(null);
    setSelectedCountry(null);
    setWithdrawMethod(null);
    setWithdrawDone(false);
  };

  const copyText = async (value: string, key: string) => {
    try {
      await navigator.clipboard?.writeText(value);
    } catch {
      // Telegram WebView can restrict clipboard access; visual feedback still confirms the action.
    }
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1400);
  };

  const openNumbers = () => {
    setScreen("numbers");
    setNumberStep("services");
    setSelectedService(null);
    setSelectedCountry(null);
  };

  const selectService = (service: Service) => {
    setSelectedService(service);
    setNumberStep("countries");
  };

  const assignNumber = (country: (typeof allCountries)[number]) => {
    setSelectedCountry(country);
    setNumberStep("assigned");
  };

  const headerTitle = screen === "home"
    ? "Good afternoon, Nordan"
    : screen === "numbers"
      ? numberStep === "services" ? "Get a number" : numberStep === "countries" ? selectedService?.name ?? "Choose country" : "Active number"
      : screen === "countries" ? "Countries"
        : screen === "wallet" ? "Your wallet"
          : "Referral circle";

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="app-frame">
        <header className="topbar">
          <button className="brand-lockup" onClick={goHome} aria-label="Go home">
            <span className="nordan-symbol"><span /></span>
            <span>
              <strong>NORDAN</strong>
              <small>SMS WORKSPACE</small>
            </span>
          </button>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button>
            <button className="avatar" aria-label="Profile"><UserRound size={17} /></button>
          </div>
        </header>

        {screen === "home" && (
          <HomeScreen
            onNumbers={openNumbers}
            onWallet={() => setScreen("wallet")}
            onReferral={() => setScreen("referral")}
            onStatus={() => {
              setScreen("numbers");
              setNumberStep("assigned");
              setSelectedCountry(allCountries[1]);
            }}
          />
        )}

        {screen === "numbers" && (
          <NumbersScreen
            step={numberStep}
            service={selectedService}
            country={selectedCountry}
            countries={availableCountries}
            onBack={() => {
              if (numberStep === "assigned") setNumberStep("countries");
              else if (numberStep === "countries") setNumberStep("services");
              else goHome();
            }}
            onService={selectService}
            onCountry={assignNumber}
            copied={copied}
            onCopy={copyText}
            onHome={goHome}
          />
        )}

        {screen === "countries" && (
          <CountriesScreen
            search={search}
            setSearch={setSearch}
            onService={(service) => {
              setScreen("numbers");
              setSelectedService(service);
              setNumberStep("countries");
            }}
          />
        )}

        {screen === "wallet" && (
          <WalletScreen
            edit={walletEdit}
            setEdit={setWalletEdit}
            saved={walletSaved}
            onSave={() => {
              setWalletSaved(true);
              setWalletEdit(null);
              window.setTimeout(() => setWalletSaved(false), 2200);
            }}
            method={withdrawMethod}
            setMethod={setWithdrawMethod}
            done={withdrawDone}
            onConfirm={() => setWithdrawDone(true)}
            onResetWithdraw={() => {
              setWithdrawMethod(null);
              setWithdrawDone(false);
            }}
          />
        )}

        {screen === "referral" && <ReferralScreen onCopy={copyText} copied={copied} />}

        <nav className="bottom-nav">
          <NavButton active={screen === "home"} label="Home" icon={<Home size={19} />} onClick={goHome} />
          <NavButton active={screen === "numbers"} label="Numbers" icon={<Smartphone size={19} />} onClick={openNumbers} />
          <NavButton active={screen === "countries"} label="Countries" icon={<Globe2 size={19} />} onClick={() => setScreen("countries")} />
          <NavButton active={screen === "wallet"} label="Wallet" icon={<WalletCards size={19} />} onClick={() => setScreen("wallet")} />
          <NavButton active={screen === "referral"} label="Invite" icon={<Users size={19} />} onClick={() => setScreen("referral")} />
        </nav>
      </div>
    </main>
  );
}

function NavButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button className={`nav-button ${active ? "active" : ""}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function HomeScreen({
  onNumbers,
  onWallet,
  onReferral,
  onStatus,
}: {
  onNumbers: () => void;
  onWallet: () => void;
  onReferral: () => void;
  onStatus: () => void;
}) {
  return (
    <section className="screen fade-in">
      <div className="welcome-row">
        <div>
          <p className="eyebrow"><span className="live-dot" /> Workspace online</p>
          <h1>Good afternoon,<br /><em>Nordan</em></h1>
        </div>
        <div className="mini-spark"><Sparkles size={18} /></div>
      </div>

      <section className="balance-hero">
        <div className="balance-topline"><span>Available balance</span><span className="secure-pill"><ShieldCheck size={13} /> Secured</span></div>
        <div className="balance-amount">$1.24 <small>USD</small></div>
        <div className="balance-meta"><span>≈ ₦1,984</span><span className="balance-growth"><ArrowUpRight size={14} /> +12.8% this month</span></div>
        <div className="balance-actions">
          <button className="light-action" onClick={onWallet}><ArrowDownToLine size={16} /> Withdraw</button>
          <button className="ghost-action" onClick={onReferral}><Gift size={16} /> Earn more</button>
        </div>
      </section>

      <div className="section-heading">
        <div><p className="eyebrow">Quick actions</p><h2>Make a move</h2></div>
        <span className="muted-label">3 shortcuts</span>
      </div>
      <div className="quick-grid">
        <button className="quick-card quick-primary" onClick={onNumbers}>
          <span className="quick-icon"><Zap size={19} /></span>
          <span><strong>Get a number</strong><small>Start receiving OTPs</small></span>
          <ChevronRight size={18} />
        </button>
        <button className="quick-card" onClick={onStatus}>
          <span className="quick-icon blue"><LayoutGrid size={19} /></span>
          <span><strong>My active number</strong><small>View your latest OTP</small></span>
          <ChevronRight size={18} />
        </button>
        <button className="quick-card" onClick={onWallet}>
          <span className="quick-icon purple"><WalletCards size={19} /></span>
          <span><strong>Wallet details</strong><small>TRX and Naira accounts</small></span>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="section-heading recent-heading">
        <div><p className="eyebrow">Live pulse</p><h2>Recent activity</h2></div>
        <button className="text-link">View all <ChevronRight size={15} /></button>
      </div>
      <div className="activity-card">
        <ActivityRow icon={<Smartphone size={17} />} color="green" title="WhatsApp number assigned" detail="Guinea · +224 6•• •• 202" amount="+$0.005" time="2 min ago" />
        <ActivityRow icon={<BadgeDollarSign size={17} />} color="blue" title="OTP reward received" detail="WhatsApp verification complete" amount="+$0.005" time="2 min ago" />
        <ActivityRow icon={<Users size={17} />} color="purple" title="Referral joined" detail="A new member joined your circle" amount="+$0.010" time="Yesterday" />
      </div>
    </section>
  );
}

function ActivityRow({ icon, color, title, detail, amount, time }: { icon: ReactNode; color: string; title: string; detail: string; amount: string; time: string }) {
  return (
    <div className="activity-row">
      <span className={`activity-icon ${color}`}>{icon}</span>
      <span className="activity-copy"><strong>{title}</strong><small>{detail}</small></span>
      <span className="activity-value"><strong>{amount}</strong><small>{time}</small></span>
    </div>
  );
}

function NumbersScreen({
  step,
  service,
  country,
  countries,
  onBack,
  onService,
  onCountry,
  copied,
  onCopy,
  onHome,
}: {
  step: NumberStep;
  service: Service | null;
  country: (typeof allCountries)[number] | null;
  countries: { name: string; code: string; stock: number; accent: string }[];
  onBack: () => void;
  onService: (service: Service) => void;
  onCountry: (country: (typeof allCountries)[number]) => void;
  copied: string;
  onCopy: (value: string, key: string) => void;
  onHome: () => void;
}) {
  return (
    <section className="screen fade-in">
      <div className="page-title-row">
        <button className="back-button" onClick={onBack}><ArrowLeft size={18} /></button>
        <div><p className="eyebrow">{step === "assigned" ? "Verification line" : "Number marketplace"}</p><h1>{step === "services" ? "Choose a service" : step === "countries" ? "Choose a country" : "Your number is ready"}</h1></div>
      </div>
      {step === "services" && (
        <>
          <p className="page-intro">Pick a service below and we’ll find a fresh number with live OTP delivery.</p>
          <div className="status-strip"><span className="live-dot" /> <strong>198 numbers</strong> available right now <span className="strip-divider" /> <Clock3 size={14} /> usually under 10 sec</div>
          <div className="service-grid">
            {services.map((item) => (
              <button className="service-card" key={item.id} onClick={() => onService(item)} style={{ "--service": item.accent, "--service-soft": item.soft } as React.CSSProperties}>
                <BrandMark mark={item.mark} accent={item.accent} size="lg" />
                <span className="service-info"><strong>{item.name}</strong><small>{item.countries.reduce((sum, entry) => sum + entry.stock, 0)} numbers ready</small></span>
                <ChevronRight size={17} className="service-arrow" />
              </button>
            ))}
          </div>
        </>
      )}
      {step === "countries" && service && (
        <>
          <div className="selected-service-banner" style={{ "--service": service.accent } as React.CSSProperties}>
            <BrandMark mark={service.mark} accent={service.accent} size="md" />
            <span><small>Selected service</small><strong>{service.name}</strong></span>
            <span className="banner-count">{countries.reduce((sum, entry) => sum + entry.stock, 0)} ready</span>
          </div>
          <p className="page-intro">Choose where your verification number should be registered.</p>
          <div className="country-list">
            {countries.map((item) => (
              <button className="country-row" key={item.code} onClick={() => onCountry(item)}>
                <FlagMark code={item.code} accent={item.accent} />
                <span><strong>{item.name}</strong><small>Fast delivery · {item.stock} in stock</small></span>
                <span className="country-price">$0.005 <ChevronRight size={17} /></span>
              </button>
            ))}
          </div>
        </>
      )}
      {step === "assigned" && (
        <>
          <div className="assigned-card">
            <div className="assigned-top"><span className="live-badge"><span className="live-dot" /> Waiting for OTP</span><span className="timer">00:58</span></div>
            <div className="assigned-service"><BrandMark mark={service?.mark ?? "W"} accent={service?.accent ?? "#25d366"} size="md" /><span><small>{country?.name ?? "Guinea"} · {service?.name ?? "WhatsApp"}</small><strong>+224 6•• •• 202</strong></span></div>
            <button className={`copy-number ${copied === "number" ? "copied" : ""}`} onClick={() => onCopy("+224 6 226 4202", "number")}>
              {copied === "number" ? <Check size={19} /> : <Copy size={19} />}<span>{copied === "number" ? "Number copied" : "Copy number"}</span>
            </button>
            <div className="otp-placeholder"><span>OTP will appear here</span><Clock3 size={15} /></div>
            <div className="assigned-foot"><span><BadgeDollarSign size={14} /> Earn $0.005 when verified</span><button onClick={onHome}>End session</button></div>
          </div>
          <div className="tip-card"><Sparkles size={17} /><span><strong>Keep this screen open</strong><small>We’ll show your OTP here automatically when it arrives.</small></span></div>
        </>
      )}
    </section>
  );
}

function CountriesScreen({ search, setSearch, onService }: { search: string; setSearch: (value: string) => void; onService: (service: Service) => void }) {
  const filtered = allCountries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <section className="screen fade-in">
      <div className="page-title-row no-back"><div><p className="eyebrow">Global inventory</p><h1>Countries</h1></div><span className="round-count">{allCountries.length}</span></div>
      <p className="page-intro">Browse active number stock by country and find the best route for your next verification.</p>
      <label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search countries" /><span>{filtered.length}</span></label>
      <div className="country-cards">
        {filtered.map((item) => (
          <button className="country-tile" key={item.code} onClick={() => onService(services.find((service) => service.countries.some((entry) => entry.code === item.code)) ?? services[0])}>
            <FlagMark code={item.code} accent={item.accent} />
            <span><strong>{item.name}</strong><small>{item.stock} numbers available</small></span>
            <ChevronRight size={17} />
          </button>
        ))}
      </div>
      <div className="country-note"><Globe2 size={17} /><span>New countries are added as inventory arrives. Stock refreshes automatically.</span></div>
    </section>
  );
}

function WalletScreen({
  edit,
  setEdit,
  saved,
  onSave,
  method,
  setMethod,
  done,
  onConfirm,
  onResetWithdraw,
}: {
  edit: WalletEdit;
  setEdit: (value: WalletEdit) => void;
  saved: boolean;
  onSave: () => void;
  method: "trx" | "naira" | null;
  setMethod: (value: "trx" | "naira" | null) => void;
  done: boolean;
  onConfirm: () => void;
  onResetWithdraw: () => void;
}) {
  const [tab, setTab] = useState<"overview" | "withdraw">("overview");
  if (edit) {
    return (
      <section className="screen fade-in">
        <div className="page-title-row"><button className="back-button" onClick={() => setEdit(null)}><ArrowLeft size={18} /></button><div><p className="eyebrow">Wallet settings</p><h1>{edit === "trx" ? "TRX wallet" : "Naira wallet"}</h1></div></div>
        <p className="page-intro">{edit === "trx" ? "Save the address where your USDT TRX earnings should be sent." : "Save your Nigerian bank details for future withdrawals."}</p>
        <div className="form-card">
          {edit === "trx" ? <FormField label="TRX wallet address" value="TX7f••••••••••••••••••••••" placeholder="Paste your TRX address" /> : <><FormField label="Bank name" value="GTBank" placeholder="e.g. GTBank" /><FormField label="Account number" value="0123456789" placeholder="10-digit account number" /><FormField label="Account name" value="Nordan User" placeholder="Name on account" /></>}
          <button className="primary-button full" onClick={onSave}><Check size={17} /> Save details</button>
        </div>
        {saved && <div className="success-toast"><Check size={17} /> Details saved securely</div>}
      </section>
    );
  }
  return (
    <section className="screen fade-in">
      <div className="page-title-row no-back"><div><p className="eyebrow">Money center</p><h1>Your wallet</h1></div><div className="wallet-icon"><WalletCards size={20} /></div></div>
      <div className="wallet-balance"><span>Available now</span><strong>$1.24</strong><small>≈ ₦1,984 at ₦1,600 / $1</small><div className="wallet-balance-footer"><span><ArrowUpRight size={14} /> Earned this month</span><b>+$0.18</b></div></div>
      <div className="wallet-tabs"><button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Payment details</button><button className={tab === "withdraw" ? "active" : ""} onClick={() => setTab("withdraw")}>Withdraw</button></div>
      {tab === "overview" ? <div className="payment-list"><PaymentMethod icon={<span className="mini-logo trx">T</span>} title="TRX wallet" detail="TX7f••••••••••••••••••••••" onEdit={() => setEdit("trx")} /><PaymentMethod icon={<Landmark size={18} />} title="Naira account" detail="GTBank · •••• 6789 · Nordan User" onEdit={() => setEdit("naira")} /></div> : <WithdrawalPanel method={method} setMethod={setMethod} done={done} onConfirm={onConfirm} onReset={onResetWithdraw} />}
      {tab === "overview" && <div className="wallet-history"><div className="section-heading"><div><p className="eyebrow">Ledger</p><h2>Recent rewards</h2></div></div><ActivityRow icon={<BadgeDollarSign size={17} />} color="green" title="WhatsApp OTP reward" detail="Today · 14:08" amount="+$0.005" time="Complete" /><ActivityRow icon={<Gift size={17} />} color="purple" title="Referral bonus" detail="Yesterday" amount="+$0.010" time="Complete" /></div>}
    </section>
  );
}

function FormField({ label, value, placeholder }: { label: string; value: string; placeholder: string }) {
  return <label className="form-field"><span>{label}</span><input defaultValue={value} placeholder={placeholder} /></label>;
}

function PaymentMethod({ icon, title, detail, onEdit }: { icon: ReactNode; title: string; detail: string; onEdit: () => void }) {
  return <div className="payment-method"><span className="payment-icon">{icon}</span><span><strong>{title}</strong><small>{detail}</small></span><button onClick={onEdit}><Pencil size={15} /></button></div>;
}

function WithdrawalPanel({ method, setMethod, done, onConfirm, onReset }: { method: "trx" | "naira" | null; setMethod: (value: "trx" | "naira" | null) => void; done: boolean; onConfirm: () => void; onReset: () => void }) {
  if (done) return <div className="withdraw-success"><span className="success-mark"><Check size={24} /></span><h2>Request submitted</h2><p>Your withdrawal is now with the Nordan team. We’ll notify you when it’s paid.</p><div className="withdraw-receipt"><span>Amount</span><strong>$1.24</strong><span>Method</span><strong>{method === "trx" ? "USDT TRX" : "Naira bank transfer"}</strong></div><button className="secondary-button full" onClick={onReset}>Make another request</button></div>;
  if (!method) return <div className="withdraw-methods"><p className="subtle-copy">Minimum withdrawal is <strong>$0.50</strong>. Select where you’d like to receive your earnings.</p><button className="method-card" onClick={() => setMethod("trx")}><span className="method-logo trx">T</span><span><strong>USDT on TRX</strong><small>Fast crypto transfer · Saved wallet</small></span><ChevronRight size={17} /></button><button className="method-card" onClick={() => setMethod("naira")}><span className="method-logo naira"><Landmark size={18} /></span><span><strong>Naira transfer</strong><small>GTBank · •••• 6789</small></span><ChevronRight size={17} /></button></div>;
  return <div className="withdraw-confirm"><button className="tiny-back" onClick={() => setMethod(null)}><ArrowLeft size={15} /> Change method</button><div className="confirm-amount"><span>You’re withdrawing</span><strong>$1.24</strong><small>{method === "trx" ? "to your USDT TRX wallet" : "to your Naira account"}</small></div><div className="confirm-detail"><span>Destination</span><strong>{method === "trx" ? "TX7f••••••••••••••••••••••" : "GTBank · •••• 6789"}</strong></div><button className="primary-button full" onClick={onConfirm}><ArrowDownToLine size={17} /> Confirm withdrawal</button></div>;
}

function ReferralScreen({ onCopy, copied }: { onCopy: (value: string, key: string) => void; copied: string }) {
  return <section className="screen fade-in"><div className="page-title-row no-back"><div><p className="eyebrow">Grow together</p><h1>Referral circle</h1></div><span className="round-count"><Users size={17} /></span></div><div className="referral-hero"><div className="referral-orbit"><Users size={31} /></div><p>Share the workspace</p><h2>Earn $0.010<br />for every friend.</h2><span>They get a fresh start. You get rewarded when they complete their first OTP.</span></div><div className="referral-link-card"><span className="eyebrow">Your invite link</span><div><code>t.me/Nordansms_bot?start=8XQ2L9A</code><button className={copied === "ref" ? "copied" : ""} onClick={() => onCopy("https://t.me/Nordansms_bot?start=8XQ2L9A", "ref")}>{copied === "ref" ? <Check size={17} /> : <Copy size={17} />}</button></div></div><div className="ref-stats"><div><strong>18</strong><span>Friends joined</span></div><div><strong>$0.18</strong><span>Total earned</span></div><div><strong>3</strong><span>Pending</span></div></div><button className="primary-button full share-button" onClick={() => onCopy("https://t.me/Nordansms_bot?start=8XQ2L9A", "ref")}><Share2 size={17} /> Share invite link</button><div className="how-it-works"><div className="section-heading"><div><p className="eyebrow">Simple steps</p><h2>How it works</h2></div></div><div className="step-row"><b>01</b><span><strong>Share your link</strong><small>Send it to a friend who needs a verification number.</small></span></div><div className="step-row"><b>02</b><span><strong>They verify</strong><small>Your friend completes their first successful OTP.</small></span></div><div className="step-row"><b>03</b><span><strong>You both benefit</strong><small>Your bonus is added to your wallet automatically.</small></span></div></div></section>;
}

export default App;
