---
name: PetalBird Premium
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#414755'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc1'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0070eb'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#006685'
  on-secondary: '#ffffff'
  secondary-container: '#00c4fd'
  on-secondary-container: '#004d66'
  tertiary: '#9e3d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c64f00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#bfe9ff'
  secondary-fixed-dim: '#6dd2ff'
  on-secondary-fixed: '#001f2a'
  on-secondary-fixed-variant: '#004d65'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb595'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7c2e00'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  accent-gradient-start: '#007AFF'
  accent-gradient-end: '#00C6FF'
  surface-glass: rgba(255, 255, 255, 0.7)
  deep-onyx: '#111111'
  glass-border: rgba(255, 255, 255, 0.4)
  success-green: '#22c55e'
  error-red: '#ba1a1a'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 24px
  base: 8px
  gutter: 16px
  card-gap: 20px
---

## Brand & Style
PetalBird embodies a "Premium Social" aesthetic, blending high-end fashion editorial vibes with modern social networking. The brand personality is optimistic, aspirational, and sophisticated.

The visual style is a refined mix of **Glassmorphism** and **Modern Minimalism**. It utilizes translucent layers, vibrant accent gradients, and significant whitespace to create a light, airy, and high-key atmosphere. The interface should feel like a digital gallery—clean, polished, and focused on high-quality user content.

## Colors
The palette is anchored by a "Digital Azure" primary blue and a "Cyan Sky" secondary, often used together in a 135-degree linear gradient. 

The background is a soft, off-white (#f9f9f9) enhanced by subtle, large-scale radial gradients (15% opacity) in the corners to prevent a flat appearance. High-contrast elements use "Deep Onyx" for dark mode or specific high-impact overlays. Surfaces leverage varying levels of transparency and white-tints to maintain the glass effect without sacrificing legibility.

## Typography
The system uses a dual-font approach. **Montserrat** is reserved for high-impact display moments and headlines, providing a geometric, confident, and urban feel. **Inter** handles all functional, body, and label text, ensuring maximum legibility and a contemporary technical feel. 

Headlines use tight letter spacing and bold weights to command attention, while body text uses generous line heights for readability. Uppercase styling is applied to `label-caps` for categorical headers and secondary metadata.

## Layout & Spacing
The layout uses a **Fixed Grid** philosophy for desktop (max-width: 1280px) and a fluid, single-column model for mobile.

- **Desktop SideBar:** 64px width, fixed to the left.
- **Top Bar:** 80px height, fixed with a blur effect.
- **Grid:** A 12-column system is used within the main content area, with standard layouts splitting 8 columns for primary feed and 4 columns for secondary widgets.
- **Margins:** Consistent 24px padding on mobile containers, scaling to 32px or more on larger displays to maintain whitespace.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Ambient Shadows** rather than traditional rigid elevation.

1.  **Level 0 (Background):** Solid #f9f9f9 with ambient 15% opacity radial blurs.
2.  **Level 1 (Cards/Sidebar):** Semi-transparent white (rgba 255, 255, 255, 0.7) with a 20px backdrop blur. Borders are 1px semi-transparent white to simulate the edge of a glass pane.
3.  **Shadows:** Shadows are highly diffused and tinted with the primary blue color (e.g., `rgba(0, 122, 255, 0.08)`) to create a glowing, "light-filled" effect rather than a heavy, dark drop shadow.

## Shapes
The shape language is generous and friendly. 
- **Small Elements (Chips/Badges):** Fully rounded (Pill-shaped) to distinguish them as interactive or status indicators.
- **Medium Elements (Buttons/Inputs):** 12px (rounded-xl) for a premium, modern feel.
- **Large Elements (Cards/Sidebar):** 16px to 24px (rounded-2xl) to emphasize the soft, approachable nature of the interface.
- **Avatars:** Strictly circular (full) for user identity.

## Components

### Buttons
- **Primary (Gradient):** Uses the 135deg linear gradient from #007AFF to #00C6FF. Includes a 2px hover lift effect and a matching blue shadow.
- **Secondary (Outline):** White background with a 1px border using `primary/20`. 
- **Icon Buttons:** Circular or Rounded-xl with a 40x40px touch target, using semi-transparent backgrounds.

### Cards
- **Structure:** Always uses the `card-glass` style. Content is separated by a 1px `glass-border` top or bottom stroke for internal sectioning.
- **Imagery:** Profile images in cards should be high-key and professional, often occupying a full side of the card (40% width in horizontal layouts).

### Inputs
- **Search Bar:** Fully rounded (pill), high-height (48px), with a subtle `surface-container-low` fill. Focus states utilize a 2px primary-colored ring.

### Widgets & Lists
- **Leaderboards:** Use high-density rows with circular avatars and small, high-contrast rating badges.
- **Trending Grids:** Square aspect ratios for images with subtle 110% scale-on-hover animations.