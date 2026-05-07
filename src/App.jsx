import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import ViewportFrame from './components/ViewportFrame.jsx';

import Home from './pages/Home.jsx';
import Emprendimientos from './pages/Emprendimientos.jsx';
import Ceiba from './pages/Ceiba.jsx';
import Studio from './pages/Studio.jsx';
import Ecos from './pages/Ecos.jsx';

gsap.registerPlugin(ScrollTrigger);

const CRITICAL_ASSETS = [
  '/assets/images/hero-bg.webp',
  '/assets/images/colibri.webp',
  '/assets/images/gallery-1.webp',
  '/assets/images/gallery-2.webp',
  '/assets/images/gallery-3.webp',
  '/assets/images/gallery-4.webp',
  '/assets/images/gallery-5.webp',
  '/assets/images/gallery-6.webp',
  '/assets/images/gallery-7.webp',
  '/assets/images/gallery-8.webp',
  '/assets/images/gallery-9.webp',
  '/assets/images/500-line-bg.webp',
  '/assets/images/ceiba-line-bg.webp',
  '/assets/images/studio-line-bg.webp',
  '/assets/images/ecos-line.webp',
  '/assets/images/ecos-bg.webp',
  '/assets/images/ecos-subject.webp',
  '/assets/regenera/bg-regenera.webp',
  '/assets/regenera/people-regen.webp',
  '/assets/regenera/regenera-poster.webp',
  '/assets/CEIBA/bg-ceiba.webp',
  '/assets/CEIBA/lina-subject.webp',
  '/assets/Studio/bg-studio.webp',
  '/assets/Studio/subject-studio.webp',
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = async () => {
      try {
        if (image.decode) await image.decode();
      } catch {
        // Ignore decode failures; the browser can still paint the loaded asset.
      }
      resolve();
    };
    image.onerror = resolve;
    image.src = src;
  });
}

export default function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [frameVisible, setFrameVisible] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const isInitialMount = useRef(true);
  const displayPathRef = useRef(location.pathname);
  const pageRef = useRef(null);
  const routeTimelineRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const loader = document.getElementById('boot-loader');
    const ring = loader?.querySelector('.ring-progress');
    const logo = loader?.querySelector('img');
    const progress = { value: 0 };

    const setProgress = (value) => {
      gsap.to(progress, {
        value,
        duration: 0.42,
        ease: 'power2.out',
        onUpdate: () => {
          if (ring) ring.style.strokeDashoffset = String(283 - (283 * progress.value));
        },
      });
    };

    async function boot() {
      if (loader) {
        gsap.set(ring, { strokeDashoffset: 283 });
        gsap.fromTo(logo, { scale: 0.82, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.75, ease: 'back.out(1.7)' });
      }

      let loaded = 0;
      const total = CRITICAL_ASSETS.length + 1;
      const markLoaded = () => {
        loaded += 1;
        setProgress(Math.min(loaded / total, 0.98));
      };

      const fontTask = (document.fonts?.ready || Promise.resolve()).then(markLoaded, markLoaded);
      const assetTasks = CRITICAL_ASSETS.map((src) => preloadImage(src).then(markLoaded, markLoaded));

      await Promise.race([
        Promise.all([Promise.allSettled([...assetTasks, fontTask]), wait(1050)]),
        wait(3600),
      ]);

      if (cancelled) return;
      setProgress(1);
      setAppReady(true);
      requestAnimationFrame(() => ScrollTrigger.refresh());
      sessionStorage.setItem('app-initialized', 'true');

      if (loader) {
        gsap.timeline({ defaults: { ease: 'power3.inOut' } })
          .to(logo, { scale: 1.16, duration: 0.35 }, 0)
          .to(loader, { autoAlpha: 0, duration: 0.78 }, 0.12)
          .add(() => {
            loader.classList.add('is-hidden');
            gsap.set(loader, { clearProps: 'all' });
          })
          .add(() => {
          if (loader.parentNode) loader.remove();
          }, '+=0.05');
      }
    }

    boot();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (location.pathname === displayPathRef.current) return;

    const page = pageRef.current;
    if (!page) {
      displayPathRef.current = location.pathname;
      setDisplayLocation(location);
      return;
    }

    routeTimelineRef.current?.kill();
    setFrameVisible(false);

    const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    routeTimelineRef.current = timeline;
    timeline
      .to(page, {
        autoAlpha: 0,
        duration: 0.22,
      })
      .add(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        displayPathRef.current = location.pathname;
        setDisplayLocation(location);
      })
      .add(() => {
        routeTimelineRef.current = null;
        ScrollTrigger.refresh();
      });

    return () => {
      if (routeTimelineRef.current === timeline) timeline.kill();
    };
  }, [location]);

  useLayoutEffect(() => {
    if (!pageRef.current) return;

    gsap.fromTo(
      pageRef.current,
      {
        autoAlpha: appReady ? 0 : 1,
      },
      {
        autoAlpha: 1,
        duration: appReady ? 0.42 : 0,
        ease: 'power2.out',
        onComplete: () => ScrollTrigger.refresh(),
      }
    );
  }, [appReady, displayLocation.pathname]);

  /* ── Keep route-level layout measurements fresh without killing page triggers ── */
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) return;

    const id = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 420);

    return () => clearTimeout(id);
  }, [displayLocation.pathname, location.pathname]);

  return (
    <>
      <Nav />
      <ViewportFrame visible={frameVisible} />

      <div key={displayLocation.pathname} className="page-shell" ref={pageRef}>
        <Routes location={displayLocation}>
          <Route path="/" element={<Home appReady={appReady} />} />
          <Route
            path="/emprendimientos"
            element={<Emprendimientos onFrameToggle={setFrameVisible} />}
          />
          <Route path="/ceiba" element={<Ceiba />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/ecos" element={<Ecos />} />
          <Route path="*" element={<Home appReady={appReady} />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}
