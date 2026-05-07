import GlassFrame from './GlassFrame.jsx';

/**
 * SafeLiquidGlass keeps the older call sites readable while GlassFrame handles
 * the lightweight CSS glass surface.
 */
export default function SafeLiquidGlass({
  children,
  cornerRadius = 28,
  padding = '0px',
  className = '',
  displacementScale = 50,
  blurAmount = 0.08,
  saturation = 130,
  aberrationIntensity = 1.4,
  elasticity = 0.18,
  ...rest
}) {
  return (
    <GlassFrame
      cornerRadius={cornerRadius}
      padding={padding}
      className={className}
      displacementScale={displacementScale}
      blurAmount={blurAmount}
      saturation={saturation}
      aberrationIntensity={aberrationIntensity}
      elasticity={elasticity}
      {...rest}
    >
      {children}
    </GlassFrame>
  );
}
