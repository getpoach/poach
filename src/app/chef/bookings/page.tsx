"use client";
import { useState } from "react";

type BookingStatus = "upcoming" | "completed" | "cancelled";

interface Booking {
  id: string;
  confirmationNumber: string;
  // Diner
  diner: string;
  dinerEmail: string;
  dinerPhone: string;
  // Event
  date: string;
  isoDate: string;
  time: string;
  city: string;
  address: string;
  guests: number;
  // Menu & food
  cuisine: string;
  menuName: string;
  courses: number;
  dietaryRestrictions: string[];
  guestNote: string;
  // Financials
  pricePerPerson: number;
  total: number;
  paymentStatus: "paid" | "pending" | "refunded";
  // Status
  status: BookingStatus;
  // Post-session
  rating?: number;
  reviewText?: string;
}

const MOCK_BOOKINGS: Booking[] = [
  // ── March 2026 (completed + cancelled) ───────────────────────────────
  {
    id: "b-m01", confirmationNumber: "PCH-2026-0702",
    diner: "Theo Landry", dinerEmail: "theo.landry@email.com", dinerPhone: "(225) 555-0887",
    date: "Fri Mar 7", isoDate: "2026-03-07", time: "8:00 PM",
    city: "Baton Rouge", address: "500 Convention St, Baton Rouge, LA 70801",
    guests: 10, cuisine: "Fusion", menuName: "Grand Celebration Menu", courses: 7,
    dietaryRestrictions: ["Gluten-free (3 guests)", "Vegan (1 guest)"], guestNote: "",
    pricePerPerson: 110, total: 1300, paymentStatus: "refunded", status: "cancelled",
  },
  {
    id: "b-m02", confirmationNumber: "PCH-2026-0738",
    diner: "Renée Thibaut", dinerEmail: "renee.t@email.com", dinerPhone: "(337) 555-0144",
    date: "Sat Mar 8", isoDate: "2026-03-08", time: "7:00 PM",
    city: "Lafayette", address: "501 Jefferson St, Lafayette, LA 70501",
    guests: 4, cuisine: "French", menuName: "Bayou Tasting Menu", courses: 6,
    dietaryRestrictions: [], guestNote: "Wine pairing preferred.",
    pricePerPerson: 95, total: 380, paymentStatus: "paid", status: "completed",
    rating: 5, reviewText: "One of the best meals of my life. Beau is a true artist.",
  },
  {
    id: "b-m03", confirmationNumber: "PCH-2026-0761",
    diner: "Coach Mike Doucet", dinerEmail: "m.doucet@email.com", dinerPhone: "(337) 555-0209",
    date: "Fri Mar 13", isoDate: "2026-03-13", time: "6:30 PM",
    city: "Lafayette", address: "818 Pinhook Rd, Lafayette, LA 70501",
    guests: 12, cuisine: "Fusion", menuName: "Sunday Family Feast", courses: 4,
    dietaryRestrictions: ["Shellfish allergy (2 guests)"], guestNote: "Team dinner — keep it hearty!",
    pricePerPerson: 65, total: 780, paymentStatus: "paid", status: "completed",
    rating: 5, reviewText: "Team absolutely loved it. Will book again next season.",
  },
  {
    id: "b-m04", confirmationNumber: "PCH-2026-0774",
    diner: "Jake & Priya Patel", dinerEmail: "priya.patel@email.com", dinerPhone: "(337) 555-0621",
    date: "Sat Mar 15", isoDate: "2026-03-15", time: "7:00 PM",
    city: "New Iberia", address: "109 Main St, New Iberia, LA 70560",
    guests: 2, cuisine: "French", menuName: "Intimate Tasting Menu", courses: 5,
    dietaryRestrictions: ["Vegetarian"], guestNote: "Vegetarian menu requested.",
    pricePerPerson: 95, total: 260, paymentStatus: "paid", status: "completed",
    rating: 4, reviewText: "Beautiful experience, food was exceptional.",
  },
  {
    id: "b-m05", confirmationNumber: "PCH-2026-0798",
    diner: "Dupré & Associates", dinerEmail: "events@dupre.com", dinerPhone: "(337) 555-0310",
    date: "Thu Mar 19", isoDate: "2026-03-19", time: "7:00 PM",
    city: "Lafayette", address: "200 Coolidge Blvd, Lafayette, LA 70503",
    guests: 8, cuisine: "French", menuName: "Bayou Tasting Menu", courses: 6,
    dietaryRestrictions: ["Kosher (1 guest)"], guestNote: "Corporate client dinner. Formal setting.",
    pricePerPerson: 95, total: 760, paymentStatus: "paid", status: "completed",
    rating: 5, reviewText: "Clients were blown away. Exceeded every expectation.",
  },
  {
    id: "b-m06", confirmationNumber: "PCH-2026-0811",
    diner: "Layla Fontenot", dinerEmail: "layla.f@email.com", dinerPhone: "(337) 555-0455",
    date: "Sun Mar 23", isoDate: "2026-03-23", time: "6:00 PM",
    city: "Opelousas", address: "334 N Market St, Opelousas, LA 70570",
    guests: 4, cuisine: "West African", menuName: "Creole Heritage Dinner", courses: 5,
    dietaryRestrictions: ["Vegetarian (2 guests)"], guestNote: "",
    pricePerPerson: 85, total: 520, paymentStatus: "paid", status: "completed",
    rating: 5, reviewText: "Absolutely incredible. Beau brought the bayou to our table.",
  },
  {
    id: "b-m07", confirmationNumber: "PCH-2026-0829",
    diner: "The Arceneaux Family", dinerEmail: "garc@email.com", dinerPhone: "(337) 555-0502",
    date: "Sat Mar 28", isoDate: "2026-03-28", time: "6:00 PM",
    city: "Breaux Bridge", address: "105 S Main St, Breaux Bridge, LA 70517",
    guests: 6, cuisine: "Fusion", menuName: "Sunday Family Feast", courses: 4,
    dietaryRestrictions: [], guestNote: "Birthday celebration for Dad.",
    pricePerPerson: 65, total: 390, paymentStatus: "paid", status: "completed",
    rating: 4, reviewText: "Dad had the best birthday ever. Thank you, Chef Beau!",
  },
  {
    id: "b-m08", confirmationNumber: "PCH-2026-0892",
    diner: "Sarah & Tom Kim", dinerEmail: "sarah.kim@email.com", dinerPhone: "(337) 555-0142",
    date: "Sat Mar 29", isoDate: "2026-03-29", time: "7:00 PM",
    city: "Lafayette", address: "412 Johnston St, Lafayette, LA 70501",
    guests: 5, cuisine: "French", menuName: "Bayou Tasting Menu", courses: 6,
    dietaryRestrictions: ["Tree nut allergy"], guestNote: "Nut allergy — please avoid all tree nuts.",
    pricePerPerson: 95, total: 650, paymentStatus: "paid", status: "upcoming",
  },
  {
    id: "b-m09", confirmationNumber: "PCH-2026-0901",
    diner: "The Broussard Family", dinerEmail: "j.broussard@email.com", dinerPhone: "(337) 555-0278",
    date: "Sun Mar 30", isoDate: "2026-03-30", time: "6:30 PM",
    city: "Breaux Bridge", address: "88 Rees St, Breaux Bridge, LA 70517",
    guests: 8, cuisine: "Fusion", menuName: "Sunday Family Feast", courses: 4,
    dietaryRestrictions: ["Shellfish allergy (1 guest)"], guestNote: "",
    pricePerPerson: 65, total: 1040, paymentStatus: "paid", status: "upcoming",
  },
  // ── April 2026 ───────────────────────────────────────────────────────
  {
    id: "b-a01", confirmationNumber: "PCH-2026-0934",
    diner: "Marcus Webb", dinerEmail: "marcus.webb@email.com", dinerPhone: "(504) 555-0319",
    date: "Sat Apr 5", isoDate: "2026-04-05", time: "7:30 PM",
    city: "Lafayette", address: "215 E Pinhook Rd, Lafayette, LA 70501",
    guests: 6, cuisine: "French", menuName: "Bayou Tasting Menu", courses: 6,
    dietaryRestrictions: [], guestNote: "Anniversary dinner — please make it special!",
    pricePerPerson: 95, total: 780, paymentStatus: "pending", status: "upcoming",
  },
  {
    id: "b-a02", confirmationNumber: "PCH-2026-0951",
    diner: "Dr. Claire Mouton", dinerEmail: "c.mouton@email.com", dinerPhone: "(337) 555-0633",
    date: "Fri Apr 11", isoDate: "2026-04-11", time: "7:00 PM",
    city: "Lafayette", address: "930 Camellia Blvd, Lafayette, LA 70508",
    guests: 8, cuisine: "French", menuName: "Bayou Tasting Menu", courses: 6,
    dietaryRestrictions: ["Dairy-free (1 guest)"], guestNote: "Dinner party for colleagues.",
    pricePerPerson: 95, total: 760, paymentStatus: "paid", status: "upcoming",
  },
  {
    id: "b-a03", confirmationNumber: "PCH-2026-0968",
    diner: "Guidry Wedding Party", dinerEmail: "guidrywedding@email.com", dinerPhone: "(337) 555-0744",
    date: "Sat Apr 12", isoDate: "2026-04-12", time: "5:00 PM",
    city: "Crowley", address: "301 N Parkerson Ave, Crowley, LA 70526",
    guests: 20, cuisine: "Fusion", menuName: "Grand Celebration Menu", courses: 7,
    dietaryRestrictions: ["Gluten-free (4 guests)", "Vegan (2 guests)"], guestNote: "Rehearsal dinner. Bride prefers Cajun-forward.",
    pricePerPerson: 110, total: 2200, paymentStatus: "paid", status: "upcoming",
  },
  {
    id: "b-a04", confirmationNumber: "PCH-2026-0982",
    diner: "The LeBlanc Trio", dinerEmail: "leblanc3@email.com", dinerPhone: "(337) 555-0816",
    date: "Sun Apr 20", isoDate: "2026-04-20", time: "6:00 PM",
    city: "Lafayette", address: "204 Mudd Ave, Lafayette, LA 70501",
    guests: 3, cuisine: "French", menuName: "Intimate Tasting Menu", courses: 5,
    dietaryRestrictions: [], guestNote: "Easter Sunday family meal.",
    pricePerPerson: 95, total: 285, paymentStatus: "pending", status: "upcoming",
  },
  {
    id: "b-a05", confirmationNumber: "PCH-2026-1001",
    diner: "Broussard Law Group", dinerEmail: "events@blg.com", dinerPhone: "(337) 555-0911",
    date: "Thu Apr 24", isoDate: "2026-04-24", time: "7:30 PM",
    city: "Lafayette", address: "600 Jefferson St, Lafayette, LA 70501",
    guests: 10, cuisine: "French", menuName: "Bayou Tasting Menu", courses: 6,
    dietaryRestrictions: ["Nut allergy (1 guest)"], guestNote: "Client appreciation dinner.",
    pricePerPerson: 95, total: 950, paymentStatus: "pending", status: "upcoming",
  },
  {
    id: "b-a06", confirmationNumber: "PCH-2026-1015",
    diner: "Nina & Carlos Reyes", dinerEmail: "nreyes@email.com", dinerPhone: "(337) 555-0988",
    date: "Sat Apr 26", isoDate: "2026-04-26", time: "7:00 PM",
    city: "New Iberia", address: "310 Main St, New Iberia, LA 70560",
    guests: 6, cuisine: "Fusion", menuName: "Creole Heritage Dinner", courses: 5,
    dietaryRestrictions: [], guestNote: "Housewarming party.",
    pricePerPerson: 85, total: 510, paymentStatus: "paid", status: "upcoming",
  },
  // ── May 2026 ─────────────────────────────────────────────────────────
  {
    id: "b-may01", confirmationNumber: "PCH-2026-1043",
    diner: "The Tran Family", dinerEmail: "tran.fam@email.com", dinerPhone: "(504) 555-0112",
    date: "Sat May 2", isoDate: "2026-05-02", time: "6:30 PM",
    city: "Lafayette", address: "725 Lee Ave, Lafayette, LA 70501",
    guests: 7, cuisine: "Fusion", menuName: "Sunday Family Feast", courses: 4,
    dietaryRestrictions: ["No pork"], guestNote: "Mom's retirement dinner.",
    pricePerPerson: 65, total: 455, paymentStatus: "pending", status: "upcoming",
  },
  {
    id: "b-may02", confirmationNumber: "PCH-2026-1067",
    diner: "Chef's Table — Private", dinerEmail: "pvt@poach.com", dinerPhone: "(337) 555-0001",
    date: "Fri May 8", isoDate: "2026-05-08", time: "8:00 PM",
    city: "Lafayette", address: "412 Jefferson St, Lafayette, LA 70501",
    guests: 4, cuisine: "French", menuName: "Bayou Tasting Menu", courses: 6,
    dietaryRestrictions: [], guestNote: "Food critic in attendance.",
    pricePerPerson: 95, total: 380, paymentStatus: "paid", status: "upcoming",
  },
  {
    id: "b-may03", confirmationNumber: "PCH-2026-1089",
    diner: "Mouton & Fontenot", dinerEmail: "mf@email.com", dinerPhone: "(337) 555-0256",
    date: "Sat May 9", isoDate: "2026-05-09", time: "7:00 PM",
    city: "Opelousas", address: "201 W Landry St, Opelousas, LA 70570",
    guests: 5, cuisine: "West African", menuName: "Creole Heritage Dinner", courses: 5,
    dietaryRestrictions: ["Dairy-free (3 guests)"], guestNote: "",
    pricePerPerson: 85, total: 425, paymentStatus: "paid", status: "upcoming",
  },
  {
    id: "b-may04", confirmationNumber: "PCH-2026-1112",
    diner: "Pelican Club Gala", dinerEmail: "gala@pelicanclub.com", dinerPhone: "(337) 555-0400",
    date: "Fri May 15", isoDate: "2026-05-15", time: "6:00 PM",
    city: "Lafayette", address: "100 Girard Park Dr, Lafayette, LA 70503",
    guests: 30, cuisine: "Fusion", menuName: "Grand Celebration Menu", courses: 7,
    dietaryRestrictions: ["Gluten-free (6 guests)", "Vegetarian (5 guests)", "Nut allergy (2 guests)"], guestNote: "Annual charity gala.",
    pricePerPerson: 110, total: 3300, paymentStatus: "pending", status: "upcoming",
  },
  {
    id: "b-may05", confirmationNumber: "PCH-2026-1134",
    diner: "Stephanie Guidry", dinerEmail: "sguidry@email.com", dinerPhone: "(337) 555-0519",
    date: "Sun May 17", isoDate: "2026-05-17", time: "5:30 PM",
    city: "Lafayette", address: "903 Moss St, Lafayette, LA 70501",
    guests: 3, cuisine: "French", menuName: "Intimate Tasting Menu", courses: 5,
    dietaryRestrictions: [], guestNote: "Mother's Day brunch — make it memorable!",
    pricePerPerson: 95, total: 285, paymentStatus: "paid", status: "upcoming",
  },
  {
    id: "b-may06", confirmationNumber: "PCH-2026-1156",
    diner: "Xavier & Dominique Roy", dinerEmail: "xroy@email.com", dinerPhone: "(337) 555-0622",
    date: "Sat May 23", isoDate: "2026-05-23", time: "7:00 PM",
    city: "Breaux Bridge", address: "200 Bridge St, Breaux Bridge, LA 70517",
    guests: 8, cuisine: "Fusion", menuName: "Sunday Family Feast", courses: 4,
    dietaryRestrictions: ["Shellfish allergy (1 guest)"], guestNote: "Graduation party.",
    pricePerPerson: 65, total: 520, paymentStatus: "pending", status: "upcoming",
  },
  {
    id: "b-may07", confirmationNumber: "PCH-2026-1178",
    diner: "Boudreaux Family Reunion", dinerEmail: "boudreaux@email.com", dinerPhone: "(337) 555-0733",
    date: "Sat May 30", isoDate: "2026-05-30", time: "4:00 PM",
    city: "Lafayette", address: "3801 Johnston St, Lafayette, LA 70503",
    guests: 18, cuisine: "Fusion", menuName: "Grand Celebration Menu", courses: 7,
    dietaryRestrictions: ["Vegetarian (3 guests)"], guestNote: "Annual family reunion — go all out!",
    pricePerPerson: 110, total: 1980, paymentStatus: "pending", status: "upcoming",
  },
  // ── June 2026 ────────────────────────────────────────────────────────
  {
    id: "b-jun01", confirmationNumber: "PCH-2026-1201",
    diner: "The Moreau Couple", dinerEmail: "moreau@email.com", dinerPhone: "(337) 555-0844",
    date: "Fri Jun 5", isoDate: "2026-06-05", time: "7:30 PM",
    city: "Lafayette", address: "510 Guilbeau Rd, Lafayette, LA 70506",
    guests: 2, cuisine: "French", menuName: "Intimate Tasting Menu", courses: 5,
    dietaryRestrictions: [], guestNote: "10-year anniversary. Champagne on arrival please.",
    pricePerPerson: 95, total: 190, paymentStatus: "paid", status: "upcoming",
  },
  {
    id: "b-jun02", confirmationNumber: "PCH-2026-1223",
    diner: "Broussard Tech Retreat", dinerEmail: "retreat@broussardtech.com", dinerPhone: "(337) 555-0955",
    date: "Sat Jun 13", isoDate: "2026-06-13", time: "7:00 PM",
    city: "Lafayette", address: "1111 Bertrand Dr, Lafayette, LA 70506",
    guests: 15, cuisine: "Fusion", menuName: "Bayou Tasting Menu", courses: 6,
    dietaryRestrictions: ["Vegan (3 guests)", "Nut allergy (1 guest)"], guestNote: "Team offsite dinner.",
    pricePerPerson: 95, total: 1425, paymentStatus: "pending", status: "upcoming",
  },
  {
    id: "b-jun03", confirmationNumber: "PCH-2026-1245",
    diner: "Claudette Trosclair", dinerEmail: "c.trosclair@email.com", dinerPhone: "(337) 555-0066",
    date: "Sun Jun 21", isoDate: "2026-06-21", time: "6:00 PM",
    city: "Opelousas", address: "418 W Landry St, Opelousas, LA 70570",
    guests: 6, cuisine: "West African", menuName: "Creole Heritage Dinner", courses: 5,
    dietaryRestrictions: [], guestNote: "Father's Day dinner.",
    pricePerPerson: 85, total: 510, paymentStatus: "pending", status: "upcoming",
  },
  {
    id: "b-jun04", confirmationNumber: "PCH-2026-1267",
    diner: "Premier Realty Group", dinerEmail: "events@premierrealty.com", dinerPhone: "(337) 555-0177",
    date: "Thu Jun 25", isoDate: "2026-06-25", time: "7:00 PM",
    city: "Baton Rouge", address: "445 North Blvd, Baton Rouge, LA 70802",
    guests: 12, cuisine: "French", menuName: "Bayou Tasting Menu", courses: 6,
    dietaryRestrictions: ["Gluten-free (2 guests)"], guestNote: "Quarterly client dinner.",
    pricePerPerson: 95, total: 1140, paymentStatus: "pending", status: "upcoming",
  },
  {
    id: "b-jun05", confirmationNumber: "PCH-2026-1289",
    diner: "Cormier & Family", dinerEmail: "cormier@email.com", dinerPhone: "(337) 555-0288",
    date: "Sat Jun 27", isoDate: "2026-06-27", time: "6:30 PM",
    city: "Lafayette", address: "622 St. Mary Blvd, Lafayette, LA 70503",
    guests: 9, cuisine: "Fusion", menuName: "Sunday Family Feast", courses: 4,
    dietaryRestrictions: ["Shellfish allergy (2 guests)"], guestNote: "End of school year celebration.",
    pricePerPerson: 65, total: 585, paymentStatus: "pending", status: "upcoming",
  },
  // ── July 2026 ────────────────────────────────────────────────────────
  {
    id: "b-jul01", confirmationNumber: "PCH-2026-1312",
    diner: "Landry Independence Bash", dinerEmail: "landry@email.com", dinerPhone: "(337) 555-0399",
    date: "Sat Jul 4", isoDate: "2026-07-04", time: "5:00 PM",
    city: "Lafayette", address: "200 Camellia Blvd, Lafayette, LA 70508",
    guests: 25, cuisine: "Fusion", menuName: "Grand Celebration Menu", courses: 7,
    dietaryRestrictions: ["Vegetarian (4 guests)", "Gluten-free (3 guests)"], guestNote: "4th of July cookout elevated — make it festive!",
    pricePerPerson: 110, total: 2750, paymentStatus: "pending", status: "upcoming",
  },
  {
    id: "b-jul02", confirmationNumber: "PCH-2026-1334",
    diner: "Simone & Andre Hebert", dinerEmail: "sahebert@email.com", dinerPhone: "(337) 555-0510",
    date: "Fri Jul 10", isoDate: "2026-07-10", time: "7:30 PM",
    city: "New Iberia", address: "150 E Main St, New Iberia, LA 70560",
    guests: 4, cuisine: "French", menuName: "Bayou Tasting Menu", courses: 6,
    dietaryRestrictions: [], guestNote: "Birthday dinner for Andre.",
    pricePerPerson: 95, total: 380, paymentStatus: "pending", status: "upcoming",
  },
  {
    id: "b-jul03", confirmationNumber: "PCH-2026-1356",
    diner: "St. Martinville Supper Club", dinerEmail: "smsc@email.com", dinerPhone: "(337) 555-0621",
    date: "Sat Jul 18", isoDate: "2026-07-18", time: "7:00 PM",
    city: "Lafayette", address: "330 Settlers Trace Blvd, Lafayette, LA 70508",
    guests: 10, cuisine: "West African", menuName: "Creole Heritage Dinner", courses: 5,
    dietaryRestrictions: ["Dairy-free (2 guests)"], guestNote: "Monthly supper club.",
    pricePerPerson: 85, total: 850, paymentStatus: "pending", status: "upcoming",
  },
  {
    id: "b-jul04", confirmationNumber: "PCH-2026-1378",
    diner: "Lafayette Jazz Society", dinerEmail: "ljs@email.com", dinerPhone: "(337) 555-0732",
    date: "Fri Jul 24", isoDate: "2026-07-24", time: "8:00 PM",
    city: "Lafayette", address: "101 W Vermilion St, Lafayette, LA 70501",
    guests: 20, cuisine: "Fusion", menuName: "Grand Celebration Menu", courses: 7,
    dietaryRestrictions: ["Vegetarian (5 guests)"], guestNote: "Post-concert dinner. Late start is fine.",
    pricePerPerson: 110, total: 2200, paymentStatus: "pending", status: "upcoming",
  },
];

