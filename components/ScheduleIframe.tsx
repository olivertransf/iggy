"use client";

import { useEffect, useState } from "react";

const BASE_URL = "/Bell%20Schedule%20Graphic/schedule-fit.html";

export default function ScheduleIframe() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const readTheme = () =>
      document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(readTheme());
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <iframe
      src={`${BASE_URL}?theme=${theme}`}
      title="Bell schedule"
      className="w-full h-full min-h-[260px] sm:min-h-[400px] border-0"
    />
  );
}
