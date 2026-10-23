import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Siv Raam Krishnan K.V",
    short_name: "Siv Raam",
    start_url: "/",
    display: "browser",
    background_color: "#0a0d14",
    theme_color: "#0a0d14",
    icons: [{ src: "/icon-512.png", sizes: "512x512", type: "image/png" }],
  };
}
