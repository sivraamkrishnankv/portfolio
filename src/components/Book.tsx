import { bookHref, bookProps } from "@/lib/booking";

export function Book({ className = "btn", children = "Book a 30-min call" }: { className?: string; children?: React.ReactNode }) {
  return (
    <a className={className} href={bookHref} {...bookProps}>
      {children}
    </a>
  );
}
