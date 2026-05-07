import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Gallery images */
const galleryImages = [
  '/assets/Studio/studio-gallery-1.webp',
  '/assets/Studio/studio-gallery-2.webp',
  '/assets/Studio/studio-gallery-3.webp',
  '/assets/Studio/studio-gallery-4.webp',
  '/assets/Studio/studio-gallery-5.webp',
];

const portfolioProjects = [
  {
    name: 'regen',
    logo: 'regen',
    description: 'Iniciativa liderada e implementada por FabLab Perú, centro de innovación de desarrollo de bioeconomía en la Amazonía, en sociedad con BID Lab y Future of Earth de C Minds, en alianza con MIT Center for Bits and Atoms, y en colaboración con más de 4 comunidades indígenas incluyendo al pueblo Ashánika.',
  },
  {
    name: 'yakum',
    logo: 'yakum',
    description: 'Iniciativa liderada por Fundación Yakum - ONG que trabaja en la regeneración de bosques amazónicos, soberanía alimentaria y conservación cultural junto con comunidades indígenas -, en sociedad con BID Lab y C Minds, en alianza con Regen Network Development, implementada en Ecuador por la Nación Siekopai.',
  },
  {
    name: 'SeaFlower Wise',
    logo: 'seaflower',
    description: 'Iniciativa liderada por la Universidad de Manizales - en sociedad con BID Lab y Future of Earth de C Minds, e implementada en la Reserva Biosfera SeaFlower con AGROSAVIA, Comisión Colombiana de los Océanos (CCO), Universidad de Antioquia, Universidad Militar de Nueva Granada, UNAL, Universidad de la Amazonía, y la comunidad Raizal de San Andrés, Providencia y Santa Catalina.',
  },
  {
    name: 'mano cambiada',
    logo: 'mano',
    description: 'Iniciativa liderada e implementada por Mano Cambiada - organización comunitaria que integra tecnología con saberes ancestrales para el desarrollo sostenible - en sociedad con BID Lab y Future of Earth de C Minds, en alianza con Experimentalista, Fundación Macuáticos Colombia, Colectivo de Mujeres, Pininos de Amor, Guardianes del Mar, y Bichos del Mar.',
  },
  {
    name: 'LandPrint',
    logo: 'landprint',
    description: 'Iniciativa liderada e implementada por LandPrint, empresa de tecnología de monitoreo para la creación y gestión de activos ambientales digitales, en sociedad con BID Lab y Future of Earth de C Minds, en colaboración con Cacau Amazônia y productores locales de café en Brasil.',
  },
  {
    name: 'Nativas',
    logo: 'nativas',
    description: 'Iniciativa liderada por Nativas Climatech LLC, organización dedicada a la restauración de bosques tropicales secos con soluciones tecnológicas, y Ecohome, en sociedad con BID Lab y Future of Earth de C Minds, e implementada por Ecohome con comunidades de Cartama en el departamento de Antioquia en Colombia.',
  },
  {
    name: 'Awake',
    logo: 'awake',
    description: 'Iniciativa liderada e implementada por Awake Travel, empresa colombiana de turismo sostenible, en sociedad con BID Lab y Future of Earth de C Minds.',
  },
  {
    name: 'FUNDEMAR',
    logo: 'fundemar',
    description: 'Iniciativa liderada e implementada por FUNDEMAR, institución especializada en la implementación de sistemas de monitoreo marinos en el Caribe, en sociedad con BID Lab y Future of Earth de C Minds.',
  },
  {
    name: 'ASMUCACD',
    logo: 'asmucacd',
    description: 'Iniciativa liderada e implementada por la Asociación de Mujeres Campesinas Ambientalistas de La Cristalina del Lozada por sus Derechos (ASMUCACD), en sociedad con BID Lab y Future of Earth de C Minds, en alianza y colaboración con Paz y Flora S.A.S., organización que apoya el modelo de conservación liderado por ASMUCACD a través de soluciones basadas en la naturaleza.',
  },
  {
    name: 'ECA Amarakaeri',
    logo: 'eca-amarakaeri',
    description: 'Iniciativa liderada por el Ejecutor del Contrato de Administración Amarakaeri (ECA), organización indígena que gestiona la Reserva Comunal Amarakaeri, en sociedad con BID Lab y Future of Earth de C Minds.',
  },
  {
    name: 'Understory',
    logo: 'understory',
    description: 'Fondo de inversión enfocado en proyectos de restauración de ecosistemas con el uso de tecnología LiDAR, en sociedad con BID Lab y Future of Earth de C Minds, e implementada en México por Fundación Ejido de San Crisanto.',
  },
  {
    name: 'Savimbo',
    logo: 'savimbo',
    description: 'Iniciativa liderada e implementada por Savimbo S.A.S., empresa promotora de la agroforestería regenerativa vinculada con créditos de carbono y tecnología, en sociedad con BID Lab y Future of Earth de C Minds, y en alianza con Savimbo Inc.',
  },
];

