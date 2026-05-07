/**
 * Lightweight glass frame.
 *
 * The original LiquidGlass/WebGL surface looked great, but keeping several of
 * those layers fixed or inside pinned scroll sections made route changes and
 * back-scrolls stutter badly. This keeps the same layout API with a CSS glass
 * surface that is cheap for the compositor.
 */
export default function GlassFrame({
  children,
  cornerRadius = 999,
  padding = '0px',
  className = '',
  contentClassName = '',
  style = {},
  display = 'inline-block',
  displacementScale = 60,
  blurAmount = 0.08,
  saturation = 130,
  aberrationIntensity = 1.4,
  elasticity = 0.18,
  mode = 'standard',
}) {
  const radius = typeof cornerRadius === 'number' ? `${cornerRadius}px` : cornerRadius;
  const innerStyle = { padding, borderRadius: radius };

  return (
    <div
      className={`glass-frame glass-frame--css ${className}`}
      style={{
        position: 'relative',
        display,
        isolation: 'isolate',
        borderRadius: radius,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        className={`glass-frame__content glass-frame__content--static ${contentClassName}`}
        style={{
          ...innerStyle,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
}