const STATUS_COLORS: Record<BookingStatus, { bg: string; border: string; text: string; dot: string; label: string }> = {
  upcoming:  { bg: "#C8A97E18", border: "#C8A97E55", text: "#C8A97E", dot: "#C8A97E", label: "Upcoming"  },
  completed: { bg: "#7EC87E18", border: "#7EC87E55", text: "#7EC87E", dot: "#7EC87E", label: "Completed" },
  cancelled: { bg: "#C87E7E18", border: "#C87E7E55", text: "#C87E7E", dot: "#C87E7E", label: "Cancelled" },
};

const CAL_FILL: Record<BookingStatus, string> = {
  upcoming:  "#C8A97E",
  completed: "#5a9e5a",
  cancelled: "#b05555",
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

export default function ChefBookings() {
  const today = new Date();
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const shown = filter === "all" ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter((b) => b.status === filter);
  const earnings = MOCK_BOOKINGS.filter((b) => b.status === "completed").reduce((s, b) => s + b.total, 0);

  const byDate: Record<string, Booking[]> = {};
  MOCK_BOOKINGS.forEach((b) => {
    if (!byDate[b.isoDate]) byDate[b.isoDate] = [];
    byDate[b.isoDate].push(b);
  });

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDay(viewYear, viewMonth);

  function isoKey(day: number) {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${viewYear}-${m}-${d}`;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  }

  function dominantStatus(bookings: Booking[]): BookingStatus {
    if (bookings.some(b => b.status === "upcoming"))  return "upcoming";
    if (bookings.some(b => b.status === "completed")) return "completed";
    return "cancelled";
  }

  const selectedBookings = selectedDay ? (byDate[selectedDay] ?? []) : [];

  return (
    <div style={{ padding: "32px 36px", maxWidth: 960, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 6px" }}>
          Bookings
        </h1>
        <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>
          {MOCK_BOOKINGS.filter(b => b.status === "upcoming").length} upcoming · ${earnings.toLocaleString()} earned this month
        </p>
      </div>

      {/* ── Calendar ─────────────────────────────────────────────────────── */}
      <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 16, overflow: "hidden", marginBottom: 32 }}>

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #1a1a1a" }}>
          <button onClick={prevMonth} style={{ padding: "6px 14px", borderRadius: 8, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>←</button>
          <span style={{ fontWeight: 800, color: "#f5f0e8", fontSize: 16, fontFamily: "var(--font-playfair)" }}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth} style={{ padding: "6px 14px", borderRadius: 8, background: "transparent", border: "1px solid #27272a", color: "#a1a1aa", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>→</button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "12px 16px 0" }}>
          {DAYS_OF_WEEK.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.06em", paddingBottom: 8 }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day grid — tall cells to show booking info */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, padding: "0 12px 12px" }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const key = isoKey(day);
            const dayBookings = byDate[key] ?? [];
            const hasBookings = dayBookings.length > 0;
            const status = hasBookings ? dominantStatus(dayBookings) : null;
            const fill = status ? CAL_FILL[status] : null;
            const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
            const isSelected = selectedDay === key;

            return (
              <div
                key={day}
                onClick={() => hasBookings && setSelectedDay(isSelected ? null : key)}
                style={{
                  minHeight: 88,
                  borderRadius: 8,
                  border: isSelected
                    ? `2px solid ${fill ?? "#C8A97E"}`
                    : isToday
                    ? "1px solid #C8A97E55"
                    : hasBookings
                    ? `1px solid ${fill}44`
                    : "1px solid #1a1a1a",
                  background: hasBookings ? (fill + "18") : isToday ? "#C8A97E08" : "#0a0a0a",
                  cursor: hasBookings ? "pointer" : "default",
                  padding: "6px 7px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  transition: "all 0.15s",
                  overflow: "hidden",
                }}
              >
                {/* Date number */}
                <div style={{
                  fontSize: 12,
                  fontWeight: isToday ? 800 : 500,
                  color: isToday ? "#C8A97E" : "#ffffff",
                  lineHeight: 1,
                }}>
                  {day}
                </div>

                {/* Booking pills */}
                {dayBookings.map((b) => (
                  <div key={b.id} style={{
                    borderRadius: 4,
                    padding: "3px 5px",
                    background: CAL_FILL[b.status] + "33",
                    borderLeft: `2px solid ${CAL_FILL[b.status]}`,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#ffffff",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.2,
                    }}>
                      {b.diner.split(" ")[0]}
                    </div>
                    <div style={{
                      fontSize: 9,
                      color: "rgba(255,255,255,0.65)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.3,
                    }}>
                      {b.time} · {b.city}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 18, padding: "12px 20px", borderTop: "1px solid #1a1a1a", background: "#0a0a0a", alignItems: "center" }}>
          {(["upcoming", "completed", "cancelled"] as BookingStatus[]).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: CAL_FILL[s] + "44", border: `1px solid ${CAL_FILL[s]}88` }} />
              <span style={{ fontSize: 11, color: "#71717a", textTransform: "capitalize" }}>{s}</span>
            </div>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#3f3f46" }}>Click a booking day to expand</span>
        </div>

        {/* Selected day — full booking detail */}
        {selectedDay && selectedBookings.length > 0 && (
          <div style={{ borderTop: "1px solid #1a1a1a", background: "#0c0c0c" }}>
            <div style={{ padding: "14px 20px 6px", fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {new Date(selectedDay + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            {selectedBookings.map(b => {
              const s = STATUS_COLORS[b.status];
              const payColors: Record<string, string> = { paid: "#7EC87E", pending: "#C8A97E", refunded: "#C87E7E" };
              return (
                <div key={b.id} style={{ margin: "0 16px 16px", borderRadius: 12, border: `1px solid ${s.border}`, background: "#111", overflow: "hidden" }}>
                  {/* Booking header */}
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1a1a1a", background: CAL_FILL[b.status] + "12" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: "#f5f0e8" }}>{b.diner}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{s.label}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#71717a", marginTop: 3 }}>#{b.confirmationNumber}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#C8A97E" }}>${b.total}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: payColors[b.paymentStatus], textTransform: "capitalize", marginTop: 2 }}>
                        {b.paymentStatus === "paid" ? "✓ Paid" : b.paymentStatus === "pending" ? "⏳ Pending" : "↩ Refunded"}
                      </div>
                    </div>
                  </div>

                  {/* Detail grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "#1a1a1a" }}>
                    {[
                      { label: "Time", value: b.time },
                      { label: "Guests", value: `${b.guests} guests` },
                      { label: "Price / person", value: `$${b.pricePerPerson}` },
                      { label: "Menu", value: b.menuName },
                      { label: "Courses", value: `${b.courses} courses` },
                      { label: "Cuisine", value: b.cuisine },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ padding: "10px 14px", background: "#111" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#f5f0e8" }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Location + contact */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#1a1a1a", borderTop: "1px solid #1a1a1a" }}>
                    <div style={{ padding: "10px 14px", background: "#111" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>📍 Location</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#f5f0e8" }}>{b.city}</div>
                      <div style={{ fontSize: 11, color: "#71717a", marginTop: 1 }}>{b.address}</div>
                    </div>
                    <div style={{ padding: "10px 14px", background: "#111" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>📞 Diner Contact</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#f5f0e8" }}>{b.dinerPhone}</div>
                      <div style={{ fontSize: 11, color: "#71717a", marginTop: 1 }}>{b.dinerEmail}</div>
                    </div>
                  </div>

                  {/* Dietary + notes */}
                  {(b.dietaryRestrictions.length > 0 || b.guestNote) && (
                    <div style={{ display: "grid", gridTemplateColumns: b.dietaryRestrictions.length > 0 && b.guestNote ? "1fr 1fr" : "1fr", gap: 1, background: "#1a1a1a", borderTop: "1px solid #1a1a1a" }}>
                      {b.dietaryRestrictions.length > 0 && (
                        <div style={{ padding: "10px 14px", background: "#111" }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "#C87E7E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>⚠️ Dietary Restrictions</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {b.dietaryRestrictions.map(r => (
                              <span key={r} style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "#C87E7E18", border: "1px solid #C87E7E44", color: "#C87E7E" }}>{r}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {b.guestNote && (
                        <div style={{ padding: "10px 14px", background: "#111" }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>💬 Guest Note</div>
                          <div style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5, fontStyle: "italic" }}>{b.guestNote}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review — completed only */}
                  {b.status === "completed" && b.rating && (
                    <div style={{ padding: "10px 14px", borderTop: "1px solid #1a1a1a", background: "#111" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>⭐ Diner Review</div>
                      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{ color: i < b.rating! ? "#facc15" : "#27272a", fontSize: 13 }}>★</span>
                        ))}
                      </div>
                      {b.reviewText && <div style={{ fontSize: 12, color: "#a1a1aa", fontStyle: "italic" }}>{b.reviewText}</div>}
                    </div>
                  )}

                  {/* Actions */}
                  {b.status === "upcoming" && (
                    <div style={{ padding: "12px 14px", borderTop: "1px solid #1a1a1a", display: "flex", gap: 8, background: "#0a0a0a" }}>
                      <button style={{ padding: "8px 16px", borderRadius: 8, background: "#141414", border: "1px solid #27272a", color: "#a1a1aa", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                        Message Diner
                      </button>
                      <button style={{ padding: "8px 16px", borderRadius: 8, background: "#C87E7E18", border: "1px solid #C87E7E44", color: "#C87E7E", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── List view ──────────────────────────────────────────────────────── */}
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#f5f0e8", fontFamily: "var(--font-playfair)", margin: "0 0 14px" }}>
        All Bookings
      </h2>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {(["all", "upcoming", "completed", "cancelled"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${filter === f ? "#C8A97E" : "#2a2a2a"}`,
              background: filter === f ? "#C8A97E18" : "transparent",
              color: filter === f ? "#C8A97E" : "#71717a",
              fontFamily: "'DM Sans', sans-serif",
            }}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            <span style={{ marginLeft: 6, background: "#1a1a1a", borderRadius: 99, padding: "1px 6px", fontSize: 10, color: "#71717a" }}>
              {f === "all" ? MOCK_BOOKINGS.length : MOCK_BOOKINGS.filter(b => b.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Booking rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {shown.map(booking => {
          const s = STATUS_COLORS[booking.status];
          const isOpen = expanded === booking.id;
          return (
            <div key={booking.id} style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 14, overflow: "hidden" }}>
              <div
                style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}
                onClick={() => setExpanded(isOpen ? null : booking.id)}
              >
                <div style={{ width: 48, height: 48, borderRadius: 10, background: s.bg, border: `1px solid ${s.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#ffffff", textTransform: "uppercase" }}>{booking.date.split(" ")[0]}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>{booking.date.split(" ")[1]}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, color: "#f5f0e8", fontSize: 14 }}>{booking.diner}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#71717a" }}>{booking.date} · {booking.time} · {booking.guests} guests · {booking.cuisine} · 📍 {booking.city}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: "#C8A97E", fontSize: 16 }}>${booking.total}</div>
                  <div style={{ fontSize: 10, color: "#52525b", marginTop: 2 }}>{isOpen ? "▲" : "▼"}</div>
                </div>
              </div>

              {isOpen && (() => {
                const s = STATUS_COLORS[booking.status];
                const payColors: Record<string, string> = { paid: "#7EC87E", pending: "#C8A97E", refunded: "#C87E7E" };
                return (
                  <div style={{ borderTop: "1px solid #141414", background: "#0c0c0c" }}>
                    {/* Detail grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#1a1a1a" }}>
                      {[
                        { label: "Confirmation", value: `#${booking.confirmationNumber}` },
                        { label: "Time", value: booking.time },
                        { label: "Payment", value: booking.paymentStatus === "paid" ? "✓ Paid" : booking.paymentStatus === "pending" ? "⏳ Pending" : "↩ Refunded", color: payColors[booking.paymentStatus] },
                        { label: "Menu", value: booking.menuName },
                        { label: "Courses", value: `${booking.courses} courses` },
                        { label: "Price / person", value: `$${booking.pricePerPerson}` },
                      ].map(({ label, value, color }) => (
                        <div key={label} style={{ padding: "10px 14px", background: "#111" }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{label}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: color ?? "#f5f0e8" }}>{value}</div>
                        </div>
                      ))}
                    </div>
                    {/* Location + contact */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#1a1a1a", borderTop: "1px solid #1a1a1a" }}>
                      <div style={{ padding: "10px 14px", background: "#111" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>📍 Address</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#f5f0e8" }}>{booking.city}</div>
                        <div style={{ fontSize: 11, color: "#71717a", marginTop: 1 }}>{booking.address}</div>
                      </div>
                      <div style={{ padding: "10px 14px", background: "#111" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>📞 Contact</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#f5f0e8" }}>{booking.dinerPhone}</div>
                        <div style={{ fontSize: 11, color: "#71717a", marginTop: 1 }}>{booking.dinerEmail}</div>
                      </div>
                    </div>
                    {/* Dietary + notes */}
                    {(booking.dietaryRestrictions.length > 0 || booking.guestNote) && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#1a1a1a", borderTop: "1px solid #1a1a1a" }}>
                        {booking.dietaryRestrictions.length > 0 && (
                          <div style={{ padding: "10px 14px", background: "#111" }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "#C87E7E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>⚠️ Dietary</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {booking.dietaryRestrictions.map(r => (
                                <span key={r} style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "#C87E7E18", border: "1px solid #C87E7E44", color: "#C87E7E" }}>{r}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {booking.guestNote && (
                          <div style={{ padding: "10px 14px", background: "#111" }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>💬 Note</div>
                            <div style={{ fontSize: 12, color: "#a1a1aa", fontStyle: "italic", lineHeight: 1.5 }}>{booking.guestNote}</div>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Review */}
                    {booking.status === "completed" && booking.rating && (
                      <div style={{ padding: "10px 14px", borderTop: "1px solid #1a1a1a", background: "#111" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>⭐ Diner Review</div>
                        <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} style={{ color: i < booking.rating! ? "#facc15" : "#27272a", fontSize: 13 }}>★</span>
                          ))}
                        </div>
                        {booking.reviewText && <div style={{ fontSize: 12, color: "#a1a1aa", fontStyle: "italic" }}>{booking.reviewText}</div>}
                      </div>
                    )}
                    {/* Actions */}
                    {booking.status === "upcoming" && (
                      <div style={{ padding: "12px 16px", borderTop: "1px solid #1a1a1a", display: "flex", gap: 8, background: "#0a0a0a" }}>
                        <button style={{ padding: "8px 16px", borderRadius: 8, background: "#141414", border: "1px solid #27272a", color: "#a1a1aa", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          Message Diner
                        </button>
                        <button style={{ padding: "8px 16px", borderRadius: 8, background: "#C87E7E18", border: "1px solid #C87E7E44", color: "#C87E7E", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
