import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, Plus, Heart, Pin, PinOff, Trash2, X, Sparkles, BookHeart,
  StickyNote, Star, Coffee, Lightbulb, Smile, Cloud, Download, Upload,
  Check, Menu, Feather, Pencil, ArrowUpRight
} from "lucide-react";
import "./styles.css";

const COLORS = [
  { name: "Butter", value: "#fff0bd" },
  { name: "Blush", value: "#ffdce3" },
  { name: "Mint", value: "#d9f1e4" },
  { name: "Lilac", value: "#e9defb" },
  { name: "Sky", value: "#dceeff" },
  { name: "Peach", value: "#ffe2cf" }
];
const CATEGORIES = ["All notes", "Personal", "Ideas", "Work", "Little joys"];
const starterNotes = [
  { id: 1, title: "A little reminder 🌷", body: "You don't have to have it all figured out. Just take the next tiny step, and let the rest unfold.", color: "#ffdce3", category: "Personal", pinned: true, updatedAt: Date.now() - 1000 * 60 * 18 },
  { id: 2, title: "Ideas for a slow Sunday", body: "Make pancakes, put on a happy playlist, visit that little bookstore and buy flowers for the desk.", color: "#fff0bd", category: "Little joys", pinned: true, updatedAt: Date.now() - 1000 * 60 * 60 * 3 },
  { id: 3, title: "App idea ✨", body: "A tiny digital garden where every idea gets its own little flower. Keep it simple, joyful and useful.", color: "#e9defb", category: "Ideas", pinned: false, updatedAt: Date.now() - 1000 * 60 * 60 * 24 },
  { id: 4, title: "Things to remember", body: "☁️ Keep learning\\n☕ Take proper breaks\\n💛 Be kind to yourself\\n🌱 Progress over perfection", color: "#d9f1e4", category: "Work", pinned: false, updatedAt: Date.now() - 1000 * 60 * 60 * 48 }
];

