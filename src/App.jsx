import { useState, useEffect, useRef } from "react";

// ─── STORAGE HELPERS (localStorage simulation with state) ───
const DEFAULT_PHOTOS = [
  { id: 1, url: "https://images.unsplash.com/photo-1449965408869-ebd13bc9e5c8?w=400&h=300&fit=crop", caption: "Training Session" },
  { id: 2, url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop", caption: "Our Training Car" },
  { id: 3, url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop", caption: "Road Practice" },
  { id: 4, url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop", caption: "Student Practice" },
  { id: 5, url: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=300&fit=crop", caption: "Highway Training" },
  { id: 6, url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop", caption: "Certified Students" },
];

const DEFAULT_REVIEWS = [
  { id: 1, name: "Priya Reddy", text: "Excellent training! Got my license in first attempt. Very patient instructors.", rating: 5 },
  { id: 2, name: "Karthik M.", text: "Best driving school in Boduppal. The trainers are very friendly and professional.", rating: 5 },
  { id: 3, name: "Lakshmi D.", text: "My daughter learned here. Very safe dual-control cars. Highly recommend!", rating: 5 },
  { id: 4, name: "Rahul Kumar", text: "Affordable pricing and great training. Learned to drive in just 30 days.", rating: 5 },
  { id: 5, name: "Sneha P.", text: "Flexible timings suited my college schedule. Instructors are very experienced.", rating: 4 },
  { id: 6, name: "Venkat Rao", text: "Very good driving school. They helped with RTO process also. Smooth experience.", rating: 5 },
  { id: 7, name: "Anjali S.", text: "I was very scared of driving initially. The trainer made me comfortable. Thank you!", rating: 5 },
  { id: 8, name: "Manoj T.", text: "Completed advanced course. Now driving on highways confidently. Worth every rupee.", rating: 5 },
];

const DEFAULT_COURSES = [
  {
    name: "Basic",
    duration: "30 Days",
    sessions: "30 Sessions",
    price: "₹4,000",
    features: ["Steering & gear basics", "City road practice", "Parking training", "Traffic rules", "License guidance"],
    tag: null,
  },
  {
    name: "Intermediate",
    duration: "45 Days",
    sessions: "45 Sessions",
    price: "₹6,000",
    features: ["Everything in Basic", "Highway driving", "Night driving basics", "Defensive driving", "RTO test preparation", "License assistance"],
    tag: "POPULAR",
  },
  {
    name: "Advance",
    duration: "60 Days",
    sessions: "60 Sessions",
    price: "₹8,500",
    features: ["Everything in Intermediate", "Advanced highway skills", "Hill & slope practice", "All weather driving", "Confidence building", "Guaranteed license support", "Lifetime refresher sessions"],
    tag: "BEST VALUE",
  },
];

const WHYS = [
  { icon: "🏆", title: "Experienced Trainers", desc: "Certified instructors with years of real road training experience." },
  { icon: "🚗", title: "Dual-Control Cars", desc: "Instructor-side brakes for complete safety during every practice session." },
  { icon: "📋", title: "RTO License Help", desc: "Full guidance for Learning License & Permanent License — we handle the process." },
  { icon: "⏰", title: "Flexible Timings", desc: "Morning, afternoon & evening batches. Choose what fits your schedule." },
  { icon: "🛣️", title: "Real Road Training", desc: "Practice in actual Hyderabad traffic, not just on empty grounds." },
  { icon: "💰", title: "Affordable Fees", desc: "Best rates in Boduppal area. No hidden charges. EMI available." },
];

const FAQS = [
  { q: "What age do I need to be to learn driving?", a: "You must be 18 years or older for a car license (LMV). For gearless two-wheelers, minimum age is 16 with guardian consent." },
  { q: "Do you help with the RTO license process?", a: "Yes! We guide you through the entire process — from Learning License application to Permanent License test. We also provide the vehicle for the RTO test." },
  { q: "Can I choose my training timings?", a: "Absolutely. We offer morning (6-9 AM), afternoon (12-3 PM), and evening (4-7 PM) batches." },
  { q: "What type of cars do you use?", a: "We use dual-control Maruti cars with instructor-side brake and clutch for your complete safety." },
  { q: "What if I need extra classes?", a: "Additional sessions are available at discounted rates for enrolled students." },
  { q: "Where is your driving school located?", a: "We are located at 9-10, beside Akruti Township, Tulip Block, West Hanuman Nagar, Boduppal, Hyderabad, Telangana 500092." },
];

// ─── HOOKS ───
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, v];
}

function Reveal({ children, delay = 0 }) {
  const [ref, v] = useInView();
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(36px)", transition: `all 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s` }}>{children}</div>;
}

// ─── HORIZONTAL SCROLL COMPONENT ───
function HScroll({ children }) {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
  };
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => scroll(-1)} style={{
        position: "absolute", left: "-16px", top: "50%", transform: "translateY(-50%)", zIndex: 10,
        width: "40px", height: "40px", borderRadius: "50%", background: "#fff", border: "1px solid #e0e8f0",
        cursor: "pointer", fontSize: "16px", color: "#2196F3", boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>←</button>
      <div ref={scrollRef} style={{
        display: "flex", gap: "16px", overflowX: "auto", scrollSnapType: "x mandatory",
        padding: "8px 4px 16px", scrollbarWidth: "none", msOverflowStyle: "none",
      }}>
        <style>{`.hscroll::-webkit-scrollbar { display: none; }`}</style>
        {children}
      </div>
      <button onClick={() => scroll(1)} style={{
        position: "absolute", right: "-16px", top: "50%", transform: "translateY(-50%)", zIndex: 10,
        width: "40px", height: "40px", borderRadius: "50%", background: "#fff", border: "1px solid #e0e8f0",
        cursor: "pointer", fontSize: "16px", color: "#2196F3", boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>→</button>
    </div>
  );
}

// ─── ADMIN PANEL ───
function AdminPanel({ photos, setPhotos, reviews, setReviews, courses, setCourses, onClose }) {
  const [tab, setTab] = useState("photos");
  const [newPhoto, setNewPhoto] = useState({ url: "", caption: "" });
  const [newReview, setNewReview] = useState({ name: "", text: "", rating: 5 });

  const addPhoto = () => {
    if (newPhoto.url && newPhoto.caption) {
      setPhotos([...photos, { id: Date.now(), ...newPhoto }]);
      setNewPhoto({ url: "", caption: "" });
    }
  };

  const removePhoto = (id) => setPhotos(photos.filter(p => p.id !== id));

  const addReview = () => {
    if (newReview.name && newReview.text) {
      setReviews([...reviews, { id: Date.now(), ...newReview }]);
      setNewReview({ name: "", text: "", rating: 5 });
    }
  };

  const removeReview = (id) => setReviews(reviews.filter(r => r.id !== id));

  const updateCourse = (idx, field, value) => {
    const updated = [...courses];
    updated[idx] = { ...updated[idx], [field]: value };
    setCourses(updated);
  };

  const tabStyle = (t) => ({
    padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
    background: tab === t ? "#2196F3" : "#f0f4f8", color: tab === t ? "#fff" : "#555",
    border: "none", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "700px", maxHeight: "85vh", overflow: "auto", padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1a1a1a", fontFamily: "'Outfit', sans-serif" }}>⚙️ Admin Panel</h2>
          <button onClick={onClose} style={{ background: "#f0f0f0", border: "none", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", fontSize: "16px" }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <button style={tabStyle("photos")} onClick={() => setTab("photos")}>📸 Photos</button>
          <button style={tabStyle("reviews")} onClick={() => setTab("reviews")}>⭐ Reviews</button>
          <button style={tabStyle("courses")} onClick={() => setTab("courses")}>📚 Courses</button>
        </div>

        {/* PHOTOS TAB */}
        {tab === "photos" && (
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              <input value={newPhoto.url} onChange={e => setNewPhoto({ ...newPhoto, url: e.target.value })}
                placeholder="Image URL" style={{ flex: 2, minWidth: "200px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              <input value={newPhoto.caption} onChange={e => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                placeholder="Caption" style={{ flex: 1, minWidth: "120px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              <button onClick={addPhoto} style={{ padding: "10px 20px", borderRadius: "8px", background: "#2196F3", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>+ Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {photos.map(p => (
                <div key={p.id} style={{ position: "relative", width: "120px" }}>
                  <img src={p.url} alt={p.caption} style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                    onError={e => { e.target.style.background = "#f0f4f8"; e.target.alt = "⚠️"; }} />
                  <div style={{ fontSize: "10px", color: "#777", marginTop: "4px", textAlign: "center" }}>{p.caption}</div>
                  <button onClick={() => removePhoto(p.id)} style={{
                    position: "absolute", top: "-6px", right: "-6px", width: "22px", height: "22px", borderRadius: "50%",
                    background: "#e84c3d", color: "#fff", border: "none", cursor: "pointer", fontSize: "10px", fontWeight: 800,
                  }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {tab === "reviews" && (
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
              <input value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                placeholder="Student name" style={{ flex: 1, minWidth: "140px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              <select value={newReview.rating} onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ★</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input value={newReview.text} onChange={e => setNewReview({ ...newReview, text: e.target.value })}
                placeholder="Review text" style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              <button onClick={addReview} style={{ padding: "10px 20px", borderRadius: "8px", background: "#2196F3", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}>+ Add</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {reviews.map(r => (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8f9fa", borderRadius: "8px" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "13px", color: "#1a1a1a" }}>{r.name}</span>
                    <span style={{ color: "#f39c12", marginLeft: "8px", fontSize: "12px" }}>{"★".repeat(r.rating)}</span>
                    <div style={{ fontSize: "12px", color: "#777", marginTop: "2px" }}>{r.text.substring(0, 60)}...</div>
                  </div>
                  <button onClick={() => removeReview(r.id)} style={{ background: "#e84c3d", color: "#fff", border: "none", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "12px", fontWeight: 800 }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {tab === "courses" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {courses.map((c, idx) => (
              <div key={idx} style={{ padding: "16px", background: "#f8f9fa", borderRadius: "12px" }}>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#2196F3", marginBottom: "10px" }}>{c.name} Plan</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>
                    <label style={{ fontSize: "11px", color: "#999", fontWeight: 600 }}>DURATION</label>
                    <input value={c.duration} onChange={e => updateCourse(idx, "duration", e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: "#999", fontWeight: 600 }}>SESSIONS</label>
                    <input value={c.sessions} onChange={e => updateCourse(idx, "sessions", e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───
export default function SaiRohanDrivingSchool() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [photos, setPhotos] = useState(DEFAULT_PHOTOS);
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [form, setForm] = useState({ name: "", phone: "", course: "Intermediate", timing: "Morning" });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  const whatsappEnquiry = () => {
    const msg = `Hi Sai Rohan Driving School! 🚗\n\nI'm interested in learning driving.\n\n👤 Name: ${form.name}\n📱 Phone: ${form.phone}\n📚 Course: ${form.course}\n⏰ Timing: ${form.timing}\n\nPlease share more details.`;
    window.open(`https://wa.me/919133999282?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const NAV = ["home", "courses", "why-us", "gallery", "reviews", "faq", "contact"];
  const C = { pri: "#2196F3", priDark: "#1976D2", priLight: "#E3F2FD", priBg: "#f0f7ff", bg: "#ffffff", card: "#f8fbff", text: "#1a2a3a", sub: "#6b7c8d" };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Outfit:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.pri}; border-radius: 2px; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); } 50% { box-shadow: 0 0 0 16px rgba(37,211,102,0); } }
        @keyframes slideIn { 0% { opacity:0; transform:translateY(16px); } 100% { opacity:1; transform:translateY(0); } }

        .btn-pri { background: linear-gradient(135deg, ${C.pri}, ${C.priDark}); color: #fff; border: none; padding: 15px 36px; border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.3s; font-family: 'DM Sans', sans-serif; }
        .btn-pri:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(33,150,243,0.3); }
        .btn-out { background: #fff; color: ${C.pri}; border: 2px solid ${C.pri}; padding: 14px 34px; border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.3s; font-family: 'DM Sans', sans-serif; }
        .btn-out:hover { background: ${C.priLight}; }

        .field { background: #fff; border: 2px solid #e0e8f0; color: #1a2a3a; padding: 14px 18px; border-radius: 12px; font-size: 14px; font-family: 'DM Sans', sans-serif; width: 100%; outline: none; transition: border 0.3s; }
        .field:focus { border-color: ${C.pri}; }
        select.field { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%232196F3' d='M5 7L0 2h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; }

        .nav-link { color: #6b7c8d; font-size: 13px; font-weight: 600; cursor: pointer; padding: 8px 14px; border-radius: 8px; transition: all 0.3s; text-transform: capitalize; }
        .nav-link:hover { color: ${C.pri}; background: ${C.priLight}; }
        .section-tag { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${C.pri}; background: ${C.priLight}; padding: 8px 18px; border-radius: 30px; margin-bottom: 14px; }

        .wa-float { position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px; border-radius: 50%; background: #25d366; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999; animation: pulse 2s infinite; border: none; box-shadow: 0 4px 20px rgba(37,211,102,0.35); transition: transform 0.3s; text-decoration: none; }
        .wa-float:hover { transform: scale(1.1); }
        .call-float { position: fixed; bottom: 24px; left: 24px; height: 48px; border-radius: 24px; background: ${C.pri}; display: flex; align-items: center; gap: 8px; padding: 0 20px; z-index: 999; text-decoration: none; box-shadow: 0 4px 20px rgba(33,150,243,0.3); transition: all 0.3s; }
        .call-float:hover { transform: scale(1.05); }

        @media (max-width: 768px) {
          .desk-nav { display: none !important; }
          .mob-btn { display: flex !important; }
          .hero-grid { flex-direction: column !important; text-align: center !important; }
          .hero-h1 { font-size: 32px !important; }
          .sec-h2 { font-size: 26px !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .footer-g { grid-template-columns: 1fr !important; text-align: center; }
          .hero-btns { justify-content: center !important; }
          .stats-r { flex-wrap: wrap !important; justify-content: center !important; }
          .hero-visual { display: none !important; }
        }
        @media (min-width: 769px) { .mob-btn { display: none !important; } .mob-nav { display: none !important; } }
      `}</style>

      {showAdmin && <AdminPanel photos={photos} setPhotos={setPhotos} reviews={reviews} setReviews={setReviews} courses={courses} setCourses={setCourses} onClose={() => setShowAdmin(false)} />}

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, height: "68px",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px",
        background: scrolled ? "rgba(255,255,255,0.95)" : "#fff",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: "1px solid #e8eff5",
        transition: "all 0.3s",
      }}>
        <div onClick={() => scrollTo("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `linear-gradient(135deg, ${C.pri}, ${C.priDark})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "16px" }}>SR</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: C.text, fontFamily: "'Outfit', sans-serif" }}>SAI ROHAN</div>
            <div style={{ fontSize: "9px", fontWeight: 600, color: C.pri, letterSpacing: "2px" }}>DRIVING SCHOOL</div>
          </div>
        </div>
        <div className="desk-nav" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {NAV.map(n => <span key={n} className="nav-link" onClick={() => scrollTo(n)}>{n.replace("-", " ")}</span>)}
          <button className="btn-pri" onClick={() => scrollTo("contact")} style={{ marginLeft: "14px", padding: "10px 24px", fontSize: "13px" }}>Enroll Now</button>
        </div>
        <button className="mob-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "flex", flexDirection: "column", gap: "5px", background: "none", border: "none", cursor: "pointer", padding: "8px" }}>
          <span style={{ width: "22px", height: "2px", background: C.pri, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
          <span style={{ width: "22px", height: "2px", background: C.pri, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: "22px", height: "2px", background: C.pri, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
      </nav>

      {menuOpen && (
        <div className="mob-nav" style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,0.98)", zIndex: 998, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          {NAV.map(n => <span key={n} className="nav-link" onClick={() => scrollTo(n)} style={{ fontSize: "18px" }}>{n.replace("-", " ")}</span>)}
          <button className="btn-pri" onClick={() => { scrollTo("contact"); setMenuOpen(false); }}>Enroll Now</button>
        </div>
      )}

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 28px 60px", position: "relative", overflow: "hidden", background: `linear-gradient(135deg, #fff 50%, ${C.priLight} 100%)` }}>
        <div className="hero-grid" style={{ maxWidth: "1100px", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: "50px", position: "relative" }}>
          <div style={{ flex: 1.2 }}>
            <Reveal><span className="section-tag">🚗 Boduppal, Hyderabad</span></Reveal>
            <Reveal delay={0.1}>
              <h1 className="hero-h1" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "48px", fontWeight: 900, lineHeight: 1.1, color: C.text, marginBottom: "18px" }}>
                Learn to Drive<br /><span style={{ color: C.pri }}>with Confidence</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p style={{ color: C.sub, fontSize: "16px", lineHeight: 1.8, marginBottom: "30px", maxWidth: "460px" }}>
                Complete 4-wheeler driving training with certified instructors, dual-control cars, real road practice & full RTO license assistance.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="hero-btns" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button className="btn-pri" onClick={() => scrollTo("contact")}>Enroll Now — Start Driving</button>
                <a href="tel:9133999282" className="btn-out" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>📞 Call Us</a>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="stats-r" style={{ display: "flex", gap: "36px", marginTop: "44px", borderTop: "1px solid #e0e8f0", paddingTop: "28px" }}>
                {[{ val: "1000+", label: "Students Trained" }, { val: "4.8 ★", label: "Google Rating" }, { val: "98%", label: "Pass Rate" }].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "28px", fontWeight: 900, color: C.pri }}>{s.val}</div>
                    <div style={{ fontSize: "12px", color: C.sub, fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="hero-visual" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Reveal delay={0.2}>
              <div style={{ width: "320px", height: "320px", borderRadius: "30px", background: `linear-gradient(135deg, ${C.priLight}, #dbeafe)`, border: `1px solid ${C.pri}20`, display: "flex", alignItems: "center", justifyContent: "center", animation: "float 5s ease-in-out infinite", position: "relative" }}>
                <span style={{ fontSize: "110px" }}>🚗</span>
                <div style={{ position: "absolute", top: "-12px", right: "-12px", background: C.pri, color: "#fff", padding: "10px 18px", borderRadius: "14px", fontSize: "13px", fontWeight: 800, boxShadow: `0 6px 20px ${C.pri}40` }}>Since 2015</div>
                <div style={{ position: "absolute", bottom: "16px", left: "-16px", background: "#fff", padding: "12px 18px", borderRadius: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: "11px", color: "#999" }}>Courses from</div>
                  <div style={{ fontSize: "22px", fontWeight: 900, color: C.pri, fontFamily: "'Outfit', sans-serif" }}>30 Days</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" style={{ padding: "80px 28px", background: C.card }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="section-tag">📚 Our Courses</span>
            <h2 className="sec-h2" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "36px", fontWeight: 900, color: C.text }}>Choose Your <span style={{ color: C.pri }}>Driving Plan</span></h2>
          </div></Reveal>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
            {courses.map((c, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{
                  background: "#fff", borderRadius: "20px", padding: "32px 24px",
                  border: c.tag ? `2px solid ${C.pri}` : "1px solid #e0e8f0",
                  position: "relative", height: "100%", display: "flex", flexDirection: "column",
                  transition: "all 0.3s", boxShadow: c.tag ? `0 8px 32px ${C.pri}15` : "none",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = c.tag ? `0 8px 32px ${C.pri}15` : "none"; }}
                >
                  {c.tag && <span style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: C.pri, color: "#fff", padding: "5px 18px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>{c.tag}</span>}
                  <div style={{ fontSize: "13px", fontWeight: 700, color: C.pri, letterSpacing: "1px", marginBottom: "10px" }}>{c.name.toUpperCase()}</div>
                  <div style={{ fontSize: "40px", fontWeight: 900, color: C.pri, fontFamily: "'Outfit', sans-serif", marginBottom: "2px", lineHeight: 1 }}>{c.duration}</div>
                  <div style={{ fontSize: "13px", color: C.sub, fontWeight: 600, marginBottom: "18px" }}>{c.sessions}</div>
                  <div style={{ flex: 1 }}>
                    {c.features.map((f, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                        <span style={{ color: C.pri, fontSize: "14px", fontWeight: 800 }}>✓</span>
                        <span style={{ fontSize: "13px", color: C.sub }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button className="btn-pri" onClick={() => { setForm({ ...form, course: c.name }); scrollTo("contact"); }}
                    style={{ width: "100%", marginTop: "16px", padding: "13px", fontSize: "14px" }}>
                    Enroll Now
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us" style={{ padding: "80px 28px", background: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="section-tag">💪 Why Choose Us</span>
            <h2 className="sec-h2" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "36px", fontWeight: 900, color: C.text }}>Why <span style={{ color: C.pri }}>Sai Rohan</span>?</h2>
          </div></Reveal>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {WHYS.map((w, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div style={{ background: C.card, borderRadius: "16px", padding: "28px 22px", border: "1px solid #e0e8f0", transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.pri}40`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e8f0"; e.currentTarget.style.transform = "none"; }}>
                  <span style={{ fontSize: "32px", display: "block", marginBottom: "14px" }}>{w.icon}</span>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: C.text, marginBottom: "8px" }}>{w.title}</h3>
                  <p style={{ fontSize: "13px", color: C.sub, lineHeight: 1.7 }}>{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — HORIZONTAL SCROLL */}
      <section id="gallery" style={{ padding: "80px 28px", background: C.card }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "36px" }}>
            <span className="section-tag">📸 Gallery</span>
            <h2 className="sec-h2" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "36px", fontWeight: 900, color: C.text }}>See Us <span style={{ color: C.pri }}>in Action</span></h2>
          </div></Reveal>
          <Reveal delay={0.1}>
            <HScroll>
              {photos.map(p => (
                <div key={p.id} style={{ minWidth: "280px", scrollSnapAlign: "start", flexShrink: 0 }}>
                  <img src={p.url} alt={p.caption} style={{ width: "280px", height: "200px", objectFit: "cover", borderRadius: "16px", display: "block" }}
                    onError={e => { e.target.style.background = C.priLight; }} />
                  <p style={{ fontSize: "13px", color: C.sub, fontWeight: 600, marginTop: "8px", textAlign: "center" }}>{p.caption}</p>
                </div>
              ))}
            </HScroll>
          </Reveal>
        </div>
      </section>

      {/* REVIEWS — HORIZONTAL SCROLL */}
      <section id="reviews" style={{ padding: "80px 28px", background: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "36px" }}>
            <span className="section-tag">⭐ Reviews</span>
            <h2 className="sec-h2" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "36px", fontWeight: 900, color: C.text }}>What Students <span style={{ color: C.pri }}>Say</span></h2>
          </div></Reveal>
          <Reveal delay={0.1}>
            <HScroll>
              {reviews.map(r => (
                <div key={r.id} style={{
                  minWidth: "300px", scrollSnapAlign: "start", flexShrink: 0,
                  background: C.card, borderRadius: "18px", padding: "24px 22px",
                  border: "1px solid #e0e8f0",
                }}>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
                    {[...Array(r.rating)].map((_, i) => <span key={i} style={{ color: "#f39c12", fontSize: "16px" }}>★</span>)}
                    {[...Array(5 - r.rating)].map((_, i) => <span key={i} style={{ color: "#ddd", fontSize: "16px" }}>★</span>)}
                  </div>
                  <p style={{ fontSize: "14px", color: C.sub, lineHeight: 1.7, marginBottom: "16px", fontStyle: "italic", minHeight: "60px" }}>"{r.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.pri}, ${C.priDark})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "14px" }}>{r.name[0]}</div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: C.text }}>{r.name}</span>
                  </div>
                </div>
              ))}
            </HScroll>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "80px 28px", background: C.card }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "36px" }}>
            <span className="section-tag">❓ FAQ</span>
            <h2 className="sec-h2" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "36px", fontWeight: 900, color: C.text }}>Common <span style={{ color: C.pri }}>Questions</span></h2>
          </div></Reveal>
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e0e8f0", overflow: "hidden", marginBottom: "8px" }}>
                <div onClick={() => setActiveFaq(activeFaq === i ? null : i)} style={{ padding: "18px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: C.text }}>{f.q}</span>
                  <span style={{ fontSize: "16px", color: C.pri, transform: activeFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>▼</span>
                </div>
                {activeFaq === i && <div style={{ padding: "0 20px 18px", fontSize: "13px", color: C.sub, lineHeight: 1.8, animation: "slideIn 0.3s ease" }}>{f.a}</div>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT + MAP */}
      <section id="contact" style={{ padding: "80px 28px", background: `linear-gradient(135deg, #fff, ${C.priLight})` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Reveal><div style={{ textAlign: "center", marginBottom: "36px" }}>
            <span className="section-tag">🎯 Enroll Now</span>
            <h2 className="sec-h2" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "36px", fontWeight: 900, color: C.text }}>Start Your <span style={{ color: C.pri }}>Driving Journey</span></h2>
          </div></Reveal>

          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            {/* Form */}
            <Reveal delay={0.1}>
              <div style={{ background: "#fff", borderRadius: "22px", padding: "32px 24px", border: "1px solid #e0e8f0", boxShadow: "0 8px 32px rgba(0,0,0,0.04)" }}>
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", color: C.sub, fontWeight: 600, display: "block", marginBottom: "6px" }}>YOUR NAME</label>
                  <input className="field" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", color: C.sub, fontWeight: 600, display: "block", marginBottom: "6px" }}>PHONE NUMBER</label>
                  <input className="field" type="tel" placeholder="WhatsApp number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", color: C.sub, fontWeight: 600, display: "block", marginBottom: "6px" }}>COURSE</label>
                  <select className="field" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}>
                    {courses.map(c => <option key={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ fontSize: "12px", color: C.sub, fontWeight: 600, display: "block", marginBottom: "6px" }}>PREFERRED TIMING</label>
                  <select className="field" value={form.timing} onChange={e => setForm({ ...form, timing: e.target.value })}>
                    <option>Morning (6-9 AM)</option>
                    <option>Afternoon (12-3 PM)</option>
                    <option>Evening (4-7 PM)</option>
                  </select>
                </div>
                <button className="btn-pri" onClick={whatsappEnquiry} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Enroll via WhatsApp
                </button>
                <a href="tel:9133999282" className="btn-out" style={{ width: "100%", textDecoration: "none", textAlign: "center", marginTop: "10px", display: "block" }}>📞 Call: 9133 999 282</a>
              </div>
            </Reveal>
          </div>

          {/* Contact cards */}
          <Reveal delay={0.25}>
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "24px" }}>
              {[
                { icon: "📞", label: "Phone 1", value: "9133 999 282", link: "tel:9133999282" },
                { icon: "📞", label: "Phone 2", value: "9866 902 354", link: "tel:9866902354" },
                { icon: "📍", label: "Location", value: "Boduppal, Hyderabad", link: "https://maps.app.goo.gl/z1StJxznuxudJgDC8" },
              ].map((c, i) => (
                <a key={i} href={c.link} target="_blank" rel="noopener noreferrer" style={{
                  background: "#fff", borderRadius: "14px", padding: "18px 14px", border: "1px solid #e0e8f0",
                  textAlign: "center", textDecoration: "none", transition: "all 0.3s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.pri}40`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e8f0"; e.currentTarget.style.transform = "none"; }}>
                  <span style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}>{c.icon}</span>
                  <div style={{ fontSize: "11px", color: "#bbb", marginBottom: "2px" }}>{c.label}</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: C.text }}>{c.value}</div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 28px 24px", background: "#1a2a3a", color: "#fff" }}>
        <div className="footer-g" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "40px", marginBottom: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: C.pri, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "14px" }}>SR</div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "16px", fontWeight: 800 }}>SAI ROHAN DRIVING SCHOOL</span>
            </div>
            <p style={{ fontSize: "13px", color: "#8899aa", lineHeight: 1.8, maxWidth: "320px" }}>
              A complete car driving training school in Boduppal, Hyderabad. Learn from certified instructors with dual-control cars and full license assistance.
            </p>
            <p style={{ fontSize: "12px", color: "#667788", marginTop: "12px", lineHeight: 1.6 }}>
              📍 9-10, beside Akruti Township, Tulip Block,<br />West Hanuman Nagar, Boduppal,<br />Hyderabad, Telangana 500092
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "12px", fontWeight: 700, color: C.pri, letterSpacing: "1px", marginBottom: "14px" }}>QUICK LINKS</h4>
            {["Home", "Courses", "Why Us", "Gallery", "Reviews", "FAQ", "Contact"].map(l => (
              <div key={l} style={{ marginBottom: "8px" }}>
                <span onClick={() => scrollTo(l.toLowerCase().replace(" ", "-"))} style={{ fontSize: "13px", color: "#8899aa", cursor: "pointer" }}
                  onMouseEnter={e => e.target.style.color = C.pri} onMouseLeave={e => e.target.style.color = "#8899aa"}>{l}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: "12px", fontWeight: 700, color: C.pri, letterSpacing: "1px", marginBottom: "14px" }}>CONTACT</h4>
            <div style={{ fontSize: "13px", color: "#8899aa", lineHeight: 2.2 }}>
              <div>📞 9133 999 282</div>
              <div>📞 9866 902 354</div>
              <div>📸 @sairohandrivingschool</div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #2a3a4a", paddingTop: "18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: "#556677" }}>© {new Date().getFullYear()} Sai Rohan Motor Driving School. All rights reserved.</span>
          <span onClick={() => setShowAdmin(true)} style={{ fontSize: "11px", color: "#334455", cursor: "pointer" }}>⚙️ Admin</span>
        </div>
      </footer>

      {/* FLOATING WHATSAPP (proper icon) */}
      <a href="https://wa.me/919133999282?text=Hi!%20I%20want%20to%20learn%20driving.%20Please%20share%20course%20details." target="_blank" rel="noopener noreferrer" className="wa-float">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <a href="tel:9133999282" className="call-float">
        <span style={{ fontSize: "16px" }}>📞</span>
        <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>Call Now</span>
      </a>
    </div>
  );
}
