import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const STORAGE_KEY = 'vs-intro-seen';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const shouldPlayIntro = (pathname) => {
  if (pathname !== '/') return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== '1';
  } catch {
    return true;
  }
};

const GeometricFrame = () => (
  <svg
    className="landing-geometry"
    viewBox="0 0 400 400"
    aria-hidden="true"
    fill="none"
  >
    <rect className="geo-line geo-outer" x="48" y="48" width="304" height="304" />
    <rect className="geo-line geo-diamond" x="100" y="100" width="200" height="200" />
    <circle className="geo-line geo-circle" cx="200" cy="200" r="118" />
    <line className="geo-line geo-axis" x1="200" y1="28" x2="200" y2="372" />
    <line className="geo-line geo-axis geo-axis-h" x1="28" y1="200" x2="372" y2="200" />
    <line className="geo-line geo-diag" x1="72" y1="72" x2="328" y2="328" />
    <line className="geo-line geo-diag geo-diag-2" x1="328" y1="72" x2="72" y2="328" />
    <circle className="geo-dot" cx="200" cy="48" r="3" />
    <circle className="geo-dot" cx="200" cy="352" r="3" />
    <circle className="geo-dot" cx="48" cy="200" r="3" />
    <circle className="geo-dot" cx="352" cy="200" r="3" />
  </svg>
);

const LandingIntro = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(() => shouldPlayIntro(pathname));
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!visible) return undefined;

    const reduced = prefersReducedMotion();
    const holdMs = reduced ? 350 : 2100;
    const fadeMs = reduced ? 200 : 500;

    document.body.classList.add('intro-lock');

    const exitTimer = setTimeout(() => setExiting(true), holdMs);
    const doneTimer = setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* ignore */
      }
      setVisible(false);
      document.body.classList.remove('intro-lock');
    }, holdMs + fadeMs);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.classList.remove('intro-lock');
    };
  }, [visible]);

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setExiting(true);
    window.setTimeout(() => {
      setVisible(false);
      document.body.classList.remove('intro-lock');
    }, prefersReducedMotion() ? 150 : 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`landing-intro ${exiting ? 'is-exiting' : ''}`}
      role="dialog"
      aria-label="VastuSoundarya"
      aria-modal="true"
      onClick={dismiss}
    >
      <div className="landing-intro-inner">
        <GeometricFrame />
        <div className="landing-logo-wrap">
          <BrandLogo size="intro" priority />
        </div>
      </div>
    </div>
  );
};

export default LandingIntro;
