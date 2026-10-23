"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Marks [data-reveal] elements with .in as they scroll into view, so headings rise and cards
// stagger in. The hidden start state applies only under html.js, which an inline script in
// <head> sets before first paint (never with reduced motion). If this component never runs,
// that script takes .js off again after a few seconds, so nothing can stay hidden.
export const revealBoot = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__reveal)d.classList.remove('js')},3000)}catch(e){}})();`;

export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    (window as unknown as { __reveal: boolean }).__reveal = true;
    if (!document.documentElement.classList.contains("js")) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );
    document.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