function App() {
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sweet-notes-v1")) || starterNotes; }
    catch { return starterNotes; }
  });
  const [activeCategory, setActiveCategory] = useState("All notes");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => localStorage.setItem("sweet-notes-v1", JSON.stringify(notes)), [notes]);
  const visibleNotes = useMemo(() => notes
    .filter(n => activeCategory === "All notes" || n.category === activeCategory)
    .filter(n => (n.title + " " + n.body).toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt), [notes, activeCategory, search]);

  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(""), 2300); };
  const saveNote = (note) => {
    if (!note.title.trim() && !note.body.trim()) { setEditing(null); return; }
    setNotes(old => note.id ? old.map(n => n.id === note.id ? {...note, updatedAt: Date.now()} : n) : [{...note, id: Date.now(), updatedAt: Date.now()}, ...old]);
    setEditing(null); notify(note.id ? "Your note is all fresh ✨" : "A new little note saved 💗");
  };
  const deleteNote = (id) => { setNotes(old => old.filter(n => n.id !== id)); setEditing(null); notify("Note moved out of your way"); };
  const togglePin = (id) => setNotes(old => old.map(n => n.id === id ? {...n, pinned: !n.pinned} : n));
  const exportNotes = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "sweet-notes-backup.json"; a.click(); URL.revokeObjectURL(url);
    notify("Your notes are packed up 🌼");
  };
  const importNotes = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { try { const data = JSON.parse(reader.result); if (Array.isArray(data)) { setNotes(data); notify("Notes brought home 💛"); } else throw Error(); } catch { notify("That file doesn't look like a notes backup"); } };
    reader.readAsText(file); e.target.value = "";
  };
  const count = notes.length;
  const dateLabel = new Intl.DateTimeFormat("en", { weekday:"long", month:"long", day:"numeric" }).format(new Date());

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
      <div className="brand"><div className="brand-mark"><BookHeart size={23}/></div><div><b>sweet notes</b><span>a little happy place</span></div></div>
      <div className="side-label">YOUR SPACE</div>
      <nav className="nav-list">
        {CATEGORIES.map((cat, i) => {
          const Icon = [StickyNote, Heart, Lightbulb, Coffee, Star][i];
          return <button key={cat} className={`nav-item ${activeCategory===cat ? "active":""}`} onClick={() => {setActiveCategory(cat);setMobileMenu(false);}}>
            <Icon size={17}/><span>{cat}</span>{cat==="All notes" && <small>{count}</small>}
          </button>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="tiny-card"><div className="tiny-sun">☀️</div><b>A gentle thought</b><p>Small steps still move you forward. Be proud of today.</p></div>
        <div className="side-actions">
          <button onClick={exportNotes}><Download size={15}/> Export notes</button>
          <label className="import-btn"><Upload size={15}/> Import backup<input type="file" accept="application/json" onChange={importNotes}/></label>
        </div>
        <div className="made-with"><Heart size={12} fill="currentColor"/> made with a little love</div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="mobile-toggle icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu"><Menu size={20}/></button>
        <div className="breadcrumb">My space <span>/</span> <b>{activeCategory}</b></div>
        <div className="top-actions"><span className="date-pill"><Cloud size={15}/> {dateLabel}</span><div className="avatar">S</div></div>
      </header>
      <section className="welcome">
        <div><div className="eyebrow"><Sparkles size={14}/> YOUR THOUGHTS, YOUR LITTLE WORLD</div>
          <h1>{activeCategory === "All notes" ? <>A soft place to<br/><em>land your thoughts.</em></> : <>{activeCategory}<br/><em>corner.</em></>}</h1>
          <p>Every thought deserves a home. Make yourself comfy. <span>♡</span></p>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="art-spark s1">✦</div><div className="art-spark s2">✧</div><div className="flower">✿</div><div className="art-note"><Heart size={23} fill="#f29aab"/><span>dear diary,</span><b>you are doing<br/>just fine.</b><i>♡</i></div><div className="art-spark s3">✦</div></div>
      </section>

      <section className="toolbar">
        <div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a little thought..." /><kbd>⌘ K</kbd></div>
        <button className="primary-button" onClick={()=>setEditing({title:"",body:"",color:COLORS[1].value,category:"Personal",pinned:false})}><Plus size={17}/> New note</button>
      </section>

      <section className="notes-heading"><div><h2>{search ? "Search results" : activeCategory==="All notes" ? "Your notes" : activeCategory}</h2><span>{visibleNotes.length} little {visibleNotes.length===1?"thought":"thoughts"} saved</span></div><div className="sort-label"><span className="online-dot"></span> Saved on this device</div></section>

      {visibleNotes.length ? <div className="notes-grid">{visibleNotes.map(note=><article className="note-card" key={note.id} style={{"--note-color":note.color}}>
        <div className="note-top"><span className="category-tag">{note.category}</span><button className={`pin-button ${note.pinned?"pinned":""}`} title={note.pinned?"Unpin note":"Pin note"} onClick={()=>togglePin(note.id)}>{note.pinned?<Pin size={15} fill="currentColor"/>:<PinOff size={15}/>}</button></div>
        <button className="note-content" onClick={()=>setEditing({...note})}><h3>{note.title || "Untitled note"}</h3><p>{note.body || "A blank page, full of possibilities..."}</p></button>
        <div className="note-footer"><span>{new Intl.DateTimeFormat("en",{month:"short",day:"numeric"}).format(new Date(note.updatedAt))}</span><button onClick={()=>setEditing({...note})}><Pencil size={14}/> Edit</button></div>
      </article>)}
      <button className="add-card" onClick={()=>setEditing({title:"",body:"",color:COLORS[2].value,category:"Personal",pinned:false})}><span className="add-circle"><Plus size={21}/></span><b>Leave a little note</b><small>Tap to capture a thought</small></button>
      </div> : <div className="empty-state"><div>🌼</div><h3>No notes here just yet</h3><p>Your next lovely thought can start right here.</p><button className="primary-button" onClick={()=>setEditing({title:"",body:"",color:COLORS[1].value,category:activeCategory==="All notes"?"Personal":activeCategory,pinned:false})}><Plus size={17}/> Write your first note</button></div>}

      <footer className="page-footer"><span>Made for the thoughts that make you, <b>you.</b> <Heart size={12} fill="currentColor"/></span><span>{count} notes in your little world</span></footer>
    </main>

    {editing && <NoteModal note={editing} onClose={()=>setEditing(null)} onSave={saveNote} onDelete={deleteNote}/>}
    {toast && <div className="toast"><span>✿</span>{toast}</div>}
  </div>;
}

function NoteModal({note,onClose,onSave,onDelete}) {
  const [draft,setDraft] = useState(note);
  useEffect(()=>{const fn=e=>{if(e.key==="Escape")onClose();};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn);},[onClose]);
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-head"><div><span className="modal-kicker"><Feather size={13}/> A NOTE FOR LATER</span><h2 id="modal-title">{note.id?"A little edit":"A fresh little thought"}</h2></div><button className="icon-button" onClick={onClose}><X size={19}/></button></div>
      <label className="field-label">GIVE IT A TITLE</label><input className="title-input" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} placeholder="Something lovely..." autoFocus/>
      <label className="field-label">LET YOUR THOUGHTS FLOW</label><textarea className="body-input" value={draft.body} onChange={e=>setDraft({...draft,body:e.target.value})} placeholder="Start writing here... no thought is too small." rows={7}/>
      <div className="modal-row"><div><label className="field-label">PICK A SHADE</label><div className="swatches">{COLORS.map(c=><button key={c.name} aria-label={c.name} title={c.name} className={`swatch ${draft.color===c.value?"selected":""}`} style={{background:c.value}} onClick={()=>setDraft({...draft,color:c.value})}>{draft.color===c.value&&<Check size={14}/>}</button>)}</div></div>
        <div className="category-select"><label className="field-label">FILE UNDER</label><select value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})}>{CATEGORIES.slice(1).map(c=><option key={c}>{c}</option>)}</select></div></div>
      <label className="pin-check"><input type="checkbox" checked={draft.pinned} onChange={e=>setDraft({...draft,pinned:e.target.checked})}/> <Pin size={15}/> Keep this note close to heart</label>
      <div className="modal-actions">{note.id&&<button className="delete-button" onClick={()=>onDelete(note.id)}><Trash2 size={15}/> Delete</button>}<div className="modal-right"><button className="cancel-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={()=>onSave(draft)}><Heart size={15}/> Save note</button></div></div>
    </div>
  </div>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
