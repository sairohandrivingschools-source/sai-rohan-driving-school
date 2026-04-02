import { useState, useEffect, useCallback } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  deleteDoc, setDoc, serverTimestamp, writeBatch,
} from "firebase/firestore";

// ─── Admin Color Palette ──────────────────────────────────────────────────────
const A = {
  sidebar: "#0f172a", sidebarHover: "#1e293b", sidebarActive: "#2196F3",
  bg: "#f1f5f9", card: "#ffffff", pri: "#2196F3", priDark: "#1976D2",
  text: "#0f172a", sub: "#64748b", border: "#e2e8f0",
  danger: "#ef4444", success: "#22c55e", warn: "#f59e0b",
};

// ─── Default seed data ────────────────────────────────────────────────────────
const SEED_COURSES = [
  { name: "Basic", duration: "30 Days", sessions: "30 Sessions", features: ["Steering & gear basics", "City road practice", "Parking training", "Traffic rules", "License guidance"], tag: "", price: "", priceNote: "", priceHidden: false, hidden: false, order: 1 },
  { name: "Intermediate", duration: "45 Days", sessions: "45 Sessions", features: ["Everything in Basic", "Highway driving", "Night driving basics", "Defensive driving", "RTO test preparation", "License assistance"], tag: "POPULAR", price: "", priceNote: "", priceHidden: false, hidden: false, order: 2 },
  { name: "Advance", duration: "60 Days", sessions: "60 Sessions", features: ["Everything in Intermediate", "Advanced highway skills", "Hill & slope practice", "All weather driving", "Confidence building", "Guaranteed license support", "Lifetime refresher sessions"], tag: "BEST VALUE", price: "", priceNote: "", priceHidden: false, hidden: false, order: 3 },
];
const SEED_REVIEWS = [
  { name: "Priya Reddy", text: "Excellent training! Got my license in first attempt. Very patient instructors.", rating: 5, hidden: false, order: 1 },
  { name: "Karthik M.", text: "Best driving school in Boduppal. The trainers are very friendly and professional.", rating: 5, hidden: false, order: 2 },
  { name: "Lakshmi D.", text: "My daughter learned here. Very safe dual-control cars. Highly recommend!", rating: 5, hidden: false, order: 3 },
  { name: "Rahul Kumar", text: "Affordable pricing and great training. Learned to drive in just 30 days.", rating: 5, hidden: false, order: 4 },
  { name: "Sneha P.", text: "Flexible timings suited my college schedule. Instructors are very experienced.", rating: 4, hidden: false, order: 5 },
  { name: "Venkat Rao", text: "Very good driving school. They helped with RTO process also. Smooth experience.", rating: 5, hidden: false, order: 6 },
  { name: "Anjali S.", text: "I was very scared of driving initially. The trainer made me comfortable. Thank you!", rating: 5, hidden: false, order: 7 },
  { name: "Manoj T.", text: "Completed advanced course. Now driving on highways confidently. Worth every rupee.", rating: 5, hidden: false, order: 8 },
];
const SEED_GALLERY = [
  { url: "https://images.unsplash.com/photo-1449965408869-ebd13bc9e5c8?w=400&h=300&fit=crop", caption: "Training Session", hidden: false, order: 1 },
  { url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop", caption: "Our Training Car", hidden: false, order: 2 },
  { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop", caption: "Road Practice", hidden: false, order: 3 },
  { url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop", caption: "Student Practice", hidden: false, order: 4 },
  { url: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=300&fit=crop", caption: "Highway Training", hidden: false, order: 5 },
  { url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop", caption: "Certified Students", hidden: false, order: 6 },
];
const SEED_WHYS = [
  { icon: "🏆", title: "Experienced Trainers", desc: "Certified instructors with years of real road training experience.", order: 1 },
  { icon: "🚗", title: "Dual-Control Cars", desc: "Instructor-side brakes for complete safety during every practice session.", order: 2 },
  { icon: "📋", title: "RTO License Help", desc: "Full guidance for Learning License & Permanent License — we handle the process.", order: 3 },
  { icon: "⏰", title: "Flexible Timings", desc: "Morning, afternoon & evening batches. Choose what fits your schedule.", order: 4 },
  { icon: "🛣️", title: "Real Road Training", desc: "Practice in actual Hyderabad traffic, not just on empty grounds.", order: 5 },
  { icon: "💰", title: "Affordable Fees", desc: "Best rates in Boduppal area. No hidden charges. EMI available.", order: 6 },
];
const SEED_FAQS = [
  { q: "What age do I need to be to learn driving?", a: "You must be 18 years or older for a car license (LMV). For gearless two-wheelers, minimum age is 16 with guardian consent.", hidden: false, order: 1 },
  { q: "Do you help with the RTO license process?", a: "Yes! We guide you through the entire process — from Learning License application to Permanent License test.", hidden: false, order: 2 },
  { q: "Can I choose my training timings?", a: "Absolutely. We offer morning (6-9 AM), afternoon (12-3 PM), and evening (4-7 PM) batches.", hidden: false, order: 3 },
  { q: "What type of cars do you use?", a: "We use dual-control Maruti cars with instructor-side brake and clutch for your complete safety.", hidden: false, order: 4 },
  { q: "What if I need extra classes?", a: "Additional sessions are available at discounted rates for enrolled students.", hidden: false, order: 5 },
  { q: "Where is your driving school located?", a: "9-10, beside Akruti Township, Tulip Block, West Hanuman Nagar, Boduppal, Hyderabad, Telangana 500092.", hidden: false, order: 6 },
];

// ─── Shared UI Components ─────────────────────────────────────────────────────
function Btn({ children, onClick, danger, outline, sm, style = {}, disabled }) {
  return (
    <button disabled={disabled} onClick={onClick} style={{
      padding: sm ? "6px 12px" : "10px 18px", borderRadius: "8px", fontWeight: 600,
      fontSize: sm ? "12px" : "13px", cursor: disabled ? "not-allowed" : "pointer",
      border: outline ? `1.5px solid ${danger ? A.danger : A.pri}` : "none",
      background: disabled ? "#e2e8f0" : danger ? A.danger : outline ? "transparent" : A.pri,
      color: disabled ? A.sub : danger ? "#fff" : outline ? (danger ? A.danger : A.pri) : "#fff",
      transition: "all 0.2s", opacity: disabled ? 0.7 : 1, ...style,
    }}>{children}</button>
  );
}

function FInput({ label, value, onChange, type = "text", placeholder = "", required }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      {label && <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: A.sub, marginBottom: "5px", letterSpacing: "0.5px" }}>{label}{required && " *"}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 13px", borderRadius: "8px", border: `1.5px solid ${A.border}`, fontSize: "14px", outline: "none", color: A.text, fontFamily: "inherit", background: "#fff" }} />
    </div>
  );
}

function FTextarea({ label, value, onChange, rows = 3, placeholder = "" }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      {label && <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: A.sub, marginBottom: "5px", letterSpacing: "0.5px" }}>{label}</label>}
      <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 13px", borderRadius: "8px", border: `1.5px solid ${A.border}`, fontSize: "14px", outline: "none", resize: "vertical", color: A.text, fontFamily: "inherit" }} />
    </div>
  );
}

