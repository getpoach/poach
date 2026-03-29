export type Cuisine =
  | "French"
  | "Japanese"
  | "Italian"
  | "Mexican"
  | "Indian"
  | "West African"
  | "Fusion"
  | "Omakase"
  | "Pastry"
  | "Mediterranean"
  | "Kerala"
  | "Oaxacan";

export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface Chef {
  id: string;
  name: string;
  avatar: string;
  cuisine: Cuisine[];
  rating: number;
  reviewCount: number;
  bookingCount: number;
  price: number;
  bio: string;
  location: string;
  lat: number;
  lng: number;
  distance: string;
  available: Day[];
  specialty: string;
  color: string;
  experience: string;
  trained: string;
}

export interface Booking {
  id: string;
  chefId: string;
  chefName: string;
  chefColor: string;
  chefAvatar: string;
  specialty: string;
  day: Day;
  time: string;
  date: string;
  guests: number;
  total: number;
  status: "upcoming" | "completed" | "cancelled";
  note: string;
}

export interface Review {
  id: string;
  chefId: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}