const portfolioCards = portfolioProjects.map((project, index) => ({
  ...project,
  image: galleryImages[index % galleryImages.length],
}));

const portfolioColumns = [
  portfolioCards.filter((_, index) => index % 3 === 0),
  portfolioCards.filter((_, index) => index % 3 === 1),
  portfolioCards.filter((_, index) => index % 3 === 2),
];

const PORTFOLIO_COLUMN_REPEATS = 3;

export default function Studio() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set('.studio-subject', { xPercent: -50 });

      /* ─── HERO parallax ─── */
      gsap.to('.studio-bg', {
        yPercent: 12, ease: 'none',
        scrollTrigger: { trigger: '.studio-hero', start: 'top top', end: 'bottom top', scrub: 0.25, fastScrollEnd: true },
      });
      gsap.to('.studio-subject', {
        xPercent: -50, yPercent: 18, scale: 1.03, ease: 'none',
        scrollTrigger: { trigger: '.studio-hero', start: 'top top', end: 'bottom top', scrub: 0.25, fastScrollEnd: true },
      });

      /* Hero entrance */
      gsap.from('.studio-content-inner', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out',
      });

      document.querySelectorAll('.studio-letter').forEach((letter, i) => {
        const speed = parseFloat(letter.dataset.speed) || 1;
        gsap.fromTo(letter,
          { y: 80 * speed, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: 0.08 + i * 0.04,
            ease: 'power3.out',
          }
        );
      });

      /* ─── PORTFOLIO parallax ─── */
      gsap.from('.studio-gallery', {
        y: 36, opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.studio-gallery', start: 'top 86%', toggleActions: 'play none none none' },
      });

      gsap.from('.studio-project-card', {
        y: 34,
        opacity: 0,
        duration: 0.65,
        stagger: 0.045,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.studio-gallery', start: 'top 78%', toggleActions: 'play none none none' },
      });

      if (window.matchMedia('(min-width: 769px)').matches) {
        const columnLoopDistance = (selector) => {
          const column = document.querySelector(selector);
          if (!column) return Math.max(320, Math.min(560, window.innerHeight * 0.68));
          return column.scrollHeight / PORTFOLIO_COLUMN_REPEATS;
        };
        gsap.timeline({
          scrollTrigger: {
            trigger: '.studio-gallery',
            start: 'top top',
            end: () => `+=${Math.max(1500, window.innerHeight * 2.2)}`,
            pin: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
          .fromTo('.studio-portfolio-column--left', { y: () => -columnLoopDistance('.studio-portfolio-column--left') * 1.5 }, { y: () => -columnLoopDistance('.studio-portfolio-column--left') * 0.5, ease: 'none' }, 0)
          .fromTo('.studio-portfolio-column--middle', { y: () => -columnLoopDistance('.studio-portfolio-column--middle') * 0.5 }, { y: () => -columnLoopDistance('.studio-portfolio-column--middle') * 1.5, ease: 'none' }, 0)
          .fromTo('.studio-portfolio-column--right', { y: () => -columnLoopDistance('.studio-portfolio-column--right') * 1.5 }, { y: () => -columnLoopDistance('.studio-portfolio-column--right') * 0.5, ease: 'none' }, 0);
      }

      /* Stats reveal */
      document.querySelectorAll('.studio-stat').forEach((el, i) => {
        gsap.from(el, {
          y: 30, opacity: 0, duration: 0.6, delay: i * 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: '.studio-stats', start: 'top 85%', toggleActions: 'play none none none' },
        });
      });

      /* Main content section */
      gsap.from('.studio-main-image', {
        scale: 0.9, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.studio-main-content', start: 'top 75%', toggleActions: 'play none none none' },
      });

      gsap.from('.studio-main-text', {
        y: 40, opacity: 0, duration: 0.9, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.studio-main-content', start: 'top 72%', toggleActions: 'play none none none' },
      });

      /* Portfolio narrative */
      document.querySelectorAll('.studio-info-card, .studio-collage-img, .level-item').forEach((el, i) => {
        gsap.from(el, {
          y: 44, opacity: 0, duration: 0.75, delay: i * 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: '.studio-info-section', start: 'top 80%', toggleActions: 'play none none none' },
        });
      });

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {/* ════════════ HERO ════════════ */}
      <section className="studio-hero" id="studio-top">
        <div className="studio-bg-wrapper">
          <img src="/assets/Studio/bg-studio.webp" alt="" className="studio-bg" />
        </div>

        <div className="studio-giant-text" aria-hidden="true">
          {['E', 'S', 'C', 'A', 'L', 'A'].map((ch, i) => (
            <span key={i} className="giant-letter studio-letter" data-speed={[0.7, 0.9, 1.1, 0.8, 1.0, 0.85][i]}>{ch}</span>
          ))}
        </div>

        <div className="studio-subject-wrapper">
          <img src="/assets/Studio/subject-studio.webp" alt="Studio Subject" className="studio-subject" />
        </div>

        <div className="studio-overlay" aria-hidden="true" />

        <div className="studio-content">
          <div className="studio-content-inner">
            <div className="studio-header-label">
              <img src="/assets/Studio/studio-icon.svg" alt="" width="22" height="22" />
              STUDIO
            </div>
            <h1 className="studio-heading">
              <span className="studio-heading-line">Acciona</span>
              <span className="studio-heading-line studio-heading-accent"><span className="amp">&amp;</span> Co-crea</span>
            </h1>
            <p className="studio-description">
              Acompañamos a empresas que validan, demuestran cómo hacer negocios con empresarios y solucionadores desde los territorios.
            </p>
            <a href="#portfolio" className="btn-glass">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5,3 19,12 5,21" /></svg>
              Ver Portafolio
            </a>
          </div>

          <div className="studio-bottom-right">
            <div className="hero-scroll-indicator">
              <span>DESLIZAR</span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="#C8E632" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4L8 20M8 20L2 14M8 20L14 14" /></svg>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ GALLERY & PORTFOLIO ════════════ */}
      <section className="studio-gallery" id="portfolio">
        <div className="studio-portfolio-shell">
          <aside className="studio-portfolio-aside">
            <div className="studio-portfolio-copy">
              <div className="studio-stats">
                <p className="studio-stat">10 países de Latam</p>
                <p className="studio-stat">14 proyectos incubados</p>
                <p className="studio-stat">30% impacto en comunidades afro</p>
                <p className="studio-stat">50% tecnologías DMRV</p>
              </div>
              <h2>Portafolio de Soluciones</h2>
            </div>
          </aside>

          <div className="studio-gallery-grid">
            {portfolioColumns.map((columnProjects, columnIndex) => {
              const columnClass = ['left', 'middle', 'right'][columnIndex];
              return (
                <div key={columnClass} className={`studio-portfolio-column studio-portfolio-column--${columnClass}`}>
                  {Array.from({ length: PORTFOLIO_COLUMN_REPEATS }).flatMap((_, repeatIndex) => (
                    columnProjects.map((project) => (
                      <article
                        key={`${project.name}-${repeatIndex}`}
                        className={`studio-project-card${repeatIndex > 0 ? ' studio-project-card--clone' : ''}`}
                        aria-hidden={repeatIndex > 0 ? true : undefined}
                        aria-label={repeatIndex === 0 ? `${project.name}. ${project.description}` : undefined}
                      >
                        <img src={project.image} alt="" loading="eager" decoding="async" />
                        <div className="studio-project-overlay">
                          <h3>{project.name}</h3>
                          <span>Aprende más</span>
                        </div>
                      </article>
                    ))
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════ MAIN CONTENT ════════════ */}
      <section className="studio-main-content">
        <div className="studio-main-inner">
          <div className="studio-main-image">
            <img src="/assets/Studio/studio-gallery-1.webp" alt="Studio Work" />
          </div>
          <div className="studio-main-text">
            <h3>Un Portafolio de Lenguaje Común entre <span>(Tek)nologías</span></h3>
            <p>
              Financiamos, co-desarrollamos y probamos soluciones en territorio favorables para la naturaleza, bajo el liderazgo de nuestros socios con base en el territorio y de nuestros socios emprendedores.
            </p>
            <span className="studio-main-kicker">1.6M de invertidos en la naturaleza</span>
          </div>
        </div>
      </section>

      {/* ════════════ INFO SECTION ════════════ */}
      <section className="studio-info-section">
        <svg className="studio-info-map-line" xmlns="http://www.w3.org/2000/svg" width="650" height="972" viewBox="0 0 650 972" fill="none" aria-hidden="true">
          <path d="M1.99655 970.938L14.1287 757.283L47.7291 564.101L374.09 453.462L429.515 134.803L648.164 1.70846" stroke="#BCDD05" strokeOpacity="0.09" strokeWidth="4" strokeDasharray="8 8" />
        </svg>
        <div className="studio-info-inner">
          <div className="studio-info-card">
            <h4>Niveles Sistémicos</h4>
            <p>Nos permite visibilizar soluciones innovadoras y tangibles, crear kits de soluciones replicables, fortalecer la posición global de AI C como una región que impulsa transformaciones efectivas de abajo hacia arriba y conectarse con los mercados verdes globales.</p>
          </div>

          <div className="studio-info-card">
            <h4>Impacto Local</h4>
            <p>Genera un impacto tangible tanto en el número de hectáreas conservadas como en la mejora de las condiciones de vida de nuestros socios locales.</p>
          </div>
        </div>

        <div className="studio-solutions-lower">
          <div className="studio-collage" aria-hidden="true">
            <img src="/assets/Studio/studio-gallery-2.webp" alt="" className="studio-collage-img studio-collage-img--one" loading="eager" decoding="async" />
            <img src="/assets/Studio/studio-gallery-3.webp" alt="" className="studio-collage-img studio-collage-img--two" loading="eager" decoding="async" />
            <img src="/assets/Studio/studio-gallery-4.webp" alt="" className="studio-collage-img studio-collage-img--three" loading="eager" decoding="async" />
          </div>

          <div className="studio-levels">
            <h3>Tres niveles de apoyo para acceder de manera opcional</h3>
            <div className="studio-levels-grid">
              <div className="level-item">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M9 18.5C5.9 18.5 3.5 16.1 3.5 13C3.5 9.9 5.9 7.5 9 7.5C10.8 7.5 12.4 8.3 13.4 9.6M23 13.5C26.1 13.5 28.5 15.9 28.5 19C28.5 22.1 26.1 24.5 23 24.5C21.2 24.5 19.6 23.7 18.6 22.4M11 22.5C14.4 23.8 18.1 22 19.4 18.6M21 9.5C17.6 8.2 13.9 10 12.6 13.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p>Herramientas para generar confianza y potenciar el impacto</p>
              </div>
              <div className="level-item">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M5 23L12 16L17 21L27 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 10H27V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p>Capacidad de preparación financiera</p>
              </div>
              <div className="level-item">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M11 20C7.7 20 5 17.3 5 14S7.7 8 11 8C15.5 8 16.7 14 21 14C24.3 14 27 16.7 27 20S24.3 26 21 26C16.5 26 15.3 20 11 20Z" stroke="currentColor" strokeWidth="2" />
                </svg>
                <p>Capacidad de sostenibilidad</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