function FSelect({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      {label && <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: A.sub, marginBottom: "5px", letterSpacing: "0.5px" }}>{label}</label>}
      <select value={value} onChange={onChange}
        style={{ width: "100%", padding: "10px 13px", borderRadius: "8px", border: `1.5px solid ${A.border}`, fontSize: "14px", outline: "none", color: A.text, fontFamily: "inherit", background: "#fff" }}>
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", cursor: "pointer" }} onClick={onChange}>
      <div style={{ width: "42px", height: "24px", borderRadius: "12px", background: checked ? A.pri : "#cbd5e1", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: "2px", left: checked ? "20px" : "2px", width: "20px", height: "20px", borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
      </div>
      <span style={{ fontSize: "14px", color: A.text, userSelect: "none" }}>{label}</span>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: `1px solid ${A.border}` }}>
      <h2 style={{ fontSize: "20px", fontWeight: 800, color: A.text }}>{title}</h2>
      {subtitle && <p style={{ color: A.sub, fontSize: "13px", marginTop: "4px" }}>{subtitle}</p>}
    </div>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: A.card, borderRadius: "12px", padding: "20px", border: `1px solid ${A.border}`, ...style }}>{children}</div>;
}

function StatusBadge({ hidden }) {
  return (
    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, background: hidden ? "#fee2e2" : "#dcfce7", color: hidden ? A.danger : A.success }}>
      {hidden ? "Hidden" : "Visible"}
    </span>
  );
}

function EmptyState({ message, onSeed, seedLabel }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: A.sub }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
      <p style={{ fontSize: "15px", marginBottom: "20px" }}>{message}</p>
      {onSeed && <Btn onClick={onSeed}>{seedLabel || "Load Default Data"}</Btn>}
    </div>
  );
}

// ─── Helper: seed a collection ────────────────────────────────────────────────
async function seedCollection(name, items) {
  const batch = writeBatch(db);
  items.forEach((item) => {
    batch.set(doc(collection(db, name)), item);
  });
  await batch.commit();
}

