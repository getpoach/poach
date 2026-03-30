"use client";
import { useState } from "react";

interface Course {
  name: string;
  description: string;
}

interface Menu {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  courses: Course[];
  active: boolean;
}

const DEFAULT_MENUS: Menu[] = [
  {
    id: "m1",
    name: "Bayou Tasting Menu",
    description: "A six-course journey through Louisiana's finest ingredients — from Gulf seafood to Cajun heritage grains, paired with regional wines.",
    pricePerPerson: 95,
    active: true,
    courses: [
      { name: "Amuse-Bouche", description: "Crawfish beignet with remoulade & microgreens" },
      { name: "First Course", description: "Gulf oysters, champagne mignonette, pickled shallots" },
      { name: "Second Course", description: "Crawfish bisque, Cajun cream, fried leeks" },
      { name: "Third Course", description: "Duck confit, dirty rice, pepper jelly glaze" },
      { name: "Fourth Course", description: "Herb-crusted redfish, grits, smothered greens" },
      { name: "Dessert", description: "King Cake soufflé, Creole cream cheese ice cream" },
    ],
  },
  {
    id: "m2",
    name: "Sunday Family Feast",
    description: "A relaxed, shareable spread inspired by Cajun Sunday dinners. Perfect for families and groups.",
    pricePerPerson: 65,
    active: true,
    courses: [
      { name: "Starters", description: "Boudin balls, cracklins, pepper jelly & crackers" },
      { name: "Main", description: "Smothered chicken, dirty rice, red beans & cornbread" },
      { name: "Sides", description: "Maque choux, braised collards, sweet potato casserole" },
      { name: "Dessert", description: "Bread pudding with whiskey sauce" },
    ],
  },
];

