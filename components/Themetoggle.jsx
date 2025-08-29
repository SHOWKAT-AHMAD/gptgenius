'use client'
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import { useEffect, useState } from 'react';

const THEMES = {
  WINTER: 'winter',
  DRACULA: 'dracula',
};

const STORAGE_KEY = 'theme';
const COOKIE_NAME = 'theme';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function writeThemeCookie(value) {
  try {
    document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch (e) {
    // ignore cookie errors
  }
}

const Themetoggle = () => {
  // null = not initialized yet (avoid running any browser API in render)
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    // Run only on client after mount
    try {
      // Prefer document attribute (set by server or pre-hydration script),
      // then localStorage, then OS preference, then fallback.
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr) {
        setTheme(attr);
        // ensure document matches state (defensive)
        document.documentElement.setAttribute('data-theme', attr);
        return;
      }

      let saved = null;
      try {
        saved = localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        saved = null;
      }

      if (saved) {
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
        return;
      }

      const prefersDark =
        typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      const initial = prefersDark ? THEMES.DRACULA : THEMES.WINTER;
      setTheme(initial);
      document.documentElement.setAttribute('data-theme', initial);
      try {
        writeThemeCookie(initial);
      } catch (e) {}
    } catch (e) {
      // If anything goes wrong, fallback to winter and avoid throwing
      try {
        setTheme(THEMES.WINTER);
        document.documentElement.setAttribute('data-theme', THEMES.WINTER);
      } catch (err) {}
    }
  }, []);

  const toggleTheme = () => {
    if (!theme) return;
    const next = theme === THEMES.WINTER ? THEMES.DRACULA : THEMES.WINTER;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
    try {
      document.documentElement.setAttribute('data-theme', next);
    } catch (e) {}
    writeThemeCookie(next);
    setTheme(next);
  };

  // Wait until the client has resolved the theme to avoid render-time exceptions
  if (theme === null) return null;

  return (
    <button className="btn btn-sm btn-outline" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === THEMES.WINTER ? <BsMoonFill className="h-4 w-4" /> : <BsSunFill className="h-4 w-4" />}
    </button>
  );
};

export default Themetoggle;