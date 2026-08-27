"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} mode`
          : "Switch colour mode"
      }
      className="flex h-9 w-9 items-center justify-center border border-line text-t2 transition-colors duration-300 hover:border-line2 hover:text-t1"
    >
      {/* Render nothing icon-wise until mounted so the two themes can't
          disagree during hydration. */}
      {mounted ? (
        isDark ? (
          <Sun size={14} strokeWidth={1.5} />
        ) : (
          <Moon size={14} strokeWidth={1.5} />
        )
      ) : (
        <span className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
