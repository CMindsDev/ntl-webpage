import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Ecos() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set('.ecos-subject', { xPercent: -50 });

      gsap.to('.ecos-bg', {
        yPercent: 10,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: { trigger: '.ecos-hero', start: 'top top', end: 'bottom top', scrub: 0.25, fastScrollEnd: true },
      });
      gsap.to('.ecos-subject', {
        xPercent: -50,
        yPercent: 13,
        scale: 1.03,
        ease: 'none',
        scrollTrigger: { trigger: '.ecos-hero', start: 'top top', end: 'bottom top', scrub: 0.25, fastScrollEnd: true },
      });

      gsap.from('.ecos-content-inner', {
        y: 54,
        opacity: 0,
        duration: 1.05,
        delay: 0.16,
        ease: 'power3.out',
      });

      document.querySelectorAll('.ecos-letter').forEach((letter, index) => {
        const speed = parseFloat(letter.dataset.speed) || 1;
        gsap.fromTo(letter,
          { y: 70 * speed, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.88, delay: 0.08 + index * 0.035, ease: 'power3.out' }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="ecos-page">
      <section className="ecos-hero" aria-labelledby="ecos-title">
        <div className="ecos-bg-wrapper" aria-hidden="true">
          <img
            className="ecos-bg"
            src="/assets/images/ecos-bg.webp"
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="ecos-giant-text" aria-hidden="true">
          {'DECIDE'.split('').map((letter, index) => (
            <span key={`${letter}-${index}`} className="ecos-letter" data-speed={1 + index * 0.08}>{letter}</span>
          ))}
        </div>

        <div className="ecos-subject-wrapper" aria-hidden="true">
          <img className="ecos-subject" src="/assets/images/ecos-subject.webp" alt="" decoding="async" />
        </div>

        <div className="ecos-overlay" aria-hidden="true" />

        <div className="ecos-content">
          <div className="ecos-content-inner">
            <span className="ecos-header-label">
              <img src="/assets/programs-logos/ecos.svg" alt="" />
              Ecos
            </span>
            <h1 id="ecos-title" className="ecos-heading">
              <span>Valida</span>
              <span><em>&amp;</em> Co-Diseña</span>
            </h1>
            <p className="ecos-description">
              Presentamos ecos como nuestra plataforma de entrada al conocimiento más preciso desde informes hasta investigación y estado de la región en temas de economías, innovación y escalabilidad.
            </p>
            <Link to="/ecos" className="ecos-cta btn-glass btn-glass-sm" aria-label="Ir a Ecos">
              <span>✦</span>
              Ir a Ecos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
