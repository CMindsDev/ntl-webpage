import { NavLink } from 'react-router-dom';
import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import GlassFrame from './GlassFrame.jsx';

const links = [
  { to: '/',                 label: 'Inicio',          mobileLabel: 'Inicio',   icon: '/assets/icons/Navbar.svg',             iconWidth: 18, iconHeight: 18 },
  { to: '/emprendimientos',  label: 'Emprendimiento',  mobileLabel: 'Empresas', icon: '/assets/icons/nav-emprendimiento.svg', iconWidth: 20, iconHeight: 20 },
  { to: '/ceiba',            label: 'CEIBA',            mobileLabel: 'CEIBA',    icon: '/assets/icons/nav-ceiba.svg',          iconWidth: 30, iconHeight: 17 },
  { to: '/studio',           label: 'Studio',           mobileLabel: 'Studio',   icon: '/assets/icons/nav-studio.svg',         iconWidth: 19, iconHeight: 18 },
  { to: '/ecos',             label: 'Ecos',             mobileLabel: 'Ecos',     icon: '/assets/icons/nav-ecos.svg',           iconWidth: 18, iconHeight: 19 },
];

export default function Nav() {
  const location = useLocation();
  const pillRef = useRef(null);
  const indicatorRef = useRef(null);

  useLayoutEffect(() => {
    const pill = pillRef.current;
    const indicator = indicatorRef.current;
    if (!pill || !indicator) return;

    const updateIndicator = () => {
      const active = pill.querySelector('.nav-link.active');
      const activeText = active?.querySelector('.nav-text--desktop');
      if (!active || !activeText) return;
      const icon = indicator.querySelector('img');
      const iconWidth = Number(active.dataset.iconWidth) || 18;
      const iconHeight = Number(active.dataset.iconHeight) || 18;
      if (icon && icon.getAttribute('src') !== active.dataset.icon) {
        icon.setAttribute('src', active.dataset.icon);
      }

      const pillBox = pill.getBoundingClientRect();
      const textBox = activeText.getBoundingClientRect();
      const iconX = textBox.left - pillBox.left - iconWidth - 10;
      const iconY = textBox.top - pillBox.top + (textBox.height - iconHeight) / 2;

      gsap.to(indicator, {
        x: iconX,
        y: iconY,
        width: iconWidth,
        height: iconHeight,
        autoAlpha: 1,
        scale: 1,
        rotate: 0,
        duration: 0.62,
        ease: 'expo.out',
      });

      gsap.fromTo(
        indicator.querySelector('img'),
        { scale: 0.78, rotate: -12 },
        { scale: 1, rotate: 0, duration: 0.48, ease: 'back.out(1.8)' }
      );
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [location.pathname]);

  return (
    <nav className="glass-nav">
      <div className="nav-inner">

        {/* Logo cell — left column */}
        <NavLink to="/" className="nav-logo-cell" aria-label="NaturaTech LAC Home">
          <GlassFrame
            cornerRadius={999}
            className="nav-logo-glass"
            displacementScale={50}
            blurAmount={0.07}
            saturation={140}
            aberrationIntensity={1.2}
            elasticity={0.25}
          >
            <div className="nav-logo-inner">
              <img src="/assets/images/logo.svg" alt="" width="30" height="27" />
            </div>
          </GlassFrame>
        </NavLink>

        {/* Pill cell — centered column */}
        <div className="nav-pill-cell">
          <GlassFrame
            cornerRadius={999}
            className="nav-pill-glass"
            displacementScale={26}
            blurAmount={1}
            saturation={130}
            aberrationIntensity={1.5}
            elasticity={0.2}
          >
            <div className="nav-pill" ref={pillRef}>
              <span className="nav-active-indicator" ref={indicatorRef} aria-hidden="true">
                <img src="/assets/icons/Navbar.svg" alt="" />
              </span>
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  data-icon={l.icon}
                  data-icon-width={l.iconWidth}
                  data-icon-height={l.iconHeight}
                  className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                >
                  <span className="nav-mobile-icon" aria-hidden="true">
                    <img src={l.icon} alt="" width={l.iconWidth} height={l.iconHeight} />
                  </span>
                  <span className="nav-text nav-text--desktop">{l.label}</span>
                  <span className="nav-text nav-text--mobile">{l.mobileLabel}</span>
                </NavLink>
              ))}
            </div>
          </GlassFrame>
        </div>

        <div className="nav-spacer-cell" />
      </div>
    </nav>
  );
}
