"use client";
import { Users, Utensils, Image } from "lucide-react";
const G = ({ icon: I, size=12 }: { icon: React.ElementType; size?: number }) => 
  <I size={size} color="#C8A97E" strokeWidth={1.75} style={{ display:"inline-block", verticalAlign:"middle", marginRight:4 }} />;
import { useState, useRef } from "react";

interface Course {
  name: string;
  description: string;
  imageUrl?: string;
}

interface Menu {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  minGuests: number;
  maxGuests: number;
  courses: Course[];
  active: boolean;
  tag?: string;
}

const DEFAULT_MENUS: Menu[] = [
  {
    id: "m1",
    name: "Bayou Tasting Menu",
    description: "A six-course journey through Louisiana's finest ingredients — from Gulf seafood to Cajun heritage grains, paired with regional wines.",
    pricePerPerson: 95, minGuests: 2, maxGuests: 12, active: true, tag: "Signature",
    courses: [
      { name: "Amuse-Bouche",  description: "Crawfish beignet with remoulade & microgreens",       imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80" },
      { name: "First Course",  description: "Gulf oysters, champagne mignonette, pickled shallots", imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80" },
      { name: "Second Course", description: "Crawfish bisque, Cajun cream, fried leeks",            imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80" },
      { name: "Third Course",  description: "Duck confit, dirty rice, pepper jelly glaze",          imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80" },
      { name: "Fourth Course", description: "Herb-crusted redfish, grits, smothered greens",        imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80" },
      { name: "Dessert",       description: "King Cake soufflé, Creole cream cheese ice cream",     imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80" },
    ],
  },
  {
    id: "m2",
    name: "Sunday Family Feast",
    description: "A relaxed, shareable spread inspired by Cajun Sunday dinners. Perfect for families and groups who want the full experience without the formality.",
    pricePerPerson: 65, minGuests: 4, maxGuests: 20, active: true, tag: "Popular",
    courses: [
      { name: "Starters", description: "Boudin balls, cracklins, pepper jelly & crackers",         imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80" },
      { name: "Main",     description: "Smothered chicken, dirty rice, red beans & cornbread",     imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c8?w=400&q=80" },
      { name: "Sides",    description: "Maque choux, braised collards, sweet potato casserole",    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
      { name: "Dessert",  description: "Bread pudding with whiskey sauce",                         imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80" },
    ],
  },
  {
    id: "m3",
    name: "Intimate Tasting Menu",
    description: "Five intimate courses crafted for couples and small gatherings. Focused, elegant, and deeply personal.",
    pricePerPerson: 95, minGuests: 2, maxGuests: 6, active: true, tag: "New",
    courses: [
      { name: "Amuse-Bouche",  description: "Seasonal one-bite surprise",                          imageUrl: "" },
      { name: "First Course",  description: "Chilled Gulf shrimp, citrus vinaigrette, caviar",     imageUrl: "" },
      { name: "Second Course", description: "Seared scallop, cauliflower purée, truffle oil",      imageUrl: "" },
      { name: "Main",          description: "Filet mignon, bordelaise, pommes purée",              imageUrl: "" },
      { name: "Dessert",       description: "Chocolate fondant, salted caramel, raspberry coulis", imageUrl: "" },
    ],
  },
];

const TAG_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Signature: { bg: "#C8A97E18", border: "#C8A97E55", text: "#C8A97E" },
  Popular:   { bg: "#7EC87E18", border: "#7EC87E55", text: "#7EC87E" },
  New:       { bg: "#7E9BC818", border: "#7E9BC855", text: "#7E9BC8" },
  Seasonal:  { bg: "#B87EC818", border: "#B87EC855", text: "#B87EC8" },
};

function MenuCard({ menu, onEdit, onToggle, onDelete }: { menu: Menu; onEdit: () => void; onToggle: () => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const tag = menu.tag ? TAG_COLORS[menu.tag] : null;
  const heroImage = menu.courses.find(c => c.imageUrl)?.imageUrl;

  return (
    <div style={{ background: "#0f0f0f", border: `1px solid ${menu.active ? "#1e1e1e" : "#141414"}`, borderRadius: 16, overflow: "hidden", opacity: menu.active ? 1 : 0.55, transition: "opacity 0.2s", display: "flex", flexDirection: "column" }}>
      {/* Hero image */}
      {heroImage && (
        <div style={{ height: 130, overflow: "hidden", position: "relative", flexShrink: 0 }}>
          <img src={heroImage} alt={menu.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(10,10,10,0.96) 100%)" }} />
          <div style={{ position: "absolute", bottom: 10, left: 16, right: 16, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", lineHeight: 1.2 }}>{menu.name}</div>
              {tag && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: tag.bg, border: `1px solid ${tag.border}`, color: tag.text, marginTop: 4, display: "inline-block", textTransform: "uppercase", letterSpacing: "0.07em" }}>{menu.tag}</span>}
            </div>
            <div style={{ fontWeight: 900, color: "#C8A97E", fontSize: 20, fontFamily: "var(--font-playfair)" }}>${menu.pricePerPerson}<span style={{ fontSize: 10, color: "#71717a", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>/pp</span></div>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: "14px 16px", flex: 1 }}>
        {!heroImage && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontWeight: 800, color: "#f5f0e8", fontSize: 15, fontFamily: "var(--font-playfair)" }}>{menu.name}</span>
              {tag && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: tag.bg, border: `1px solid ${tag.border}`, color: tag.text, textTransform: "uppercase", letterSpacing: "0.07em" }}>{menu.tag}</span>}
            </div>
            <span style={{ fontWeight: 800, color: "#C8A97E", fontSize: 17 }}>${menu.pricePerPerson}<span style={{ fontSize: 10, color: "#71717a", fontWeight: 400 }}>/pp</span></span>
          </div>
        )}
        <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 10px", lineHeight: 1.55 }}>{menu.description}</p>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#52525b" }}>🍴 {menu.courses.length} courses</span>
          <span style={{ fontSize: 11, color: "#52525b" }}>👥 {menu.minGuests}–{menu.maxGuests} guests</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
            <button onClick={onToggle} style={btnGhost}>{menu.active ? "Hide" : "Show"}</button>
            <button onClick={onEdit} style={btnGold}>Edit</button>
            <button onClick={onDelete} style={btnDanger}>Delete</button>
          </div>
        </div>
      </div>

      {/* Course accordion */}
      <div style={{ borderTop: "1px solid #141414" }}>
        <button onClick={() => setExpanded(v => !v)}
          style={{ width: "100%", padding: "9px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", cursor: "pointer", color: "#52525b", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>
          <span>View courses</span>
          <span style={{ fontSize: 9 }}>{expanded ? "▲" : "▼"}</span>
        </button>
        {expanded && (
          <div>
            {menu.courses.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderTop: "1px solid #141414" }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", background: "#141414", border: "1px solid #1e1e1e", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {c.imageUrl ? <img src={c.imageUrl} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Utensils size={15} color="#2a2a2a" strokeWidth={1.5} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#a1a1aa" }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "#52525b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuEditor({ initial, onSave, onCancel }: { initial: Menu; onSave: (m: Menu) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Menu>({ ...initial });
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  function updateCourse(i: number, field: keyof Course, val: string) {
    const updated = [...form.courses];
    updated[i] = { ...updated[i], [field]: val };
    setForm({ ...form, courses: updated });
  }

  function handleCourseImage(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateCourse(i, "imageUrl", reader.result as string);
    reader.readAsDataURL(file);
  }

  function addCourse() {
    setForm({ ...form, courses: [...form.courses, { name: "", description: "", imageUrl: "" }] });
  }

  function removeCourse(i: number) {
    setForm({ ...form, courses: form.courses.filter((_, idx) => idx !== i) });
  }

  return (
    <div style={{ background: "#0f0f0f", border: "1px solid #C8A97E33", borderRadius: 16, padding: "22px", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: 0 }}>
          {initial.name ? `Editing: ${initial.name}` : "New Menu"}
        </h3>
        <button onClick={onCancel} style={{ ...btnGhost, fontSize: 11 }}>✕ Cancel</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
          <div><label style={labelStyle}>Menu Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder='e.g. "Bayou Tasting Menu"' style={inputStyle} /></div>
          <div><label style={labelStyle}>Price / person ($)</label>
            <input type="number" min={20} max={500} value={form.pricePerPerson} onChange={e => setForm({ ...form, pricePerPerson: Number(e.target.value) })} style={inputStyle} /></div>
          <div><label style={labelStyle}>Tag</label>
            <select value={form.tag ?? ""} onChange={e => setForm({ ...form, tag: e.target.value || undefined })} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">None</option>
              <option value="Signature">Signature</option>
              <option value="Popular">Popular</option>
              <option value="Seasonal">Seasonal</option>
              <option value="New">New</option>
            </select></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><label style={labelStyle}>Min Guests</label>
            <input type="number" min={1} max={50} value={form.minGuests} onChange={e => setForm({ ...form, minGuests: Number(e.target.value) })} style={inputStyle} /></div>
          <div><label style={labelStyle}>Max Guests</label>
            <input type="number" min={1} max={100} value={form.maxGuests} onChange={e => setForm({ ...form, maxGuests: Number(e.target.value) })} style={inputStyle} /></div>
        </div>

        <div><label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
            placeholder="Describe the dining experience..." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} /></div>

        <div>
          <label style={{ ...labelStyle, marginBottom: 12 }}>Courses</label>
          {form.courses.map((c, i) => (
            <div key={i} style={{ marginBottom: 10, padding: "12px", background: "#141414", border: "1px solid #1e1e1e", borderRadius: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 8, marginBottom: 10, alignItems: "center" }}>
                <input type="text" value={c.name} onChange={e => updateCourse(i, "name", e.target.value)}
                  placeholder={`Course ${i + 1}`} style={{ ...inputStyle, background: "#0f0f0f", fontSize: 12 }} />
                <input type="text" value={c.description} onChange={e => updateCourse(i, "description", e.target.value)}
                  placeholder="Description" style={{ ...inputStyle, background: "#0f0f0f", fontSize: 12 }} />
                <button onClick={() => removeCourse(i)} style={{ padding: "9px 11px", background: "transparent", border: "1px solid #27272a", borderRadius: 8, color: "#71717a", cursor: "pointer", fontSize: 14 }}>×</button>
              </div>

              {/* Image row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  onClick={() => fileRefs.current[i]?.click()}
                  style={{ width: 52, height: 52, borderRadius: 8, overflow: "hidden", background: "#0f0f0f", border: "1px solid #27272a", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  {c.imageUrl ? <img src={c.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Utensils size={20} color="#2a2a2a" strokeWidth={1.5} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Course Photo</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input type="file" accept="image/*" ref={el => { fileRefs.current[i] = el; }} style={{ display: "none" }} onChange={e => handleCourseImage(i, e)} />
                    <button onClick={() => fileRefs.current[i]?.click()} style={{ ...btnGhost, fontSize: 11, padding: "5px 10px", whiteSpace: "nowrap" }}>Upload</button>
                    <input type="text" value={c.imageUrl ?? ""} onChange={e => updateCourse(i, "imageUrl", e.target.value)}
                      placeholder="or paste URL..." style={{ ...inputStyle, background: "#0f0f0f", flex: 1, fontSize: 11, padding: "5px 10px" }} />
                    {c.imageUrl && <button onClick={() => updateCourse(i, "imageUrl", "")} style={{ padding: "5px 8px", borderRadius: 7, background: "transparent", border: "1px solid #27272a", color: "#71717a", fontSize: 12, cursor: "pointer" }}>×</button>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={addCourse} style={{ padding: "9px", borderRadius: 10, background: "transparent", border: "1px dashed #C8A97E44", color: "#C8A97E88", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%", marginTop: 2 }}>
            + Add Course
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, paddingTop: 2 }}>
          <button onClick={() => onSave(form)} disabled={!form.name}
            style={{ flex: 1, padding: "12px", borderRadius: 10, background: form.name ? "#C8A97E" : "#2a2a2a", color: form.name ? "#080808" : "#52525b", fontWeight: 800, fontSize: 13, border: "none", cursor: form.name ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>
            Save Menu
          </button>
          <button onClick={onCancel} style={{ padding: "12px 20px", borderRadius: 10, background: "transparent", border: "1px solid #27272a", color: "#71717a", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChefMenus() {
  const [menus, setMenus]       = useState<Menu[]>(DEFAULT_MENUS);
  const [editing, setEditing]   = useState<Menu | null>(null);
  const [creating, setCreating] = useState(false);

  function toggleMenu(id: string) { setMenus(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m)); }
  function deleteMenu(id: string) { if (confirm("Delete this menu?")) setMenus(prev => prev.filter(m => m.id !== id)); }
  function saveMenu(m: Menu) {
    if (editing) setMenus(prev => prev.map(x => x.id === m.id ? m : x));
    else setMenus(prev => [...prev, m]);
    setEditing(null); setCreating(false);
  }

  const newTemplate: Menu = { id: `m-${Date.now()}`, name: "", description: "", pricePerPerson: 75, minGuests: 2, maxGuests: 12, active: true, courses: [{ name: "", description: "", imageUrl: "" }, { name: "", description: "", imageUrl: "" }, { name: "", description: "", imageUrl: "" }] };
  const showForm = editing !== null || creating;

  return (
    <div style={{ padding: "32px 36px", maxWidth: 900, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>My Menus</h1>
          <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>{menus.filter(m => m.active).length} active · {menus.length} total</p>
        </div>
        {!showForm && (
          <button onClick={() => { setCreating(true); setEditing(null); }}
            style={{ padding: "10px 20px", borderRadius: 10, background: "#C8A97E", color: "#080808", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            + New Menu
          </button>
        )}
      </div>

      {showForm && <MenuEditor initial={editing ?? newTemplate} onSave={saveMenu} onCancel={() => { setEditing(null); setCreating(false); }} />}

      {!showForm && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {menus.map(menu => (
            <MenuCard key={menu.id} menu={menu}
              onEdit={() => { setEditing(menu); setCreating(false); }}
              onToggle={() => toggleMenu(menu.id)}
              onDelete={() => deleteMenu(menu.id)} />
          ))}
          <button onClick={() => { setCreating(true); setEditing(null); }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#C8A97E55"; (e.currentTarget as HTMLButtonElement).style.color = "#C8A97E88"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e1e1e"; (e.currentTarget as HTMLButtonElement).style.color = "#3f3f46"; }}
            style={{ background: "transparent", border: "1px dashed #1e1e1e", borderRadius: 16, padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", color: "#3f3f46", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ fontSize: 28 }}>+</span>
            <span style={{ fontSize: 12 }}>Add a menu</span>
          </button>
        </div>
      )}
    </div>
  );
}

const btnGhost: React.CSSProperties = { padding: "7px 12px", borderRadius: 8, background: "transparent", border: "1px solid #27272a", color: "#71717a", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" };
const btnGold: React.CSSProperties = { padding: "7px 12px", borderRadius: 8, background: "#C8A97E18", border: "1px solid #C8A97E44", color: "#C8A97E", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" };
const btnDanger: React.CSSProperties = { padding: "7px 12px", borderRadius: 8, background: "transparent", border: "1px solid #C87E7E33", color: "#C87E7E88", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" };
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 7 };
const inputStyle: React.CSSProperties = { width: "100%", background: "#141414", border: "1px solid #2a2a2a", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f5f0e8", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" };
