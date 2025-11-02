# Premium Coffee Website Design Guide

## Overview
This is a premium one-page website design inspired by Onyx Coffee Lab's refined aesthetic. The design emphasizes dark tones, high contrast, and sophisticated typography with subtle motion effects.

---

## Color Palette

### Primary Colors

#### Charcoal (Dark Base)
- **Charcoal 900**: `#0f0f0f` - Main background
- **Charcoal 800**: `#1a1a1a` - Section backgrounds, cards
- **Charcoal 700**: `#262626` - Borders, subtle elements
- **Charcoal 600**: `#404040` - Text secondary

#### Earth Tones (Muted Accents)
- **Earth 400**: `#b89d80` - Nutty/Earthy flavor profiles
- **Earth 300**: `#d4c0a8` - Spice flavor profiles
- Used for: Product cards, process indicators, earth-toned flavor notes

#### Rose (Pastel Accent)
- **Rose 400**: `#f472b6` - Fruity/Berry flavor profiles
- **Rose 300**: `#f9a8d4` - Floral flavor profiles
- Used for: Product cards, process timeline, fruity flavor notes

#### Gold (Warm Accent)
- **Gold 400**: `#fbbf24` - Caramel/Chocolate flavor profiles
- **Gold 300**: `#fcd34d` - Sweet flavor profiles
- Used for: Product ratings, process timeline, sweet flavor notes

### Text Colors
- **White**: `#ffffff` - Primary headings, high contrast text
- **White/90**: `rgba(255, 255, 255, 0.9)` - Navigation links
- **White/70**: `rgba(255, 255, 255, 0.7)` - Body text
- **White/60**: `rgba(255, 255, 255, 0.6)` - Secondary text
- **White/40**: `rgba(255, 255, 255, 0.4)` - Footer copyright

---

## Typography

### Font Families

#### Headings: Playfair Display (Serif)
- **Usage**: All h1, h2, h3, h4, h5, h6 elements
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Character**: Elegant, refined, premium
- **Letter Spacing**: -0.02em (tighter for premium feel)

#### Body: Inter (Sans-serif)
- **Usage**: Paragraphs, buttons, navigation, UI elements
- **Weights**: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Character**: Clean, modern, highly legible
- **Line Height**: 1.7 (body), 1.8 (paragraphs)

### Font Sizes
- **Hero Heading**: 5xl (3rem) → 7xl (4.5rem) → 8xl (6rem) - Responsive scaling
- **Section Headings**: 4xl (2.25rem) → 6xl (3.75rem)
- **Subheadings**: 2xl (1.5rem) → 3xl (1.875rem)
- **Body Text**: lg (1.125rem) → xl (1.25rem)
- **Small Text**: sm (0.875rem) → base (1rem)

### Typography Scale
- **Tracking (Letter Spacing)**:
  - Uppercase navigation: `tracking-wide`
  - Headings: Default with `-0.02em` via CSS
  - Body: Default

---

## Components & Style Guide

### Navigation Bar

#### Default State (Transparent)
- **Background**: Transparent
- **Height**: 80px (h-20)
- **Position**: Fixed top
- **Text Color**: White/90
- **Hover**: White
- **Logo**: "ONYX" in serif, 24px (text-2xl)

#### Scrolled State
- **Background**: `charcoal-900/95` with `backdrop-blur-md`
- **Shadow**: `shadow-lg`
- **Transition**: 300ms duration

#### Mobile Navigation
- **Menu Button**: Hamburger icon, converts to X when open
- **Background**: Inherits navbar background
- **Links**: Stack vertically, uppercase, tracking-wide

---

### Hero Section

#### Layout
- **Height**: 100vh (full viewport)
- **Image**: Full-width, parallax scroll effect
- **Overlay**: Gradient from `charcoal-900` (bottom) to `charcoal-900/40` (top)

#### Content
- **Position**: Centered, left-aligned on desktop
- **Heading**: 5xl → 8xl, white, serif, bold
- **Subheading**: xl → 2xl, white/80
- **CTAs**: Two buttons - primary (white bg) and secondary (outlined)

#### Animations
- **Entrance**: Fade in + slide up (0.8s duration)
- **Parallax**: Image moves slower than scroll (50% speed)
- **Scroll Indicator**: Animated bouncing arrow at bottom

---

### Buttons

#### Primary Button
```css
- Background: white
- Text: charcoal-900
- Padding: px-8 py-4
- Border Radius: rounded-full
- Font: semibold, tracking-wide
- Hover: bg-white/95, scale-105
- Transition: all 300ms
```

#### Secondary Button
```css
- Background: transparent
- Border: 2px solid white/60
- Text: white
- Padding: px-8 py-4
- Border Radius: rounded-full
- Font: semibold, tracking-wide
- Hover: bg-white/10, border-white
- Transition: all 300ms
```

#### Product Card Button
```css
- Primary: white bg, charcoal-900 text, rounded-full
- Secondary: border-2 border-white/20, white text, rounded-full
- Hover: subtle scale and background change
```

---

### Product Cards

#### Container
- **Background**: `charcoal-900`
- **Border**: `charcoal-700` → `charcoal-600` on hover
- **Border Radius**: `rounded-2xl`
- **Padding**: `p-6`
- **Hover**: Lift effect (y: -8px)

#### Image Section
- **Aspect Ratio**: 4:3
- **Overlay**: Gradient from `charcoal-900` (bottom) to transparent
- **Hover**: Scale image 110% (duration: 700ms)
- **Flavor Indicator**: 64px circle, positioned top-right, color-coded

