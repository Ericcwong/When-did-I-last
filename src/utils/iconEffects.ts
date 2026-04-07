import type { CSSProperties } from 'react';

/**
 * Returns CSS styles that make the task icon visually degrade
 * based on how overdue the task is.
 *
 * Fresh:   full color, slight glow, full size
 * Due:     desaturating, shrinking slightly
 * Overdue: grayscale, shrunken, cracked/dusty feel
 */
export function getIconStyles(percentElapsed: number): CSSProperties {
  const clamped = Math.min(percentElapsed, 1.5);

  // Saturation: 100% at 0, drops to 0% at 1.5
  const saturation = Math.max(0, 1 - clamped / 1.5);

  // Scale: 1.1 at fresh, shrinks to 0.75 at max overdue
  const scale = 1.1 - 0.35 * Math.min(clamped / 1.5, 1);

  // Brightness: bright when fresh, dims when overdue
  const brightness = clamped <= 0.5 ? 1.1 : 1.1 - 0.3 * ((clamped - 0.5) / 1.0);

  // Opacity: full when fresh, fades slightly when very overdue
  const opacity = clamped <= 1.0 ? 1 : 1 - 0.2 * ((clamped - 1.0) / 0.5);

  return {
    filter: `saturate(${saturation}) brightness(${brightness})`,
    transform: `scale(${scale})`,
    opacity,
    transition: 'filter 0.6s ease, transform 0.6s ease, opacity 0.6s ease',
  };
}

/**
 * Returns a subtle glow box-shadow for the icon container
 * based on urgency color. Only visible when task is fresh.
 */
export function getIconGlow(urgencyColor: string, percentElapsed: number): string {
  if (percentElapsed > 0.5) return 'none';
  const intensity = 1 - percentElapsed / 0.5;
  return `0 0 ${12 * intensity}px ${urgencyColor}`;
}

/**
 * Returns a small accent emoji that appears next to the main icon
 * when the task is overdue, for a bit of visual comedy.
 */
export function getDecayAccent(percentElapsed: number): string | null {
  if (percentElapsed < 1.0) return null;
  if (percentElapsed < 1.2) return '💨'; // dust
  if (percentElapsed < 1.4) return '🕸️'; // cobweb
  return '💀'; // oof
}
