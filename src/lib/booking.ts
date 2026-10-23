import { person } from "@/content";

// The Cal.com event path behind "Book a 30-min call". NEXT_PUBLIC_CAL_LINK overrides it; set it to an
// empty string to fall back to a pre-filled email instead.
export const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "siv-raam-krishnan-k-v/30min";

export const bookHref = CAL_LINK
  ? `https://cal.com/${CAL_LINK}`
  : `mailto:${person.email}?subject=${encodeURIComponent("30-min call")}&body=${encodeURIComponent("Hi Siv, I'd like to book a 30-minute call. Times that work for me: ")}`;

export const bookProps = CAL_LINK
  ? { "data-cal-link": CAL_LINK, "data-cal-config": '{"layout":"month_view","theme":"dark"}' }
  : {};