#### Content
- **Heading**: 2xl, serif, semibold, white
- **Description**: white/60, line-clamp-2
- **Price**: 3xl, bold, white
- **Rating**: Gold stars (400 color)

#### Flavor Color Coding
- **Rose 400**: Fruity/Berry notes
- **Earth 400**: Nutty/Earthy notes
- **Gold 400**: Caramel/Chocolate notes
- **Rose 300**: Floral notes
- **Earth 300**: Spice notes
- **Gold 300**: Sweet notes

---

### Section Animations

#### Scroll-Triggered Animations
- **Trigger**: Section enters viewport (20% visible)
- **Effect**: Fade in + slide up (opacity: 0→1, y: 40px→0)
- **Duration**: 0.6s - 0.8s
- **Stagger**: Product cards delay by 0.1s each

#### Image Hover Effects
- **Scale**: 110% on hover
- **Transition**: 700ms ease
- **Use**: Product images, story grid images, process images

---

### Process Timeline

#### Layout
- **Vertical Timeline**: Centered line with gradient (rose → earth → gold)
- **Items**: Alternate left/right positioning
- **Timeline Dot**: White circle, 16px, centered on line

#### Content Cards
- **Background**: `charcoal-800`
- **Border**: `charcoal-700`
- **Border Radius**: `rounded-2xl`
- **Padding**: `p-8`
- **Heading**: 3xl, serif, bold, white
- **Description**: white/70, leading-relaxed

#### Image
- **Aspect Ratio**: 4:3
- **Border Radius**: `rounded-2xl`
- **Hover**: Scale 110%

---

### Footer

#### Background
- **Color**: `charcoal-900`
- **Border Top**: `charcoal-800`

#### Layout
- **Grid**: 1 column (mobile) → 4 columns (desktop)
- **Brand Section**: Spans 2 columns on desktop
- **Links**: Organized in columns

#### Typography
- **Brand**: 3xl, serif, bold
- **Section Headings**: lg, serif, semibold
- **Links**: white/60 → white on hover

#### Social Icons
- **Container**: 40px circle
- **Border**: white/20
- **Hover**: bg-white/10
- **Icon Size**: 20px

#### Bottom Bar
- **Border Top**: `charcoal-800`
- **Copyright**: white/40, text-sm
- **Links**: white/40 → white/60 on hover

---

## Responsive Design

### Breakpoints (Tailwind Defaults)
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Mobile Adaptations

#### Navigation
- Hamburger menu replaces desktop links
- Full-width mobile menu
- Reduced padding

#### Hero
- Text sizes scale down (5xl → 3xl)
- Buttons stack vertically
- Image scales appropriately

#### Product Cards
- Single column layout
- Full-width cards
- Reduced padding

#### Process Timeline
- Single column (no alternation)
- Timeline line on left
- Images stack below content

#### Typography
- Headings: Reduce by 2-3 sizes
- Body: Slightly smaller
- Maintain line-height ratios

---

## Animation Guidelines

### Performance
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Limit concurrent animations

### Scroll Animations
- **Parallax**: Use `useScroll` and `useTransform` from Framer Motion
- **Fade-in**: Trigger on viewport entry (Intersection Observer)
- **Stagger**: Delay child animations by 0.1s increments

### Micro-interactions
- **Hover**: Subtle scale (1.05-1.1)
- **Buttons**: Scale + background change
- **Cards**: Lift effect (-8px)
- **Images**: Slow scale (110%, 700ms)

---

## Implementation Notes

### Scroll Behavior
- Smooth scrolling enabled via CSS
- Anchor links use smooth scroll
- Navigation highlights active section

### Image Optimization
- Use high-quality images (min 1920px width for hero)
- Implement lazy loading for below-fold images
- Consider WebP format with fallbacks

### Performance
- Lazy load product images
- Use `will-change` sparingly
- Minimize re-renders with `useMemo`/`useCallback`
- Optimize Framer Motion animations

### Accessibility
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images
- ARIA labels for icon-only buttons
- Keyboard navigation support
- Focus states for interactive elements

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- CSS Grid and Flexbox fallbacks

---

## File Structure

```
frontend/src/
├── components/
│   ├── PremiumNavbar.js      # Transparent scroll navbar
│   └── PremiumFooter.js       # Dark footer
├── pages/
│   └── PremiumHome.js         # Main one-page design
└── App.js                     # Routing with layout components
```

---

## Color Palette Hex Codes Reference

```css
/* Charcoal */
--charcoal-900: #0f0f0f;
--charcoal-800: #1a1a1a;
--charcoal-700: #262626;
--charcoal-600: #404040;

/* Earth Tones */
--earth-400: #b89d80;
--earth-300: #d4c0a8;

/* Rose */
--rose-400: #f472b6;
--rose-300: #f9a8d4;

/* Gold */
--gold-400: #fbbf24;
--gold-300: #fcd34d;
```

---

## Next Steps for Enhancement

1. **Image Assets**: Replace placeholder images with high-quality coffee photography
2. **Lazy Loading**: Implement for all below-fold images
3. **Loading States**: Add skeleton loaders for product cards
4. **Error Handling**: Graceful fallbacks for API failures
5. **SEO**: Add meta tags, Open Graph, structured data
6. **Analytics**: Track scroll depth, section views, CTA clicks
7. **A/B Testing**: Test different hero headlines, CTA text
8. **Progressive Enhancement**: Add service worker for offline support

---

**Design Inspiration**: Onyx Coffee Lab  
**Implementation**: React + Framer Motion + Tailwind CSS  
**Last Updated**: 2024