// ─── COURSES SECTION ──────────────────────────────────────────────────────────
function CoursesSection({ toast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // list | form
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const blank = { name: "", duration: "", sessions: "", featuresText: "", tag: "", price: "", priceNote: "", priceHidden: false, hidden: false };
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "courses"));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order || 0) - (b.order || 0)));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(blank); setEditId(null); setView("form"); };
  const openEdit = (item) => {
    setForm({ name: item.name || "", duration: item.duration || "", sessions: item.sessions || "", featuresText: (item.features || []).join("\n"), tag: item.tag || "", price: item.price || "", priceNote: item.priceNote || "", priceHidden: !!item.priceHidden, hidden: !!item.hidden });
    setEditId(item.id); setView("form");
  };

  const save = async () => {
    if (!form.name.trim()) { alert("Course name is required"); return; }
    setSaving(true);
    const data = { name: form.name, duration: form.duration, sessions: form.sessions, features: form.featuresText.split("\n").map((f) => f.trim()).filter(Boolean), tag: form.tag, price: form.price, priceNote: form.priceNote, priceHidden: form.priceHidden, hidden: form.hidden };
    try {
      if (editId) { await updateDoc(doc(db, "courses", editId), data); }
      else { await addDoc(collection(db, "courses"), { ...data, order: Date.now() }); }
      toast("Course saved successfully!");
      await load(); setView("list");
    } catch (e) { toast("Error: " + e.message, "error"); }
    setSaving(false);
  };

  const toggle = async (item) => { await updateDoc(doc(db, "courses", item.id), { hidden: !item.hidden }); await load(); };
  const remove = async (id) => { if (!confirm("Delete this course?")) return; await deleteDoc(doc(db, "courses", id)); await load(); toast("Deleted."); };
  const seed = async () => { if (!confirm("Add default courses?")) return; await seedCollection("courses", SEED_COURSES); await load(); toast("Default courses loaded!"); };

  if (view === "form") {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button onClick={() => setView("list")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: A.sub }}>←</button>
          <SectionTitle title={editId ? "Edit Course" : "Add New Course"} />
        </div>
        <Card style={{ maxWidth: "620px" }}>
          <FInput label="COURSE NAME" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Basic" required />
          <div className="admin-grid-2">
            <FInput label="DURATION" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="30 Days" />
            <FInput label="SESSIONS" value={form.sessions} onChange={(e) => setForm({ ...form, sessions: e.target.value })} placeholder="30 Sessions" />
          </div>
          <div className="admin-grid-2">
            <FInput label="PRICE (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 3500" />
            <FInput label="PRICE NOTE" value={form.priceNote} onChange={(e) => setForm({ ...form, priceNote: e.target.value })} placeholder="e.g. all inclusive" />
          </div>
          <FSelect label="BADGE TAG" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
            options={[{ value: "", label: "None" }, { value: "POPULAR", label: "POPULAR" }, { value: "BEST VALUE", label: "BEST VALUE" }]} />
          <FTextarea label="FEATURES (one per line)" value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} rows={6} placeholder={"Steering & gear basics\nCity road practice\nParking training"} />
          <Toggle label="Hide price from website" checked={form.priceHidden} onChange={() => setForm({ ...form, priceHidden: !form.priceHidden })} />
          <Toggle label="Hide this course from website" checked={form.hidden} onChange={() => setForm({ ...form, hidden: !form.hidden })} />
          <div style={{ display: "flex", gap: "10px" }}>
            <Btn onClick={save} disabled={saving} style={{ flex: 1 }}>{saving ? "Saving..." : "Save Course"}</Btn>
            <Btn onClick={() => setView("list")} outline>Cancel</Btn>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <SectionTitle title="Courses" subtitle={`${items.length} course${items.length !== 1 ? "s" : ""} · Manage pricing, visibility, and features`} />
        <div style={{ display: "flex", gap: "8px" }}>
          {items.length === 0 && <Btn outline onClick={seed}>Load Defaults</Btn>}
          <Btn onClick={openNew}>+ Add Course</Btn>
        </div>
      </div>
      {loading ? <p style={{ color: A.sub }}>Loading...</p> : items.length === 0 ? (
        <EmptyState message="No courses yet." onSeed={seed} seedLabel="Load Default Courses" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {items.map((c) => (
            <Card key={c.id} style={{ display: "flex", alignItems: "center", gap: "16px", opacity: c.hidden ? 0.6 : 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: "15px", color: A.text }}>{c.name}</span>
                  {c.tag && <span style={{ background: A.pri, color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px" }}>{c.tag}</span>}
                  <StatusBadge hidden={c.hidden} />
                </div>
                <div style={{ fontSize: "13px", color: A.sub }}>
                  {c.duration} · {c.sessions}
                  {c.price ? (c.priceHidden ? " · ₹ (price hidden)" : ` · ₹${c.price}${c.priceNote ? ` ${c.priceNote}` : ""}`) : " · No price set"}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "3px" }}>{(c.features || []).length} features</div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <Btn sm outline onClick={() => toggle(c)}>{c.hidden ? "👁 Show" : "🙈 Hide"}</Btn>
                <Btn sm outline onClick={() => openEdit(c)}>✏️ Edit</Btn>
                <Btn sm danger onClick={() => remove(c.id)}>🗑</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── REVIEWS SECTION ──────────────────────────────────────────────────────────
function ReviewsSection({ toast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const blank = { name: "", text: "", rating: "5", hidden: false };
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "reviews"));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order || 0) - (b.order || 0)));
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(blank); setEditId(null); setView("form"); };
  const openEdit = (item) => { setForm({ name: item.name || "", text: item.text || "", rating: String(item.rating || 5), hidden: !!item.hidden }); setEditId(item.id); setView("form"); };

  const save = async () => {
    if (!form.name.trim() || !form.text.trim()) { alert("Name and review text are required"); return; }
    setSaving(true);
    const data = { name: form.name, text: form.text, rating: Number(form.rating), hidden: form.hidden };
    try {
      if (editId) { await updateDoc(doc(db, "reviews", editId), data); }
      else { await addDoc(collection(db, "reviews"), { ...data, order: Date.now() }); }
      toast("Review saved!"); await load(); setView("list");
    } catch (e) { toast("Error: " + e.message, "error"); }
    setSaving(false);
  };

  const toggle = async (item) => { await updateDoc(doc(db, "reviews", item.id), { hidden: !item.hidden }); await load(); };
  const remove = async (id) => { if (!confirm("Delete this review?")) return; await deleteDoc(doc(db, "reviews", id)); await load(); toast("Deleted."); };
  const seed = async () => { if (!confirm("Add default reviews?")) return; await seedCollection("reviews", SEED_REVIEWS); await load(); toast("Default reviews loaded!"); };

  if (view === "form") {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button onClick={() => setView("list")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: A.sub }}>←</button>
          <SectionTitle title={editId ? "Edit Review" : "Add Review"} />
        </div>
        <Card style={{ maxWidth: "560px" }}>
          <FInput label="STUDENT NAME" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Reddy" required />
          <FTextarea label="REVIEW TEXT" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} placeholder="Write the review..." />
          <FSelect label="STAR RATING" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}
            options={[{ value: "5", label: "⭐⭐⭐⭐⭐ (5 stars)" }, { value: "4", label: "⭐⭐⭐⭐ (4 stars)" }, { value: "3", label: "⭐⭐⭐ (3 stars)" }]} />
          <Toggle label="Hide this review from website" checked={form.hidden} onChange={() => setForm({ ...form, hidden: !form.hidden })} />
          <div style={{ display: "flex", gap: "10px" }}>
            <Btn onClick={save} disabled={saving} style={{ flex: 1 }}>{saving ? "Saving..." : "Save Review"}</Btn>
            <Btn onClick={() => setView("list")} outline>Cancel</Btn>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <SectionTitle title="Reviews" subtitle={`${items.length} review${items.length !== 1 ? "s" : ""}`} />
        <div style={{ display: "flex", gap: "8px" }}>
          {items.length === 0 && <Btn outline onClick={seed}>Load Defaults</Btn>}
          <Btn onClick={openNew}>+ Add Review</Btn>
        </div>
      </div>
      {loading ? <p style={{ color: A.sub }}>Loading...</p> : items.length === 0 ? (
        <EmptyState message="No reviews yet." onSeed={seed} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {items.map((r) => (
            <Card key={r.id} style={{ display: "flex", alignItems: "flex-start", gap: "16px", opacity: r.hidden ? 0.6 : 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 700, color: A.text }}>{r.name}</span>
                  <span style={{ color: "#f59e0b", fontSize: "13px" }}>{"★".repeat(r.rating || 5)}</span>
                  <StatusBadge hidden={r.hidden} />
                </div>
                <p style={{ fontSize: "13px", color: A.sub, lineHeight: 1.6 }}>"{r.text}"</p>
              </div>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <Btn sm outline onClick={() => toggle(r)}>{r.hidden ? "👁 Show" : "🙈 Hide"}</Btn>
                <Btn sm outline onClick={() => openEdit(r)}>✏️</Btn>
                <Btn sm danger onClick={() => remove(r.id)}>🗑</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── GALLERY SECTION ──────────────────────────────────────────────────────────
function GallerySection({ toast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const blank = { url: "", caption: "", hidden: false };
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "gallery"));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order || 0) - (b.order || 0)));
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(blank); setEditId(null); setView("form"); };
  const openEdit = (item) => { setForm({ url: item.url || "", caption: item.caption || "", hidden: !!item.hidden }); setEditId(item.id); setView("form"); };

  const save = async () => {
    if (!form.url.trim()) { alert("Image URL is required"); return; }
    setSaving(true);
    const data = { url: form.url, caption: form.caption, hidden: form.hidden };
    try {
      if (editId) { await updateDoc(doc(db, "gallery", editId), data); }
      else { await addDoc(collection(db, "gallery"), { ...data, order: Date.now() }); }
      toast("Photo saved!"); await load(); setView("list");
    } catch (e) { toast("Error: " + e.message, "error"); }
    setSaving(false);
  };

  const toggle = async (item) => { await updateDoc(doc(db, "gallery", item.id), { hidden: !item.hidden }); await load(); };
  const remove = async (id) => { if (!confirm("Delete this photo?")) return; await deleteDoc(doc(db, "gallery", id)); await load(); toast("Deleted."); };
  const seed = async () => { if (!confirm("Add default gallery photos?")) return; await seedCollection("gallery", SEED_GALLERY); await load(); toast("Gallery loaded!"); };

  if (view === "form") {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button onClick={() => setView("list")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: A.sub }}>←</button>
          <SectionTitle title={editId ? "Edit Photo" : "Add Photo"} />
        </div>
        <Card style={{ maxWidth: "560px" }}>
          <FInput label="IMAGE URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://example.com/photo.jpg" required />
          {form.url && (
            <div style={{ marginBottom: "14px" }}>
              <img src={form.url} alt="preview" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", border: `1px solid ${A.border}` }}
                onError={(e) => { e.target.style.display = "none"; }} />
            </div>
          )}
          <FInput label="CAPTION" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} placeholder="e.g. Training Session" />
          <Toggle label="Hide from website" checked={form.hidden} onChange={() => setForm({ ...form, hidden: !form.hidden })} />
          <div style={{ display: "flex", gap: "10px" }}>
            <Btn onClick={save} disabled={saving} style={{ flex: 1 }}>{saving ? "Saving..." : "Save Photo"}</Btn>
            <Btn onClick={() => setView("list")} outline>Cancel</Btn>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <SectionTitle title="Gallery" subtitle={`${items.length} photo${items.length !== 1 ? "s" : ""}`} />
        <div style={{ display: "flex", gap: "8px" }}>
          {items.length === 0 && <Btn outline onClick={seed}>Load Defaults</Btn>}
          <Btn onClick={openNew}>+ Add Photo</Btn>
        </div>
      </div>
      {loading ? <p style={{ color: A.sub }}>Loading...</p> : items.length === 0 ? (
        <EmptyState message="No photos yet." onSeed={seed} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
          {items.map((p) => (
            <Card key={p.id} style={{ padding: "0", overflow: "hidden", opacity: p.hidden ? 0.5 : 1 }}>
              <img src={p.url} alt={p.caption} style={{ width: "100%", height: "150px", objectFit: "cover", display: "block" }}
                onError={(e) => { e.target.style.background = "#e2e8f0"; e.target.style.height = "80px"; }} />
              <div style={{ padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: A.text }}>{p.caption || "No caption"}</span>
                  <StatusBadge hidden={p.hidden} />
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <Btn sm outline onClick={() => toggle(p)} style={{ flex: 1 }}>{p.hidden ? "👁 Show" : "🙈 Hide"}</Btn>
                  <Btn sm outline onClick={() => openEdit(p)}>✏️</Btn>
                  <Btn sm danger onClick={() => remove(p.id)}>🗑</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── WHY US SECTION ───────────────────────────────────────────────────────────
function WhysSection({ toast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const blank = { icon: "", title: "", desc: "" };
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "whys"));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order || 0) - (b.order || 0)));
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(blank); setEditId(null); setView("form"); };
  const openEdit = (item) => { setForm({ icon: item.icon || "", title: item.title || "", desc: item.desc || "" }); setEditId(item.id); setView("form"); };

  const save = async () => {
    if (!form.title.trim()) { alert("Title is required"); return; }
    setSaving(true);
    try {
      if (editId) { await updateDoc(doc(db, "whys", editId), form); }
      else { await addDoc(collection(db, "whys"), { ...form, order: Date.now() }); }
      toast("Saved!"); await load(); setView("list");
    } catch (e) { toast("Error: " + e.message, "error"); }
    setSaving(false);
  };

  const remove = async (id) => { if (!confirm("Delete?")) return; await deleteDoc(doc(db, "whys", id)); await load(); };
  const seed = async () => { if (!confirm("Load default 'Why Us' cards?")) return; await seedCollection("whys", SEED_WHYS); await load(); toast("Loaded!"); };

  if (view === "form") {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button onClick={() => setView("list")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: A.sub }}>←</button>
          <SectionTitle title={editId ? "Edit Card" : "Add Card"} />
        </div>
        <Card style={{ maxWidth: "500px" }}>
          <FInput label="ICON (emoji)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🏆" />
          <FInput label="TITLE" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Experienced Trainers" required />
          <FTextarea label="DESCRIPTION" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} placeholder="Short description..." />
          <div style={{ display: "flex", gap: "10px" }}>
            <Btn onClick={save} disabled={saving} style={{ flex: 1 }}>{saving ? "Saving..." : "Save"}</Btn>
            <Btn onClick={() => setView("list")} outline>Cancel</Btn>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <SectionTitle title="Why Us" subtitle="The 6 benefit cards shown on the website" />
        <div style={{ display: "flex", gap: "8px" }}>
          {items.length === 0 && <Btn outline onClick={seed}>Load Defaults</Btn>}
          <Btn onClick={openNew}>+ Add Card</Btn>
        </div>
      </div>
      {loading ? <p style={{ color: A.sub }}>Loading...</p> : items.length === 0 ? (
        <EmptyState message="No cards yet." onSeed={seed} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
          {items.map((w) => (
            <Card key={w.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "28px" }}>{w.icon}</span>
                <div style={{ display: "flex", gap: "4px" }}>
                  <Btn sm outline onClick={() => openEdit(w)}>✏️</Btn>
                  <Btn sm danger onClick={() => remove(w.id)}>🗑</Btn>
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: "14px", color: A.text, marginBottom: "4px" }}>{w.title}</div>
              <div style={{ fontSize: "12px", color: A.sub, lineHeight: 1.6 }}>{w.desc}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FAQS SECTION ─────────────────────────────────────────────────────────────
function FAQsSection({ toast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const blank = { q: "", a: "", hidden: false };
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "faqs"));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order || 0) - (b.order || 0)));
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setForm(blank); setEditId(null); setView("form"); };
  const openEdit = (item) => { setForm({ q: item.q || "", a: item.a || "", hidden: !!item.hidden }); setEditId(item.id); setView("form"); };

  const save = async () => {
    if (!form.q.trim() || !form.a.trim()) { alert("Question and answer are required"); return; }
    setSaving(true);
    try {
      if (editId) { await updateDoc(doc(db, "faqs", editId), form); }
      else { await addDoc(collection(db, "faqs"), { ...form, order: Date.now() }); }
      toast("FAQ saved!"); await load(); setView("list");
    } catch (e) { toast("Error: " + e.message, "error"); }
    setSaving(false);
  };

  const toggle = async (item) => { await updateDoc(doc(db, "faqs", item.id), { hidden: !item.hidden }); await load(); };
  const remove = async (id) => { if (!confirm("Delete this FAQ?")) return; await deleteDoc(doc(db, "faqs", id)); await load(); };
  const seed = async () => { if (!confirm("Load default FAQs?")) return; await seedCollection("faqs", SEED_FAQS); await load(); toast("FAQs loaded!"); };

  if (view === "form") {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button onClick={() => setView("list")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: A.sub }}>←</button>
          <SectionTitle title={editId ? "Edit FAQ" : "Add FAQ"} />
        </div>
        <Card style={{ maxWidth: "600px" }}>
          <FInput label="QUESTION" value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} placeholder="What age do I need to be?" required />
          <FTextarea label="ANSWER" value={form.a} onChange={(e) => setForm({ ...form, a: e.target.value })} rows={4} placeholder="Write the answer..." />
          <Toggle label="Hide from website" checked={form.hidden} onChange={() => setForm({ ...form, hidden: !form.hidden })} />
          <div style={{ display: "flex", gap: "10px" }}>
            <Btn onClick={save} disabled={saving} style={{ flex: 1 }}>{saving ? "Saving..." : "Save FAQ"}</Btn>
            <Btn onClick={() => setView("list")} outline>Cancel</Btn>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <SectionTitle title="FAQs" subtitle={`${items.length} FAQ${items.length !== 1 ? "s" : ""}`} />
        <div style={{ display: "flex", gap: "8px" }}>
          {items.length === 0 && <Btn outline onClick={seed}>Load Defaults</Btn>}
          <Btn onClick={openNew}>+ Add FAQ</Btn>
        </div>
      </div>
      {loading ? <p style={{ color: A.sub }}>Loading...</p> : items.length === 0 ? (
        <EmptyState message="No FAQs yet." onSeed={seed} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((f) => (
            <Card key={f.id} style={{ display: "flex", gap: "16px", alignItems: "flex-start", opacity: f.hidden ? 0.6 : 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: A.text }}>{f.q}</span>
                  <StatusBadge hidden={f.hidden} />
                </div>
                <p style={{ fontSize: "13px", color: A.sub }}>{f.a}</p>
              </div>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <Btn sm outline onClick={() => toggle(f)}>{f.hidden ? "👁" : "🙈"}</Btn>
                <Btn sm outline onClick={() => openEdit(f)}>✏️</Btn>
                <Btn sm danger onClick={() => remove(f.id)}>🗑</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection({ toast }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ badge: "", headline1: "", headline2: "", subtext: "", statStudents: "", statStudentsLabel: "", statRating: "", statRatingLabel: "", statPass: "", statPassLabel: "", since: "" });

  useEffect(() => {
    getDoc(doc(db, "settings", "hero")).then((snap) => {
      if (snap.exists()) setForm((p) => ({ ...p, ...snap.data() }));
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try { await setDoc(doc(db, "settings", "hero"), form, { merge: true }); toast("Hero section saved!"); }
    catch (e) { toast("Error: " + e.message, "error"); }
    setSaving(false);
  };

  return (
    <div>
      <SectionTitle title="Hero Section" subtitle="Edit the main banner at the top of the website" />
      <Card style={{ maxWidth: "640px" }}>
        <FInput label="BADGE TEXT" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="🚗 Boduppal, Hyderabad" />
        <div className="admin-grid-2">
          <FInput label="HEADLINE LINE 1" value={form.headline1} onChange={(e) => setForm({ ...form, headline1: e.target.value })} placeholder="Learn to Drive" />
          <FInput label="HEADLINE LINE 2 (colored)" value={form.headline2} onChange={(e) => setForm({ ...form, headline2: e.target.value })} placeholder="with Confidence" />
        </div>
        <FTextarea label="SUBTEXT" value={form.subtext} onChange={(e) => setForm({ ...form, subtext: e.target.value })} rows={3} placeholder="Complete 4-wheeler driving training..." />
        <p style={{ fontSize: "12px", fontWeight: 700, color: A.sub, marginBottom: "10px", letterSpacing: "0.5px" }}>STATS</p>
        <div className="admin-grid-3" style={{ marginBottom: "14px" }}>
          <FInput label="Students Value" value={form.statStudents} onChange={(e) => setForm({ ...form, statStudents: e.target.value })} placeholder="1000+" />
          <FInput label="Rating Value" value={form.statRating} onChange={(e) => setForm({ ...form, statRating: e.target.value })} placeholder="4.8 ★" />
          <FInput label="Pass Rate Value" value={form.statPass} onChange={(e) => setForm({ ...form, statPass: e.target.value })} placeholder="98%" />
        </div>
        <div className="admin-grid-3" style={{ marginBottom: "14px" }}>
          <FInput label="Students Label" value={form.statStudentsLabel} onChange={(e) => setForm({ ...form, statStudentsLabel: e.target.value })} placeholder="Students Trained" />
          <FInput label="Rating Label" value={form.statRatingLabel} onChange={(e) => setForm({ ...form, statRatingLabel: e.target.value })} placeholder="Google Rating" />
          <FInput label="Pass Label" value={form.statPassLabel} onChange={(e) => setForm({ ...form, statPassLabel: e.target.value })} placeholder="Pass Rate" />
        </div>
        <FInput label="ESTABLISHED YEAR" value={form.since} onChange={(e) => setForm({ ...form, since: e.target.value })} placeholder="2015" />
        <Btn onClick={save} disabled={saving} style={{ width: "100%" }}>{saving ? "Saving..." : "Save Hero Section"}</Btn>
      </Card>
    </div>
  );
}

// ─── CONTACT SECTION ──────────────────────────────────────────────────────────
function ContactSection({ toast }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ phone1: "", phone2: "", whatsapp: "", address: "", mapsLink: "", instagram: "" });

  useEffect(() => {
    getDoc(doc(db, "settings", "contact")).then((snap) => {
      if (snap.exists()) setForm((p) => ({ ...p, ...snap.data() }));
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try { await setDoc(doc(db, "settings", "contact"), form, { merge: true }); toast("Contact info saved!"); }
    catch (e) { toast("Error: " + e.message, "error"); }
    setSaving(false);
  };

  return (
    <div>
      <SectionTitle title="Contact Info" subtitle="Update phone numbers, address and links shown on the website" />
      <Card style={{ maxWidth: "580px" }}>
        <div className="admin-grid-2">
          <FInput label="PHONE 1" value={form.phone1} onChange={(e) => setForm({ ...form, phone1: e.target.value })} placeholder="9133999282" />
          <FInput label="PHONE 2" value={form.phone2} onChange={(e) => setForm({ ...form, phone2: e.target.value })} placeholder="9866902354" />
        </div>
        <FInput label="WHATSAPP NUMBER (with country code, no +)" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="919133999282" />
        <FTextarea label="ADDRESS" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} placeholder={"9-10, beside Akruti Township, Tulip Block,\nWest Hanuman Nagar, Boduppal,\nHyderabad, Telangana 500092"} />
        <FInput label="GOOGLE MAPS LINK" value={form.mapsLink} onChange={(e) => setForm({ ...form, mapsLink: e.target.value })} placeholder="https://maps.app.goo.gl/..." />
        <FInput label="INSTAGRAM HANDLE" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@sairohandrivingschool" />
        <Btn onClick={save} disabled={saving} style={{ width: "100%" }}>{saving ? "Saving..." : "Save Contact Info"}</Btn>
      </Card>
    </div>
  );
}

// ─── SEO SECTION ──────────────────────────────────────────────────────────────
function SEOSection({ toast }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", keywords: "", ogImage: "" });

  useEffect(() => {
    getDoc(doc(db, "settings", "seo")).then((snap) => {
      if (snap.exists()) setForm((p) => ({ ...p, ...snap.data() }));
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try { await setDoc(doc(db, "settings", "seo"), form, { merge: true }); toast("SEO settings saved!"); }
    catch (e) { toast("Error: " + e.message, "error"); }
    setSaving(false);
  };

  return (
    <div>
      <SectionTitle title="SEO Settings" subtitle="Control how your website appears in Google search results and link previews" />
      <Card style={{ maxWidth: "640px" }}>
        <FInput label="PAGE TITLE (shown in browser tab & Google)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sai Rohan Driving School | Best Driving Classes in Boduppal" />
        {form.title && (
          <div style={{ background: "#f8faff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px 14px", marginBottom: "14px", fontSize: "12px" }}>
            <div style={{ color: "#1a0dab", fontWeight: 600, marginBottom: "2px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{form.title}</div>
            <div style={{ color: "#006621", marginBottom: "2px" }}>www.sairohandrivingschool.com</div>
            <div style={{ color: "#545454", lineHeight: 1.5 }}>{form.description || "Add a meta description below..."}</div>
          </div>
        )}
        <FTextarea label="META DESCRIPTION (appears in Google results, max 160 chars)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Sai Rohan Motor Driving School in Boduppal, Hyderabad. Certified instructors, 1000+ students trained..." />
        {form.description && <p style={{ fontSize: "11px", color: form.description.length > 160 ? A.danger : A.success, marginTop: "-10px", marginBottom: "14px" }}>{form.description.length}/160 characters</p>}
        <FInput label="KEYWORDS (comma separated)" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="driving school boduppal, driving classes hyderabad, sai rohan" />
        <FInput label="OG IMAGE URL (used for WhatsApp/Facebook link preview, 1200×630)" value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} placeholder="https://www.sairohandrivingschool.com/og-image.jpg" />
        {form.ogImage && (
          <div style={{ marginBottom: "14px" }}>
            <img src={form.ogImage} alt="OG preview" style={{ width: "100%", maxHeight: "160px", objectFit: "cover", borderRadius: "8px", border: `1px solid ${A.border}` }}
              onError={(e) => { e.target.style.display = "none"; }} />
          </div>
        )}
        <Btn onClick={save} disabled={saving} style={{ width: "100%" }}>{saving ? "Saving..." : "Save SEO Settings"}</Btn>
      </Card>
    </div>
  );
}

// ─── ANNOUNCEMENT SECTION ─────────────────────────────────────────────────────
function AnnouncementSection({ toast }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ text: "", enabled: false, bgColor: "#2196F3" });

  useEffect(() => {
    getDoc(doc(db, "settings", "announcement")).then((snap) => {
      if (snap.exists()) setForm((p) => ({ ...p, ...snap.data() }));
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try { await setDoc(doc(db, "settings", "announcement"), form, { merge: true }); toast("Announcement saved!"); }
    catch (e) { toast("Error: " + e.message, "error"); }
    setSaving(false);
  };

  const COLOR_OPTS = [
    { value: "#2196F3", label: "🔵 Blue" }, { value: "#22c55e", label: "🟢 Green" },
    { value: "#f59e0b", label: "🟡 Amber" }, { value: "#ef4444", label: "🔴 Red" },
    { value: "#8b5cf6", label: "🟣 Purple" }, { value: "#0f172a", label: "⚫ Dark" },
  ];

  return (
    <div>
      <SectionTitle title="Announcement Banner" subtitle="Show a notice banner at the top of the website (e.g. special offers, holidays)" />
      <Card style={{ maxWidth: "560px" }}>
        <Toggle label="Show announcement banner on website" checked={form.enabled} onChange={() => setForm({ ...form, enabled: !form.enabled })} />
        <FTextarea label="BANNER TEXT" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={2} placeholder="🎉 Special offer this month! Call now: 9133 999 282" />
        <FSelect label="BANNER COLOR" value={form.bgColor} onChange={(e) => setForm({ ...form, bgColor: e.target.value })} options={COLOR_OPTS} />
        {form.text && (
          <div style={{ background: form.bgColor, color: "#fff", textAlign: "center", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, marginBottom: "14px" }}>
            {form.text}
          </div>
        )}
        <Btn onClick={save} disabled={saving} style={{ width: "100%" }}>{saving ? "Saving..." : "Save Announcement"}</Btn>
      </Card>
    </div>
  );
}

// ─── ENQUIRIES SECTION ────────────────────────────────────────────────────────
function EnquiriesSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "enquiries")).then((snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setItems(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const fmt = (ts) => {
    if (!ts?.seconds) return "—";
    return new Date(ts.seconds * 1000).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div>
      <SectionTitle title="Enquiry Submissions" subtitle={`${items.length} total enquiries from the website form`} />
      {loading ? <p style={{ color: A.sub }}>Loading...</p> : items.length === 0 ? (
        <EmptyState message="No enquiries yet. They appear here when someone submits the website form." />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: A.bg }}>
                {["Name", "Phone", "Course", "Timing", "Age", "Gender", "Blood Grp", "Date"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: A.sub, fontSize: "11px", letterSpacing: "0.5px", borderBottom: `1px solid ${A.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} style={{ borderBottom: `1px solid ${A.border}` }}
                  onMouseEnter={(el) => { if (el.currentTarget) el.currentTarget.style.background = "#f8faff"; }}
                  onMouseLeave={(el) => { if (el.currentTarget) el.currentTarget.style.background = ""; }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: A.text }}>{e.firstName} {e.lastName}</td>
                  <td style={{ padding: "12px 14px", color: A.sub }}><a href={`tel:${e.phone}`} style={{ color: "#2196F3", textDecoration: "none" }}>{e.phone}</a></td>
                  <td style={{ padding: "12px 14px" }}><span style={{ background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>{e.course}</span></td>
                  <td style={{ padding: "12px 14px", color: A.sub }}>{e.timing}</td>
                  <td style={{ padding: "12px 14px", color: A.sub }}>{e.age || "—"}</td>
                  <td style={{ padding: "12px 14px", color: A.sub }}>{e.gender || "—"}</td>
                  <td style={{ padding: "12px 14px", color: A.sub }}>{e.bloodGroup || "—"}</td>
                  <td style={{ padding: "12px 14px", color: A.sub, fontSize: "12px" }}>{fmt(e.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── SIDEBAR NAV ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "courses", label: "Courses", icon: "📚" },
  { id: "reviews", label: "Reviews", icon: "⭐" },
  { id: "gallery", label: "Gallery", icon: "📸" },
  { id: "whys", label: "Why Us", icon: "💪" },
  { id: "faqs", label: "FAQs", icon: "❓" },
  { id: "hero", label: "Hero Section", icon: "🏠" },
  { id: "contact", label: "Contact Info", icon: "📞" },
  { id: "seo", label: "SEO Settings", icon: "🔍" },
  { id: "announcement", label: "Announcement", icon: "📢" },
  { id: "enquiries", label: "Enquiries", icon: "📋" },
];

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch { setError("Invalid email or password. Please try again."); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: A.sidebar, padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "36px 28px", width: "100%", maxWidth: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: A.pri, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: "20px", margin: "0 auto 14px" }}>SR</div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: A.text, marginBottom: "4px" }}>Admin Panel</h1>
          <p style={{ fontSize: "13px", color: A.sub }}>Sai Rohan Driving School</p>
        </div>
        <form onSubmit={login}>
          <FInput label="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@example.com" />
          <FInput label="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
          {error && <p style={{ color: A.danger, fontSize: "13px", marginBottom: "12px", marginTop: "-6px" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: "10px", background: A.pri, color: "#fff", border: "none", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN ADMIN PANEL ─────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [toast, setToastState] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToastState({ msg, type });
    setTimeout(() => setToastState(null), 3000);
  }, []);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  if (authLoading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: A.bg, color: A.sub, fontSize: "16px" }}>Loading...</div>;
  }
  if (!user) return <LoginScreen />;

  const selectTab = (id) => {
    setActiveTab(id);
    if (isMobile) setSidebarOpen(false);
  };

  const renderSection = () => {
    const props = { toast: showToast };
    switch (activeTab) {
      case "courses": return <CoursesSection {...props} />;
      case "reviews": return <ReviewsSection {...props} />;
      case "gallery": return <GallerySection {...props} />;
      case "whys": return <WhysSection {...props} />;
      case "faqs": return <FAQsSection {...props} />;
      case "hero": return <HeroSection {...props} />;
      case "contact": return <ContactSection {...props} />;
      case "seo": return <SEOSection {...props} />;
      case "announcement": return <AnnouncementSection {...props} />;
      case "enquiries": return <EnquiriesSection />;
      default: return null;
    }
  };

  const activeTabLabel = TABS.find((t) => t.id === activeTab)?.label || "";

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: A.bg, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .admin-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .admin-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .admin-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .admin-card-actions { display: flex; gap: 6px; flex-shrink: 0; }
        @media (max-width: 600px) {
          .admin-grid-2 { grid-template-columns: 1fr !important; }
          .admin-grid-3 { grid-template-columns: 1fr !important; }
          .admin-card-row { flex-direction: column !important; align-items: flex-start !important; }
          .admin-card-actions { width: 100%; justify-content: flex-end; margin-top: 8px; }
          .admin-topbar-email { display: none; }
        }
      `}</style>

      {/* MOBILE BACKDROP */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 998 }} />
      )}

      {/* SIDEBAR */}
      <aside style={{
        width: "230px", background: A.sidebar, display: "flex", flexDirection: "column",
        flexShrink: 0, overflowY: "auto", overflowX: "hidden",
        position: isMobile ? "fixed" : "relative",
        top: 0, left: 0, bottom: 0, zIndex: 999,
        transform: isMobile ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        transition: "transform 0.25s ease",
      }}>
        <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: A.pri, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: "14px", flexShrink: 0 }}>SR</div>
          <div><div style={{ fontSize: "13px", fontWeight: 800, color: "#fff" }}>SAI ROHAN</div><div style={{ fontSize: "10px", color: "#64748b" }}>Admin Panel</div></div>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => selectTab(t.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: "10px",
              padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer",
              background: activeTab === t.id ? `${A.sidebarActive}20` : "transparent",
              color: activeTab === t.id ? A.pri : "#94a3b8",
              fontWeight: activeTab === t.id ? 700 : 500, fontSize: "13px",
              marginBottom: "2px", transition: "all 0.15s", textAlign: "left",
            }}>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: "1px solid #1e293b" }}>
          <button onClick={() => signOut(auth)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "#1e293b", color: "#ef4444", cursor: "pointer", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* TOP BAR */}
        <div style={{ background: "#fff", borderBottom: `1px solid ${A.border}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ width: "20px", height: "2px", background: A.text, display: "block" }} />
              <span style={{ width: "20px", height: "2px", background: A.text, display: "block" }} />
              <span style={{ width: "20px", height: "2px", background: A.text, display: "block" }} />
            </button>
          )}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "16px", fontWeight: 700, color: A.text }}>{TABS.find(t => t.id === activeTab)?.icon} {activeTabLabel}</p>
            <p className="admin-topbar-email" style={{ fontSize: "11px", color: A.sub }}>{user.email}</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            style={{ padding: "8px 14px", borderRadius: "8px", background: "#e0f2fe", color: "#0369a1", textDecoration: "none", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap" }}>
            🌐 View Site ↗
          </a>
        </div>

        {/* SECTION CONTENT */}
        <main style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px" : "28px 32px" }}>
          {renderSection()}
        </main>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", right: "16px", left: isMobile ? "16px" : "auto",
          zIndex: 9999, background: toast.type === "error" ? A.danger : A.success,
          color: "#fff", padding: "14px 20px", borderRadius: "10px",
          fontWeight: 600, fontSize: "14px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          animation: "slideIn 0.3s ease", textAlign: "center",
        }}>
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}
