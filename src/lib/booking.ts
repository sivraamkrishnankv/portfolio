import { person } from "@/content";

// Set NEXT_PUBLIC_CAL_LINK to the Cal.com event path, e.g. "sivraam/30min".
// Until it is set, "Book a 30-min call" opens an email with the request filled in.
export const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "";

export const bookHref = CAL_LINK
  ? `https://cal.com/${CAL_LINK}`
  : `mailto:${person.email}?subject=${encodeURIComponent("30-min call")}&body=${encodeURIComponent("Hi Siv, I'd like to book a 30-minute call. Times that work for me: ")}`;

export const bookProps = CAL_LINK
  ? { "data-cal-link": CAL_LINK, "data-cal-config": '{"layout":"month_view","theme":"dark"}' }
  : {};