function MenuCard({ menu, onEdit, onToggle }: { menu: Menu; onEdit: () => void; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ background: "#0f0f0f", border: `1px solid ${menu.active ? "#1e1e1e" : "#141414"}`, borderRadius: 16, overflow: "hidden", opacity: menu.active ? 1 : 0.6 }}>
      <div style={{ padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontWeight: 800, color: "#f5f0e8", fontSize: 16, fontFamily: "var(--font-playfair)" }}>{menu.name}</span>
            {!menu.active && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#52525b" }}>Hidden</span>
            )}
          </div>
          <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 10px", lineHeight: 1.5 }}>{menu.description}</p>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontWeight: 800, color: "#C8A97E", fontSize: 18 }}>${menu.pricePerPerson}</span>
            <span style={{ fontSize: 12, color: "#52525b" }}>per person · {menu.courses.length} courses</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button onClick={onToggle}
            style={{ padding: "7px 12px", borderRadius: 8, background: "transparent", border: "1px solid #27272a", color: "#71717a", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            {menu.active ? "Hide" : "Show"}
          </button>
          <button onClick={onEdit}
            style={{ padding: "7px 12px", borderRadius: 8, background: "#C8A97E18", border: "1px solid #C8A97E44", color: "#C8A97E", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Edit
          </button>
        </div>
      </div>

      {/* Courses preview */}
      <div style={{ borderTop: "1px solid #141414" }}>
        <button onClick={() => setExpanded(!expanded)}
          style={{ width: "100%", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", cursor: "pointer", color: "#71717a", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
          <span>🍴 {menu.courses.length} courses</span>
          <span>{expanded ? "▲ Hide" : "▼ View"}</span>
        </button>
        {expanded && (
          <div style={{ padding: "0 20px 16px" }}>
            {menu.courses.map((c, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: i < menu.courses.length - 1 ? "1px solid #141414" : "none" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#a1a1aa", marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#71717a" }}>{c.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChefMenus() {
  const [menus, setMenus] = useState<Menu[]>(DEFAULT_MENUS);
  const [editing, setEditing] = useState<Menu | null>(null);
  const [creating, setCreating] = useState(false);

  function toggleMenu(id: string) {
    setMenus((prev) => prev.map((m) => m.id === id ? { ...m, active: !m.active } : m));
  }

  const showForm = editing !== null || creating;
  const formMenu: Menu = editing ?? {
    id: `m${Date.now()}`,
    name: "",
    description: "",
    pricePerPerson: 75,
    active: true,
    courses: [
      { name: "", description: "" },
      { name: "", description: "" },
      { name: "", description: "" },
    ],
  };

  function saveMenu(m: Menu) {
    if (editing) {
      setMenus((prev) => prev.map((x) => x.id === m.id ? m : x));
    } else {
      setMenus((prev) => [...prev, m]);
    }
    setEditing(null);
    setCreating(false);
  }

  return (
    <div style={{ padding: "32px 36px", maxWidth: 800 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 4px" }}>My Menus</h1>
          <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>{menus.filter((m) => m.active).length} active menus</p>
        </div>
        <button onClick={() => { setCreating(true); setEditing(null); }}
          style={{ padding: "10px 18px", borderRadius: 10, background: "#C8A97E", color: "#080808", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          + New Menu
        </button>
      </div>

      {/* Menu editor form */}
      {showForm && (
        <MenuEditor
          initial={formMenu}
          onSave={saveMenu}
          onCancel={() => { setEditing(null); setCreating(false); }}
        />
      )}

      {/* Menu list */}
      {!showForm && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu}
              onEdit={() => { setEditing(menu); setCreating(false); }}
              onToggle={() => toggleMenu(menu.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MenuEditor({ initial, onSave, onCancel }: { initial: Menu; onSave: (m: Menu) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Menu>(initial);

  function updateCourse(i: number, field: keyof Course, val: string) {
    const updated = [...form.courses];
    updated[i] = { ...updated[i], [field]: val };
    setForm({ ...form, courses: updated });
  }

  function addCourse() {
    setForm({ ...form, courses: [...form.courses, { name: "", description: "" }] });
  }

  function removeCourse(i: number) {
    setForm({ ...form, courses: form.courses.filter((_, idx) => idx !== i) });
  }

  return (
    <div style={{ background: "#0f0f0f", border: "1px solid #C8A97E33", borderRadius: 16, padding: "24px", marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 20px" }}>
        {initial.name ? `Edit: ${initial.name}` : "New Menu"}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Menu Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder='e.g. "Bayou Tasting Menu"' style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Price per Person ($)</label>
            <input type="number" min={20} max={500} value={form.pricePerPerson}
              onChange={(e) => setForm({ ...form, pricePerPerson: Number(e.target.value) })} style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2} placeholder="Describe the dining experience..." style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div>
          <label style={{ ...labelStyle, marginBottom: 10 }}>Courses</label>
          {form.courses.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <input type="text" value={c.name} onChange={(e) => updateCourse(i, "name", e.target.value)}
                placeholder={`Course ${i + 1}`} style={{ ...inputStyle, fontSize: 12 }} />
              <input type="text" value={c.description} onChange={(e) => updateCourse(i, "description", e.target.value)}
                placeholder="Description" style={{ ...inputStyle, fontSize: 12 }} />
              <button onClick={() => removeCourse(i)}
                style={{ padding: "10px", background: "transparent", border: "1px solid #27272a", borderRadius: 8, color: "#71717a", cursor: "pointer", fontSize: 14 }}>
                ×
              </button>
            </div>
          ))}
          <button onClick={addCourse}
            style={{ marginTop: 4, padding: "8px 14px", borderRadius: 8, background: "transparent", border: "1px dashed #3f3f46", color: "#71717a", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            + Add Course
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button onClick={() => onSave(form)} disabled={!form.name}
            style={{ flex: 1, padding: "11px", borderRadius: 10, background: form.name ? "#C8A97E" : "#2a2a2a", color: form.name ? "#080808" : "#52525b", fontWeight: 700, fontSize: 13, border: "none", cursor: form.name ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>
            Save Menu
          </button>
          <button onClick={onCancel}
            style={{ padding: "11px 18px", borderRadius: 10, background: "transparent", border: "1px solid #27272a", color: "#71717a", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: "#52525b",
  textTransform: "uppercase", letterSpacing: "0.08em",
  display: "block", marginBottom: 7,
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#141414", border: "1px solid #2a2a2a",
  borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f5f0e8",
  outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
};
