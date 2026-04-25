import { useState, useRef, useEffect, useCallback } from "react";
const BACKEND = "https://royal-agent-backend-production.up.railway.app";
const MODES = [
  { id: "dev", icon: "⌨", label: "مطوّر", accent: "#00e5ff", system: "أنت مطور خبير تتقن جميع لغات البرمجة. اكتب كوداً نظيفاً مع شرح. أجب بالعربية مع الكود بالإنجليزية." },
  { id: "res", icon: "◎", label: "باحث", accent: "#ff4df7", system: "أنت باحث متعمق. ابحث وحلل وقدم معلومات دقيقة. أجب بالعربية." },
  { id: "ana", icon: "◈", label: "محلل", accent: "#ffe600", system: "أنت محلل بيانات. حلل الملفات واستخرج الأنماط. أجب بالعربية." },
  { id: "kin", icon: "✦", label: "مستشار", accent: "#ff9500", system: "أنت المستشار الملكي الشخصي. ضع خططاً وساعد في القرارات. أجب بالعربية." }
];
export default function App() {
  const [screen, setScreen] = useState("lock");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [mode, setMode] = useState(MODES[0]);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [web, setWeb] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  useEffect(() => { setMsgs([]); }, [mode]);
  const unlock = async () => {
    try {
      const r = await fetch(BACKEND + "/api/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      const d = await r.json();
      if (d.success) setScreen("main");
      else { setErr("كلمة السر خاطئة ❌"); setPw(""); }
    } catch { setErr("خطأ في الاتصال ⚠️"); }
  };
  const send = useCallback(async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim(); setInput("");
    const h = [...msgs, { role: "user", content: txt }];
    setMsgs(h); setLoading(true);
    try {
      const r = await fetch(BACKEND + "/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw, system: mode.system, useWebSearch: web, messages: h }) });
      const d = await r.json();
      setMsgs(p => [...p, { role: "assistant", content: d.reply || "لا يوجد رد" }]);
    } catch { setMsgs(p => [...p, { role: "assistant", content: "⚠️ خطأ في الاتصال" }]); }
    finally { setLoading(false); }
  }, [input, loading, msgs, mode, pw, web]);
  const ac = mode.accent;
  if (screen === "lock") return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
      <div style={{ width: "320px", border: "1px solid #0f04", background: "#000800", padding: "40px 32px", textAlign: "center" }}>
        <div style={{ fontSize: "10px", color: "#0f0", letterSpacing: "6px", marginBottom: "8px" }}>SECURE ACCESS</div>
        <div style={{ fontSize: "28px", fontWeight: 900, color: "#0f0", fontFamily: "sans-serif", textShadow: "0 0 20px #0f0", marginBottom: "4px" }}>الوكيل الملكي</div>
        <div style={{ fontSize: "10px", color: "#0a0", letterSpacing: "3px", marginBottom: "28px" }}>ROYAL AI AGENT</div>
        {err && <div style={{ color: "#f44", fontSize: "12px", marginBottom: "10px" }}>{err}</div>}
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && unlock()} placeholder="كلمة الدخول" autoFocus style={{ width: "100%", padding: "12px", background: "transparent", border: "1px solid #0f04", color: "#0f0", fontSize: "16px", textAlign: "center", letterSpacing: "6px", marginBottom: "12px", outline: "none", direction: "ltr" }} />
        <button onClick={unlock} style={{ width: "100%", padding: "11px", background: "#0f01", border: "1px solid #0f0", color: "#0f0", cursor: "pointer", letterSpacing: "3px", fontSize: "13px" }}>[ ENTER ]</button>
      </div>
    </div>
  );
  return (
    <div style={{ minHeight: "100vh", background: "#02060c", color: "#c8dff5", fontFamily: "sans-serif", direction: "rtl", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "12px 16px", borderBottom: `1px solid ${ac}22`, background: "#020609", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <div style={{ fontWeight: 900, color: ac, fontSize: "16px" }}>👑 الوكيل الملكي</div>
        <div style={{ display: "flex", gap: "6px", flex: 1, justifyContent: "center", flexWrap: "wrap" }}>
          {MODES.map(m => <button key={m.id} onClick={() => setMode(m)} style={{ padding: "5px 12px", borderRadius: "20px", border: `1px solid ${mode.id === m.id ? m.accent : "#ffffff11"}`, background: mode.id === m.id ? m.accent + "22" : "transparent", color: mode.id === m.id ? m.accent : "#336", fontSize: "12px", cursor: "pointer", fontFamily: "sans-serif" }}>{m.icon} {m.label}</button>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: web ? ac : "#336" }}>🌐</span>
          <div onClick={() => setWeb(v => !v)} style={{ width: "34px", height: "18px", borderRadius: "9px", background: web ? ac + "44" : "#0a1a2a", border: `1px solid ${web ? ac : "#1a3a5a"}`, cursor: "pointer", position: "relative" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: web ? ac : "#1a3a5a", position: "absolute", top: "2px", right: web ? "2px" : "18px", transition: "all .3s" }} />
          </div>
        </div>
        <button onClick={() => setScreen("lock")} style={{ background: "none", border: "1px solid #1a2a3a", color: "#336", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>خروج</button>
      </header>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", maxWidth: "800px", width: "100%", margin: "0 auto" }}>
        {msgs.length === 0 && <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>{mode.icon}</div>
          <div style={{ color: ac, fontSize: "18px", fontWeight: 900 }}>{mode.label} جاهز</div>
          <div style={{ color: "#1a4a6a", fontSize: "13px", marginTop: "6px" }}>اسألني أي شيء</div>
        </div>}
        {msgs.map((m, i) => (
          <div key={i} style={{ marginBottom: "14px", display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: "8px" }}>
            <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: "12px", background: m.role === "user" ? "#080f1a" : "#050c16", border: `1px solid ${m.role === "user" ? "#0d2035" : ac + "22"}`, fontSize: "14px", lineHeight: 1.7, color: m.role === "user" ? "#7ab0d8" : "#9dc8e8", whiteSpace: "pre-wrap" }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", gap: "6px", padding: "10px", justifyContent: "flex-end" }}>
          {[0, .2, .4].map((d, i) => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: ac, animation: `pulse 1.2s ${d}s infinite` }} />)}
        </div>}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "10px 16px 16px", background: "#020609", borderTop: `1px solid ${ac}11` }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", gap: "8px" }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder={`اسأل ${mode.label}...`} rows={1} style={{ flex: 1, padding: "11px 14px", background: "#050c16", border: `1px solid ${input ? ac + "44" : "#0d2035"}`, borderRadius: "12px", color: "#7ab0d8", fontSize: "14px", fontFamily: "sans-serif", resize: "none", minHeight: "42px", outline: "none" }} />
          <button onClick={send} disabled={!input.trim() || loading} style={{ width: "42px", height: "42px", borderRadius: "12px", border: "none", background: input.trim() && !loading ? ac : "#0a1a2a", color: input.trim() && !loading ? "#000" : "#1a3a5a", fontSize: "18px", fontWeight: 900, cursor: "pointer" }}>↑</button>
        </div>
      </div>
    </div>
  );
}
