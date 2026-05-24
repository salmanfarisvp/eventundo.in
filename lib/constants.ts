export const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
] as const;

export type KeralaDistrict = (typeof KERALA_DISTRICTS)[number];

export const EVENT_CATEGORIES = [
  "Festival",
  "Exhibition",
  "Tech",
  "Sports",
  "Music",
  "Food & Drink",
  "Arts & Culture",
  "Workshop",
  "Local Fest",
  "Community",
  "Health & Wellness",
  "Education",
  "Other",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
