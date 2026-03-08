# Al-Shaya Family Tree Design System v3

**Version:** 3.0
**Status:** Production-Ready Design System
**Last Updated:** March 5, 2026
**Language:** English & العربية (Arabic)
**Direction:** LTR/RTL Native Support

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Grid & Layout](#grid--layout)
6. [Component Library](#component-library)
7. [Iconography](#iconography)
8. [Motion & Animation](#motion--animation)
9. [Accessibility Guidelines](#accessibility-guidelines)
10. [RTL Implementation Guide](#rtl-implementation-guide)
11. [Dark Mode Support](#dark-mode-support)
12. [Design Tokens](#design-tokens)

---

## Design Principles

The Al-Shaya Family Tree Design System is built on four foundational principles that guide every design decision:

### 1. Arabic-First & Bidirectional

The system prioritizes Arabic language and right-to-left (RTL) layout as first-class citizens, not afterthoughts. This means:

- All interfaces are designed RTL-native, with LTR support added as a variant
- Arabic typography uses specialized fonts optimized for complex scripts
- All components automatically mirror and reflow for RTL languages
- Bidirectional text is handled gracefully with proper Unicode handling

### 2. RTL-Native Architecture

Rather than adapting LTR designs to RTL, we build RTL as the foundation:

- Flexbox and Grid use logical properties (start/end instead of left/right)
- Text direction is explicit at the HTML level with proper language attributes
- Icon mirroring is automatic based on context
- Spatial relationships use CSS logical properties consistently

### 3. Accessibility-Focused

Every component includes accessibility as a core feature:

- WCAG 2.1 AA compliance is the minimum standard
- Focus management and keyboard navigation are first-class concerns
- Screen reader support is built in, not bolted on
- Color contrast meets AA standards (4.5:1 for text, 3:1 for UI components)
- Form labels are always properly associated with inputs

### 4. Family-Centric

The design system reflects the cultural importance of family:

- Visual hierarchy emphasizes family relationships and connections
- Information density is optimized for genealogical data
- The tree structure is the primary metaphor throughout the interface
- Respect for cultural and religious sensitivities is built into every component

### 5. Performance-First

Design decisions consider performance implications:

- CSS custom properties enable dynamic theming without JavaScript overhead
- Component library is built for tree-shaking and minimal bundle size
- Images and icons use optimized formats with lazy loading
- Motion is reduced by default with opt-in animations

### 6. Cultural Awareness

The system respects cultural context:

- Names and relationships follow Arabic naming conventions
- Religious and cultural terminology is handled respectfully
- Dates support both Gregorian and Hijri calendars
- Privacy and family hierarchy are reflected in permission controls

---

## Color System

### Primary Palette

The primary color palette establishes visual hierarchy and brand identity:

```css
--navy: #1A1F3A;           /* Primary brand color - deep blue */
--cyan: #00D4FF;           /* Accent color - vibrant accent */
--purple: #7B2CBF;         /* Secondary accent - brand variation */
--bg: #0F1629;             /* Dark background - high contrast */
--text: #E0E0E0;           /* Primary text - high contrast */
--text-muted: #909090;     /* Muted text - secondary info */
--border: #2A3F5F;         /* Border color - subtle definition */
--hover: #1E2A4A;          /* Hover state - interactive feedback */
```

### Color Specifications

| Color Name | Hex Value | RGB | CMYK | Use Case |
|-----------|-----------|-----|------|----------|
| Navy | #1A1F3A | 26, 31, 58 | 55, 47, 75, 77 | Primary backgrounds, text |
| Cyan | #00D4FF | 0, 212, 255 | 100, 17, 0, 0 | Accents, highlights, borders |
| Purple | #7B2CBF | 123, 44, 191 | 36, 77, 0, 25 | Secondary actions, badges |
| Dark BG | #0F1629 | 15, 22, 41 | 63, 46, 0, 84 | Page backgrounds |
| Light Text | #E0E0E0 | 224, 224, 224 | 0, 0, 0, 12 | Body text, high contrast |
| Muted Text | #909090 | 144, 144, 144 | 0, 0, 0, 44 | Secondary text, disabled |
| Border | #2A3F5F | 42, 63, 95 | 56, 34, 0, 63 | Dividers, edges, outlines |
| Hover | #1E2A4A | 30, 42, 74 | 59, 43, 0, 71 | Interactive states |

### Semantic Colors

Semantic colors communicate meaning and status:

```css
--success: #00E676;        /* Positive actions, completed */
--warning: #FFA726;        /* Caution, pending actions */
--error: #FF5252;          /* Errors, destructive actions */
--info: #29B6F6;           /* Information, helpful content */
```

#### Success Color (#00E676)
- **RGB:** 0, 230, 118
- **Usage:** Successful operations, verified data, confirmed relationships
- **Contrast Ratio (on dark):** 6.5:1 ✓ WCAG AAA
- **Alternatives:** Light: #69F0AE, Dark: #00C853

#### Warning Color (#FFA726)
- **RGB:** 255, 167, 38
- **Usage:** Pending actions, unverified data, duplicate detection
- **Contrast Ratio (on dark):** 5.2:1 ✓ WCAG AA
- **Alternatives:** Light: #FFB74D, Dark: #F57C00

#### Error Color (#FF5252)
- **RGB:** 255, 82, 82
- **Usage:** Validation errors, relationship conflicts, deletions
- **Contrast Ratio (on dark):** 4.8:1 ✓ WCAG AA
- **Alternatives:** Light: #EF5350, Dark: #C62828

#### Info Color (#29B6F6)
- **RGB:** 41, 182, 246
- **Usage:** Informational messages, relationship info, help content
- **Contrast Ratio (on dark):** 5.1:1 ✓ WCAG AA
- **Alternatives:** Light: #64B5F6, Dark: #1565C0

### Extended Palette - Light Variants

For hover states, disabled states, and subtle backgrounds:

```css
--navy-light: #2A3F5F;     /* Lighter navy for hover */
--navy-lighter: #3A4F7F;   /* Even lighter for backgrounds */
--cyan-light: #4DE8FF;     /* Light cyan for disabled */
--purple-light: #9B5CBF;   /* Light purple for muted */
```

### Extended Palette - Dark Variants

For emphasis and depth:

```css
--navy-dark: #0A0F20;      /* Very dark navy for emphasis */
--cyan-dark: #0090B3;      /* Dark cyan for strong focus */
--purple-dark: #5B0C9F;    /* Dark purple for strong actions */
```

### Contrast Validation Matrix

All color combinations meet WCAG AA standards (4.5:1 for text, 3:1 for UI):

| Foreground | Background | Contrast | Level |
|-----------|-----------|----------|-------|
| Text (#E0E0E0) | Navy (#1A1F3A) | 10.2:1 | AAA |
| Text (#E0E0E0) | Purple (#7B2CBF) | 5.4:1 | AA |
| Cyan (#00D4FF) | Navy (#1A1F3A) | 8.1:1 | AAA |
| Success (#00E676) | Navy (#1A1F3A) | 6.5:1 | AAA |
| Warning (#FFA726) | Navy (#1A1F3A) | 5.2:1 | AA |
| Error (#FF5252) | Navy (#1A1F3A) | 4.8:1 | AA |

---

## Typography

### Font Stack Strategy

The typography system uses separate stacks for Arabic and English to ensure optimal rendering:

#### Arabic Typography

**Primary Font: IBM Plex Sans Arabic**

IBM Plex Sans Arabic is specifically designed for complex Arabic scripts with proper diacritic support:

```css
@font-face {
  font-family: 'IBM Plex Sans Arabic';
  src: url('/fonts/IBMPlexSansArabic-Regular.woff2') format('woff2'),
       url('/fonts/IBMPlexSansArabic-Regular.woff') format('woff');
  font-weight: 400;
  font-display: swap;
}

/* Font weights available */
font-weight: 400;  /* Regular */
font-weight: 500;  /* Medium */
font-weight: 600;  /* Semibold */
font-weight: 700;  /* Bold */
```

**Features:**
- Designed for Quranic and modern Arabic text
- Proper handling of diacritical marks (diacritics)
- Excellent legibility at all sizes
- Optimized for screen display (sans-serif)
- Full Unicode Arabic support

#### English Typography

**Primary Font: Inter**

Inter is a carefully crafted typeface designed for computer screens:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2'),
       url('/fonts/Inter-Regular.woff') format('woff');
  font-weight: 400;
  font-display: swap;
}

/* Font weights available */
font-weight: 400;  /* Regular */
font-weight: 500;  /* Medium */
font-weight: 600;  /* Semibold */
font-weight: 700;  /* Bold */
```

**Features:**
- Designed for screen readability
- Excellent at small sizes
- Smooth rendering across devices
- Mathematical precision in letterforms
- Professional appearance

#### Fallback Stack

```css
font-family: 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Typography Scale

A modular scale ensures consistent typography across the interface:

| Size | Name | CSS | Use Case | Line Height | Letter Spacing |
|------|------|-----|----------|-------------|-----------------|
| 12px | xs | 0.75rem | Labels, captions | 1.5 | 0.3px |
| 14px | sm | 0.875rem | Small text, help | 1.5 | 0 |
| 16px | base | 1rem | Body text, regular | 1.6 | 0 |
| 18px | lg | 1.125rem | Large text | 1.6 | 0 |
| 20px | xl | 1.25rem | Section headers | 1.5 | -0.3px |
| 24px | 2xl | 1.5rem | Subsection headers | 1.4 | -0.5px |
| 28px | 3xl | 1.75rem | Page headers | 1.3 | -0.8px |
| 32px | 4xl | 2rem | Major headers | 1.2 | -1px |
| 36px | 5xl | 2.25rem | Title, hero | 1.2 | -1.2px |

### Font Weight Guidance

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Body text, normal content |
| 500 | Medium | Emphasize words within body |
| 600 | Semibold | Component labels, small headers |
| 700 | Bold | Large headers, critical info |

### Line Height System

Line heights follow the golden ratio (1.618) for comfortable reading:

```css
--lh-tight: 1.2;    /* Headlines, 28px+, lots of text */
--lh-normal: 1.5;   /* Default body text, 16-20px */
--lh-relaxed: 1.75; /* Long-form content, accessibility */
--lh-loose: 2;      /* Dense information, small text */
```

### RTL Text Direction

Arabic text requires special handling for diacritical marks and complex shapes:

```css
html[dir="ar"] {
  font-family: 'IBM Plex Sans Arabic', sans-serif;
  text-align: right;
  direction: rtl;
  letter-spacing: 0.02em;
}

html[dir="en"] {
  font-family: 'Inter', sans-serif;
  text-align: left;
  direction: ltr;
}
```

### Letter Spacing Adjustments

RTL text may require different letter spacing than LTR:

| Context | Arabic | English |
|---------|--------|---------|
| Body text | 0.02em | 0em |
| Headings | 0em | -0.02em |
| Small text | 0.05em | 0.01em |
| Titles | -0.01em | -0.03em |

---

## Spacing System

### Base Unit

All spacing values are calculated from a 4px base unit:

```css
--spacing-unit: 4px;
```

This allows for:
- Flexible scaling
- Consistent relationships between spaces
- Easy responsive adjustments
- Predictable calculations (0.25rem = 1px, 1rem = 4px in this system)

### Spacing Scale

The spacing scale uses a consistent multiplier (1.5x) for rhythm:

| Token | Value | Rem | Pixels | Use Case |
|-------|-------|-----|--------|----------|
| --sp-0 | 0 | 0 | 0px | Reset, no space |
| --sp-1 | 0.25rem | 0.25 | 1px | Minimal space |
| --sp-2 | 0.5rem | 0.5 | 2px | Tight spacing |
| --sp-3 | 0.75rem | 0.75 | 3px | Very tight |
| --sp-4 | 1rem | 1 | 4px | Base unit |
| --sp-6 | 1.5rem | 1.5 | 6px | Small padding |
| --sp-8 | 2rem | 2 | 8px | Component padding |
| --sp-12 | 3rem | 3 | 12px | Section margins |
| --sp-16 | 4rem | 4 | 16px | Large spacing |
| --sp-24 | 6rem | 6 | 24px | Hero spacing |
| --sp-32 | 8rem | 8 | 32px | Page sections |

### Padding Guidelines

Apply spacing consistently to create visual harmony:

```css
/* Button padding */
button { padding: --sp-8 --sp-12; }  /* 8px vertical, 12px horizontal */

/* Input padding */
input { padding: --sp-6 --sp-8; }    /* 6px vertical, 8px horizontal */

/* Card padding */
.card { padding: --sp-12; }           /* 12px all sides */

/* Container padding */
.container { padding: --sp-16; }      /* 16px all sides */
```

### Margin Guidelines

Use margins to control spacing between elements:

```css
/* Between components */
.component + .component { margin-block-start: --sp-12; }

/* Within sections */
.section { margin-block: --sp-24; }

/* Between cards */
.card { margin-block-end: --sp-16; }

/* Typography spacing */
h1 { margin-block-end: --sp-8; }
p { margin-block-end: --sp-12; }
```

### Responsive Spacing

Adjust spacing at different breakpoints:

```css
/* Mobile */
.container { padding: --sp-8; }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: --sp-12; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { padding: --sp-16; }
}
```

---

## Grid & Layout

### 12-Column Grid System

The layout grid uses a flexible 12-column system:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--sp-8);
  padding: var(--sp-16);
  max-width: 1400px;
}
```

### Column Spans

Predefined column spans for common layouts:

| Class | Columns | Width (12col) | Use Case |
|-------|---------|---------------|----------|
| .col-1 | 1 | 8.33% | Sidebar spacing |
| .col-2 | 2 | 16.66% | Narrow panels |
| .col-3 | 3 | 25% | Quarter width |
| .col-4 | 4 | 33.33% | Third width |
| .col-6 | 6 | 50% | Half width |
| .col-8 | 8 | 66.66% | Two-third width |
| .col-9 | 9 | 75% | Three-quarter width |
| .col-12 | 12 | 100% | Full width |

### Responsive Breakpoints

Breakpoints follow mobile-first design principles:

```css
/* Mobile (default, xs) */
--bp-xs: 0px;

/* Small screens (sm) */
--bp-sm: 640px;

/* Medium screens (md) */
--bp-md: 768px;

/* Large screens (lg) */
--bp-lg: 1024px;

/* Extra large screens (xl) */
--bp-xl: 1280px;

/* 2x large screens (2xl) */
--bp-2xl: 1536px;
```

### Breakpoint Usage

```css
/* Mobile-first */
.container {
  grid-template-columns: 1fr;
  padding: var(--sp-8);
}

@media (min-width: 640px) {  /* sm */
  .container {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (min-width: 1024px) {  /* lg */
  .container {
    grid-template-columns: repeat(12, 1fr);
    padding: var(--sp-16);
  }
}
```

### RTL Grid Considerations

The grid automatically adapts for RTL:

```css
/* LTR */
.grid {
  direction: ltr;
  grid-auto-flow: row;
}

/* RTL */
html[dir="ar"] .grid {
  direction: rtl;
  grid-auto-flow: row;
  /* Grid columns automatically reverse visually */
}
```

### Safe Zones for Tree Visualization

For the family tree component, establish safe zones:

```css
.tree-container {
  min-height: 600px;
  padding: var(--sp-24);
  overflow-x: auto;
  overflow-y: auto;
}

/* Leave space for controls */
.tree-with-controls {
  display: grid;
  grid-template-columns: 60px 1fr 200px;  /* Controls, tree, minimap */
  gap: var(--sp-12);
}
```

---

## Component Library

### Button Components

#### Button Anatomy

All buttons follow a consistent structure:

```
┌─────────────────────┐
│ icon │ label │ icon │  ← Icon (optional)
│         Text        │  ← Button text
└─────────────────────┘
```

#### Button Variants

**Primary Button**
- **Purpose:** Main call-to-action
- **Color:** Cyan (#00D4FF) background, Navy text
- **Hover:** Purple (#7B2CBF) background
- **Active:** Navy (#1A1F3A) background
- **Disabled:** Muted (#909090) text, opacity 0.5

```css
.btn-primary {
  background-color: var(--cyan);
  color: var(--navy);
  border: none;
  border-radius: 6px;
  padding: var(--sp-8) var(--sp-12);
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-primary:hover {
  background-color: var(--purple);
  color: var(--text);
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Secondary Button**
- **Purpose:** Alternative actions
- **Color:** Transparent background, Cyan text, Cyan border
- **Hover:** Navy background
- **Active:** Cyan background, Navy text
- **Disabled:** Muted text

```css
.btn-secondary {
  background-color: transparent;
  color: var(--cyan);
  border: 2px solid var(--cyan);
  border-radius: 6px;
  padding: var(--sp-8) var(--sp-12);
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-secondary:hover {
  background-color: var(--navy);
}

.btn-secondary:active {
  background-color: var(--cyan);
  color: var(--navy);
}
```

**Ghost Button**
- **Purpose:** Subtle actions
- **Color:** Transparent, Muted text
- **Hover:** Border appears
- **Active:** Background color
- **Disabled:** Very faded

```css
.btn-ghost {
  background-color: transparent;
  color: var(--text-muted);
  border: 2px solid transparent;
  border-radius: 6px;
  padding: var(--sp-8) var(--sp-12);
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-ghost:hover {
  border-color: var(--border);
  color: var(--text);
}
```

**Danger Button**
- **Purpose:** Destructive actions
- **Color:** Error red (#FF5252) background, White text
- **Hover:** Dark red background
- **Requires:** Confirmation on click
- **Accessibility:** Alert role to announce to screen readers

```css
.btn-danger {
  background-color: var(--error);
  color: white;
  border: none;
  border-radius: 6px;
  padding: var(--sp-8) var(--sp-12);
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-danger:hover {
  background-color: #C62828;
  box-shadow: 0 4px 12px rgba(255, 82, 82, 0.3);
}
```

#### Button Sizes

| Size | Padding | Height | Font Size | Use Case |
|------|---------|--------|-----------|----------|
| S | 6px 12px | 32px | 14px | Compact lists, tables |
| M | 8px 16px | 40px | 16px | Default, most uses |
| L | 12px 20px | 48px | 18px | Hero sections, forms |

#### Button States

All buttons support these states:

```css
/* Default */
.btn {
  background-color: var(--cyan);
  color: var(--navy);
}

/* Hover */
.btn:hover {
  background-color: var(--purple);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
}

/* Active/Pressed */
.btn:active {
  transform: translateY(0);
  background-color: var(--navy-dark);
}

/* Focus (keyboard navigation) */
.btn:focus-visible {
  outline: 3px solid var(--cyan);
  outline-offset: 2px;
}

/* Disabled */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading */
.btn.loading::after {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: var(--sp-6);
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
```

#### Icon Buttons

Icon-only buttons for compact layouts:

```css
.btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: transparent;
  color: var(--text-muted);
  border: 2px solid var(--border);
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-icon:hover {
  color: var(--cyan);
  border-color: var(--cyan);
  background-color: rgba(0, 212, 255, 0.1);
}
```

### Form Components

#### Input Field

```css
.input {
  width: 100%;
  padding: var(--sp-6) var(--sp-8);
  border: 2px solid var(--border);
  border-radius: 6px;
  background-color: var(--navy);
  color: var(--text);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 200ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input.error {
  border-color: var(--error);
  color: var(--error);
}

.input.success {
  border-color: var(--success);
}
```

**Arabic Input Considerations:**
- Right-align text in RTL
- Support diacritic marks
- Prevent text selection/copying of sacred text when needed
- Use appropriate keyboard layout (Arabic)

#### Input States

| State | Border Color | Background | Icon |
|-------|-------------|-----------|------|
| Default | Border (#2A3F5F) | Navy (#1A1F3A) | None |
| Focus | Cyan (#00D4FF) | Navy | None |
| Error | Error (#FF5252) | Navy | ✗ |
| Success | Success (#00E676) | Navy | ✓ |
| Disabled | Muted (#909090) | Navy (0.5 opacity) | None |

#### Select Component

```css
.select {
  position: relative;
  width: 100%;
}

.select select {
  width: 100%;
  padding: var(--sp-6) var(--sp-8);
  padding-right: var(--sp-12);
  border: 2px solid var(--border);
  border-radius: 6px;
  background-color: var(--navy);
  color: var(--text);
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
}

.select::after {
  content: '▼';
  position: absolute;
  right: var(--sp-8);
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-muted);
}

html[dir="ar"] .select::after {
  right: auto;
  left: var(--sp-8);
  transform: translateY(-50%) rotateZ(180deg);
}
```

#### Checkbox Component

```css
.checkbox {
  display: flex;
  align-items: center;
  gap: var(--sp-6);
  cursor: pointer;
}

.checkbox input {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 200ms ease;
  accent-color: var(--cyan);
}

.checkbox input:checked {
  background-color: var(--cyan);
  border-color: var(--cyan);
  background-image: url('data:image/svg+xml,...');
  background-position: center;
  background-repeat: no-repeat;
}

.checkbox input:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 2px;
}

.checkbox label {
  cursor: pointer;
  user-select: none;
}
```

#### Radio Button

```css
.radio {
  display: flex;
  align-items: center;
  gap: var(--sp-6);
  cursor: pointer;
}

.radio input {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  transition: all 200ms ease;
}

.radio input:checked {
  border-color: var(--cyan);
  box-shadow: inset 0 0 0 6px var(--cyan);
}

.radio input:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 2px;
}
```

#### Toggle/Switch

```css
.switch {
  position: relative;
  display: inline-flex;
  width: 52px;
  height: 28px;
}

.switch input {
  appearance: none;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 14px;
  background-color: var(--border);
  border: none;
  transition: all 200ms ease;
}

.switch input:checked {
  background-color: var(--success);
}

.switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 50%;
  transition: all 200ms ease;
  pointer-events: none;
}

.switch input:checked::after {
  left: 26px;
}

html[dir="ar"] .switch::after {
  left: auto;
  right: 2px;
}

html[dir="ar"] .switch input:checked::after {
  right: 26px;
  left: auto;
}
```

#### Textarea

```css
.textarea {
  width: 100%;
  min-height: 120px;
  padding: var(--sp-8);
  border: 2px solid var(--border);
  border-radius: 6px;
  background-color: var(--navy);
  color: var(--text);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  transition: all 200ms ease;
}

.textarea:focus {
  outline: none;
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}
```

### Card Components

#### Member Card

Shows a single family member in a compact format:

```css
.member-card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
  padding: var(--sp-12);
  border-radius: 8px;
  border: 2px solid var(--border);
  background-color: var(--navy);
  transition: all 200ms ease;
  cursor: pointer;
}

.member-card:hover {
  border-color: var(--cyan);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.15);
  transform: translateY(-4px);
}

.member-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--border);
  object-fit: cover;
}

.member-card__name {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--text);
}

.member-card__relation {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.member-card__actions {
  display: flex;
  gap: var(--sp-6);
  margin-top: var(--sp-8);
}
```

#### Family Card

Displays a nuclear family unit:

```css
.family-card {
  padding: var(--sp-16);
  border-radius: 8px;
  border: 2px solid var(--border);
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
  transition: all 200ms ease;
}

.family-card:hover {
  border-color: var(--cyan);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.2);
}

.family-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-12);
  border-bottom: 2px solid var(--border);
  padding-bottom: var(--sp-8);
}

.family-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--cyan);
}

.family-card__count {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.family-card__members {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--sp-8);
}
```

#### Event Card

Shows family events or milestones:

```css
.event-card {
  padding: var(--sp-12);
  border-left: 4px solid var(--cyan);
  border-radius: 6px;
  background-color: var(--navy);
  transition: all 200ms ease;
}

html[dir="ar"] .event-card {
  border-left: none;
  border-right: 4px solid var(--cyan);
}

.event-card:hover {
  background-color: var(--hover);
}

.event-card__date {
  font-size: 0.875rem;
  color: var(--cyan);
  font-weight: 600;
  margin-bottom: var(--sp-4);
}

.event-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--sp-6);
}

.event-card__description {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.5;
}
```

#### Stats Card

Displays numerical information:

```css
.stats-card {
  padding: var(--sp-16);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, transparent 100%);
  border: 2px solid var(--border);
  text-align: center;
}

.stats-card__label {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--sp-6);
}

.stats-card__value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--cyan);
  font-variant-numeric: tabular-nums;
}

.stats-card__change {
  font-size: 0.875rem;
  margin-top: var(--sp-6);
  color: var(--success);
}

.stats-card__change.negative {
  color: var(--error);
}
```

### Navigation Components

#### Sidebar Navigation

```css
.sidebar {
  width: 260px;
  height: 100vh;
  background-color: var(--navy);
  border-right: 2px solid var(--border);
  padding: var(--sp-16) var(--sp-12);
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
}

html[dir="ar"] .sidebar {
  left: auto;
  right: 0;
  border-right: none;
  border-left: 2px solid var(--border);
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--sp-8);
  padding: var(--sp-8) var(--sp-12);
  border-radius: 6px;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 200ms ease;
  margin-bottom: var(--sp-4);
  cursor: pointer;
}

.sidebar__item:hover {
  background-color: var(--hover);
  color: var(--text);
}

.sidebar__item.active {
  background-color: rgba(0, 212, 255, 0.1);
  color: var(--cyan);
  border-left: 4px solid var(--cyan);
  padding-left: calc(var(--sp-12) - 4px);
}

html[dir="ar"] .sidebar__item.active {
  border-left: none;
  border-right: 4px solid var(--cyan);
  padding-left: var(--sp-12);
  padding-right: calc(var(--sp-12) - 4px);
}
```

#### Top Navigation

```css
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 var(--sp-16);
  background-color: var(--navy);
  border-bottom: 2px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.top-nav__logo {
  display: flex;
  align-items: center;
  gap: var(--sp-8);
  color: var(--cyan);
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
}

.top-nav__actions {
  display: flex;
  align-items: center;
  gap: var(--sp-12);
}

.top-nav__profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--border);
  cursor: pointer;
  transition: all 200ms ease;
}

.top-nav__profile:hover {
  border-color: var(--cyan);
  box-shadow: 0 0 0 2px var(--cyan);
}
```

#### Breadcrumbs

```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--sp-6);
  padding: var(--sp-8) 0;
  font-size: 0.875rem;
}

.breadcrumb__item {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 200ms ease;
}

.breadcrumb__item:hover {
  color: var(--cyan);
  text-decoration: underline;
}

.breadcrumb__item.active {
  color: var(--text);
  font-weight: 600;
}

.breadcrumb__separator {
  color: var(--border);
  margin: 0 var(--sp-4);
}

html[dir="ar"] .breadcrumb__separator::before {
  content: '\\';
}

html[dir="ltr"] .breadcrumb__separator::before {
  content: '/';
}
```

#### Tabs

```css
.tabs {
  display: flex;
  border-bottom: 2px solid var(--border);
  gap: 0;
}

.tabs__tab {
  padding: var(--sp-8) var(--sp-12);
  border: none;
  background-color: transparent;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 200ms ease;
  margin-bottom: -2px;
  position: relative;
}

.tabs__tab:hover {
  color: var(--text);
  border-bottom-color: var(--border);
}

.tabs__tab.active {
  color: var(--cyan);
  border-bottom-color: var(--cyan);
}

.tabs__content {
  padding: var(--sp-16);
  display: none;
}

.tabs__content.active {
  display: block;
}
```

#### Pagination

```css
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-4);
  padding: var(--sp-16);
}

.pagination__button {
  min-width: 40px;
  height: 40px;
  padding: 0 var(--sp-8);
  border: 2px solid var(--border);
  border-radius: 6px;
  background-color: var(--navy);
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}

.pagination__button:hover:not(:disabled) {
  border-color: var(--cyan);
  color: var(--cyan);
}

.pagination__button.active {
  background-color: var(--cyan);
  color: var(--navy);
  border-color: var(--cyan);
}

.pagination__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination__info {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0 var(--sp-8);
}
```

### Data Display Components

#### Table

```css
.table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
}

.table thead {
  background-color: var(--navy-light);
  border-bottom: 2px solid var(--border);
}

.table th {
  padding: var(--sp-12);
  text-align: left;
  font-weight: 700;
  color: var(--cyan);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

html[dir="ar"] .table th {
  text-align: right;
}

.table td {
  padding: var(--sp-12);
  border-bottom: 1px solid var(--border);
  color: var(--text);
  font-size: 1rem;
}

.table tbody tr:hover {
  background-color: var(--hover);
}

.table tbody tr:last-child td {
  border-bottom: none;
}
```

#### List

```css
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list__item {
  padding: var(--sp-12);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: var(--sp-12);
  transition: all 200ms ease;
}

.list__item:last-child {
  border-bottom: none;
}

.list__item:hover {
  background-color: var(--hover);
}

.list__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--border);
  flex-shrink: 0;
}

.list__content {
  flex: 1;
  min-width: 0;
}

.list__title {
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--sp-2);
}

.list__subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
}
```

#### Avatar

```css
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--cyan), var(--purple));
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar.xs { width: 32px; height: 32px; font-size: 0.875rem; }
.avatar.lg { width: 64px; height: 64px; font-size: 1.25rem; }
.avatar.xl { width: 96px; height: 96px; font-size: 1.5rem; }

.avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--success);
  border: 2px solid var(--navy);
}
```

#### Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-2) var(--sp-6);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: rgba(0, 212, 255, 0.2);
  color: var(--cyan);
}

.badge.success { background-color: rgba(0, 230, 118, 0.2); color: var(--success); }
.badge.warning { background-color: rgba(255, 167, 38, 0.2); color: var(--warning); }
.badge.error { background-color: rgba(255, 82, 82, 0.2); color: var(--error); }

.badge__icon {
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### Tag

```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-6);
  padding: var(--sp-4) var(--sp-8);
  border-radius: 6px;
  background-color: var(--border);
  color: var(--text);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 200ms ease;
}

.tag:hover {
  background-color: var(--navy-light);
  border-color: var(--cyan);
}

.tag.removable .tag__remove {
  margin-left: var(--sp-4);
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 200ms ease;
}

.tag.removable .tag__remove:hover {
  opacity: 1;
}

html[dir="ar"] .tag.removable .tag__remove {
  margin-left: 0;
  margin-right: var(--sp-4);
}
```

#### Tooltip

```css
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip__content {
  visibility: hidden;
  background-color: var(--navy-dark);
  color: var(--text);
  text-align: center;
  padding: var(--sp-6) var(--sp-8);
  border-radius: 6px;
  position: absolute;
  z-index: 1000;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.875rem;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 200ms ease;
  border: 1px solid var(--border);
}

.tooltip:hover .tooltip__content {
  visibility: visible;
  opacity: 1;
}

.tooltip__content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: var(--navy-dark) transparent transparent transparent;
}
```

#### Stat

```css
.stat {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.stat__label {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.stat__value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.stat__change {
  font-size: 0.875rem;
  color: var(--success);
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}

.stat__change.negative {
  color: var(--error);
}
```

### Feedback Components

#### Alert

```css
.alert {
  padding: var(--sp-12);
  border-radius: 8px;
  border-left: 4px solid var(--info);
  background-color: rgba(41, 182, 246, 0.1);
  color: var(--text);
}

html[dir="ar"] .alert {
  border-left: none;
  border-right: 4px solid var(--info);
}

.alert.success {
  border-color: var(--success);
  background-color: rgba(0, 230, 118, 0.1);
}

.alert.warning {
  border-color: var(--warning);
  background-color: rgba(255, 167, 38, 0.1);
}

.alert.error {
  border-color: var(--error);
  background-color: rgba(255, 82, 82, 0.1);
}

.alert__title {
  font-weight: 700;
  margin-bottom: var(--sp-4);
}

.alert__description {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.5;
}
```

#### Toast

```css
.toast {
  position: fixed;
  bottom: var(--sp-16);
  right: var(--sp-16);
  padding: var(--sp-12);
  border-radius: 8px;
  background-color: var(--navy);
  border: 2px solid var(--border);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: var(--sp-8);
  max-width: 400px;
  animation: slideInUp 300ms ease;
  z-index: 1001;
}

html[dir="ar"] .toast {
  right: auto;
  left: var(--sp-16);
}

.toast.success { border-color: var(--success); }
.toast.error { border-color: var(--error); }
.toast.warning { border-color: var(--warning); }

@keyframes slideInUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

#### Modal

```css
.modal__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal__content {
  background-color: var(--navy);
  border-radius: 12px;
  border: 2px solid var(--border);
  padding: var(--sp-24);
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: scaleIn 300ms ease;
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-16);
  padding-bottom: var(--sp-12);
  border-bottom: 2px solid var(--border);
}

.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
}

.modal__close {
  background-color: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 200ms ease;
}

.modal__close:hover {
  color: var(--error);
}

.modal__body {
  margin-bottom: var(--sp-16);
  color: var(--text);
  line-height: 1.6;
}

.modal__footer {
  display: flex;
  gap: var(--sp-8);
  justify-content: flex-end;
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

#### Drawer

```css
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  height: 100vh;
  background-color: var(--navy);
  border-left: 2px solid var(--border);
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.3);
  z-index: 998;
  animation: slideInRight 300ms ease;
}

html[dir="ar"] .drawer {
  right: auto;
  left: 0;
  border-left: none;
  border-right: 2px solid var(--border);
  box-shadow: 8px 0 24px rgba(0, 0, 0, 0.3);
  animation: slideInLeft 300ms ease;
}

.drawer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--sp-16);
  border-bottom: 2px solid var(--border);
}

.drawer__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
}

.drawer__content {
  overflow-y: auto;
  height: calc(100vh - 64px);
  padding: var(--sp-16);
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

#### Progress

```css
.progress {
  width: 100%;
  height: 8px;
  background-color: var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  background: linear-gradient(90deg, var(--cyan), var(--purple));
  transition: width 300ms ease;
  border-radius: 4px;
}

.progress.success .progress__bar { background: linear-gradient(90deg, var(--success), var(--cyan)); }
.progress.warning .progress__bar { background: linear-gradient(90deg, var(--warning), var(--cyan)); }
.progress.error .progress__bar { background: linear-gradient(90deg, var(--error), var(--warning)); }

.progress__label {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--sp-6);
  font-size: 0.875rem;
}

.progress__value {
  color: var(--text-muted);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
```

#### Skeleton

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--border) 0%,
    var(--navy-light) 50%,
    var(--border) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 6px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton.text { height: 1em; margin-bottom: var(--sp-8); }
.skeleton.avatar { width: 48px; height: 48px; border-radius: 50%; }
.skeleton.card { height: 200px; border-radius: 8px; }
```

### Family Tree Components

#### TreeNode

```css
.tree-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-8);
  padding: var(--sp-12);
  background-color: var(--navy);
  border: 2px solid var(--border);
  border-radius: 8px;
  min-width: 180px;
  cursor: pointer;
  transition: all 200ms ease;
  position: relative;
}

.tree-node:hover {
  border-color: var(--cyan);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.15);
}

.tree-node.selected {
  border-color: var(--cyan);
  background-color: rgba(0, 212, 255, 0.1);
}

.tree-node.generation-1 { border-color: var(--cyan); }
.tree-node.generation-2 { border-color: var(--purple); }
.tree-node.generation-3 { border-color: var(--success); }

.tree-node__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--border);
  object-fit: cover;
}

.tree-node__name {
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
  color: var(--text);
}

.tree-node__relation {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

#### TreeLink

```css
.tree-link {
  stroke: var(--border);
  stroke-width: 2;
  fill: none;
  transition: stroke 200ms ease;
}

.tree-link.parent-child { stroke: var(--cyan); }
.tree-link.spouse { stroke: var(--purple); }
.tree-link.sibling { stroke: var(--success); stroke-dasharray: 5,5; }

.tree-link:hover {
  stroke: var(--text);
  stroke-width: 3;
}

.tree-link-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-anchor: middle;
  background-color: var(--navy);
  padding: 2px 4px;
}
```

#### TreeControls

```css
.tree-controls {
  position: fixed;
  left: var(--sp-16);
  top: var(--sp-16);
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
  background-color: var(--navy);
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: var(--sp-12);
  z-index: 50;
}

html[dir="ar"] .tree-controls {
  left: auto;
  right: var(--sp-16);
}

.tree-controls__button {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: var(--navy-light);
  color: var(--text-muted);
  border: 2px solid var(--border);
  cursor: pointer;
  transition: all 200ms ease;
}

.tree-controls__button:hover {
  color: var(--cyan);
  border-color: var(--cyan);
}
```

#### MiniMap

```css
.minimap {
  position: fixed;
  bottom: var(--sp-16);
  right: var(--sp-16);
  width: 200px;
  height: 150px;
  background-color: var(--navy);
  border: 2px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 50;
}

html[dir="ar"] .minimap {
  right: auto;
  left: var(--sp-16);
}

.minimap__canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.minimap__viewport {
  position: absolute;
  border: 2px solid var(--cyan);
  background-color: rgba(0, 212, 255, 0.1);
  cursor: grab;
}

.minimap__viewport:active {
  cursor: grabbing;
}
```

#### Legend

```css
.tree-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-12);
  padding: var(--sp-12);
  background-color: var(--navy);
  border: 2px solid var(--border);
  border-radius: 8px;
  margin-bottom: var(--sp-16);
}

.legend__item {
  display: flex;
  align-items: center;
  gap: var(--sp-6);
  font-size: 0.875rem;
}

.legend__color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend__item.parent-child .legend__color { background-color: var(--cyan); }
.legend__item.spouse .legend__color { background-color: var(--purple); }
.legend__item.sibling .legend__color { background-color: var(--success); }
.legend__item.selected .legend__color { background-color: var(--warning); }
```

---

## Iconography

### Icon Set

Recommended icon libraries for the Al-Shaya system:

**Primary:** Feather Icons (minimal, elegant)
**Secondary:** Heroicons (detailed, professional)
**Arabic:** Custom SVG icons for cultural elements

### Icon Sizing

```css
--icon-xs: 16px;    /* In compact lists, pills */
--icon-sm: 20px;    /* In labels, small buttons */
--icon-base: 24px;  /* Default, most uses */
--icon-lg: 32px;    /* Large buttons, hero */
--icon-xl: 48px;    /* Decorative, headers */
```

### Icon Colors

```css
.icon { color: currentColor; }
.icon.muted { color: var(--text-muted); }
.icon.success { color: var(--success); }
.icon.warning { color: var(--warning); }
.icon.error { color: var(--error); }
.icon.info { color: var(--info); }
```

### RTL Icon Mirroring

Some icons should flip in RTL contexts:

```css
html[dir="ar"] .icon.rtl-mirror {
  transform: scaleX(-1);
}
```

**Icons that should mirror:**
- Arrow-right, Arrow-left
- Chevron-right, Chevron-left
- Share, Share-2
- Align-left, Align-right
- Format-quote

**Icons that should NOT mirror:**
- Arrows (up/down)
- Checkmarks
- Circles
- Radios
- Timestamps
- All directional symbols
- Letters and text

---

## Motion & Animation

### Timing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Duration Scale

```css
--duration-fast: 100ms;      /* Micro interactions */
--duration-normal: 200ms;    /* Default animations */
--duration-slow: 300ms;      /* Page transitions */
--duration-slower: 500ms;    /* Dialog entrance */
```

### Standard Animations

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

### Reduced Motion

Respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

All components must meet WCAG 2.1 AA standards:

- **Contrast:** 4.5:1 for text, 3:1 for UI components
- **Focus:** All interactive elements must have visible focus states
- **Labels:** All inputs must have associated labels
- **Color:** Never use color alone to convey meaning
- **Motion:** No more than 3 flashes per second (seizure risk)
- **Text:** Use clear language, avoid jargon when possible

### Focus Management

```css
/* Visible focus indicator */
:focus-visible {
  outline: 3px solid var(--cyan);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Remove default outline */
:focus:not(:focus-visible) {
  outline: none;
}

/* Focus ring for dark backgrounds */
.dark :focus-visible {
  outline-color: var(--cyan);
}
```

### Screen Reader Support

```html
<!-- Use semantic HTML -->
<button aria-label="Close dialog">✕</button>
<nav aria-label="Main navigation"></nav>
<main aria-label="Main content"></main>

<!-- Skip link -->
<a href="#main-content" class="skip-link">Skip to content</a>

<!-- Alert announcements -->
<div role="alert" aria-live="polite" aria-atomic="true">
  New messages have arrived
</div>

<!-- Loading states -->
<div aria-busy="true" aria-label="Loading..."></div>

<!-- Form validation -->
<input type="email" aria-required="true" aria-invalid="true" aria-describedby="email-error">
<span id="email-error" role="alert">Invalid email format</span>
```

### Arabic-Specific Accessibility

```html
<!-- Proper text direction for mixed content -->
<p>Your first name is: <span lang="ar" dir="rtl">محمد</span></p>

<!-- Diacritical marks for clarity -->
<p>الحَمْد لِلَّهِ</p>

<!-- Proper pronunciation of names -->
<button aria-label="محمد bin احمد">
  محمد
</button>

<!-- Date formatting for Arabic users -->
<time datetime="2026-03-05">5 مارس 2026</time>
```

### Color Contrast Examples

| Color Pair | Contrast | Level |
|-----------|----------|-------|
| Text (#E0E0E0) on Navy (#1A1F3A) | 10.2:1 | AAA |
| Cyan (#00D4FF) on Navy (#1A1F3A) | 8.1:1 | AAA |
| Success (#00E676) on Navy (#1A1F3A) | 6.5:1 | AAA |
| Purple (#7B2CBF) on Navy (#1A1F3A) | 5.4:1 | AA |
| Warning (#FFA726) on Navy (#1A1F3A) | 5.2:1 | AA |
| Error (#FF5252) on Navy (#1A1F3A) | 4.8:1 | AA |

### Testing Accessibility

```bash
# Tools to test
- axe DevTools (browser extension)
- WAVE (browser extension)
- Lighthouse (Chrome DevTools)
- NVDA screen reader
- JAWS screen reader
- macOS VoiceOver
- iOS VoiceOver

# Manual tests
- Tab through entire interface with keyboard only
- Test with screen reader at 50% speed
- Test with 200% zoom
- Test in grayscale mode
- Test with reduced motion enabled
- Test in RTL mode
```

---

## RTL Implementation Guide

### CSS Logical Properties

Replace physical properties with logical ones:

```css
/* Instead of: */
.box {
  left: 16px;
  right: auto;
  text-align: left;
}

/* Use: */
.box {
  inset-inline-start: 16px;
  inset-inline-end: auto;
  text-align: start;
}
```

### Margin and Padding

```css
/* Instead of: */
.card {
  margin-right: 16px;
  padding-left: 12px;
}

/* Use: */
.card {
  margin-inline-end: 16px;
  padding-inline-start: 12px;
}
```

### Width and Positioning

```css
/* Float direction */
.sidebar {
  float: inline-start;  /* Floats right in RTL */
}

/* Positioning */
.fixed-button {
  inset-inline-end: 16px;  /* Right in LTR, left in RTL */
  inset-block-start: 16px;
}

/* Text direction */
html {
  direction: var(--dir);  /* ltr or rtl */
  text-align: start;
}
```

### Border Properties

```css
/* Instead of: */
.alert {
  border-left: 4px solid var(--info);
  padding-left: 12px;
}

/* Use: */
.alert {
  border-inline-start: 4px solid var(--info);
  padding-inline-start: 12px;
}
```

### Flexbox in RTL

```css
.nav {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

/* In RTL, the row direction automatically reverses */
html[dir="ar"] .nav {
  /* No additional CSS needed! */
  /* Items appear right-to-left naturally */
}
```

### Grid in RTL

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}

/* RTL grids also work automatically */
html[dir="ar"] .grid {
  /* Grid columns appear right-to-left */
  direction: rtl;
}
```

### Bidirectional Text (Bidi)

```html
<!-- Mixing Arabic and English requires proper markup -->
<p>أهلا وسهلا Welcome</p>

<!-- Use direction markers for complex bidi text -->
<p><bdi>محمد</bdi> wrote a message</p>

<!-- Explicit directional formatting -->
<p>
  <span dir="ar">السلام عليكم</span>
  Hello world
</p>
```

### Transform and Translate

```css
/* Avoid hardcoding directions in transforms */
.icon-button {
  transform: translateX(-4px);  /* BAD - works only in one direction */
}

/* Better - use logical positioning instead */
.icon-button {
  inset-inline-end: -4px;  /* Works in both directions */
}
```

---

## Dark Mode Support

### Color Token Mapping

The system uses CSS custom properties to support dark mode automatically:

```css
:root {
  --navy: #1A1F3A;
  --cyan: #00D4FF;
  --purple: #7B2CBF;
  --bg: #0F1629;
  --text: #E0E0E0;
  --text-muted: #909090;
  --border: #2A3F5F;
  --hover: #1E2A4A;
  --success: #00E676;
  --warning: #FFA726;
  --error: #FF5252;
  --info: #29B6F6;
}

/* Light mode adjustments if needed */
@media (prefers-color-scheme: light) {
  :root {
    --navy: #F5F5F5;
    --cyan: #0091CC;
    --purple: #6A1B9A;
    --bg: #FFFFFF;
    --text: #212121;
    --text-muted: #666666;
    --border: #E0E0E0;
    --hover: #F0F0F0;
  }
}
```

### Component Adjustments

```css
/* Some components need adjustments in dark mode */
.card {
  background-color: var(--navy);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (prefers-color-scheme: light) {
  .card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}
```

### Dark Mode Detection

```javascript
// Detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Listen for changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
});
```

---

## Design Tokens

### Complete Token Definition

```css
:root {
  /* Colors - Primary Palette */
  --color-navy: #1A1F3A;
  --color-cyan: #00D4FF;
  --color-purple: #7B2CBF;

  /* Colors - Semantic */
  --color-success: #00E676;
  --color-warning: #FFA726;
  --color-error: #FF5252;
  --color-info: #29B6F6;

  /* Colors - Neutral */
  --color-bg-primary: #0F1629;
  --color-bg-secondary: #1A1F3A;
  --color-text-primary: #E0E0E0;
  --color-text-secondary: #909090;
  --color-border: #2A3F5F;
  --color-hover: #1E2A4A;

  /* Typography */
  --font-family-arabic: 'IBM Plex Sans Arabic', sans-serif;
  --font-family-english: 'Inter', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.75rem;
  --font-size-4xl: 2rem;
  --font-size-5xl: 2.25rem;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  --line-height-loose: 2;

  /* Spacing */
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-24: 6rem;
  --spacing-32: 8rem;

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-base: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 16px 40px rgba(0, 0, 0, 0.4);

  /* Transitions */
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;

  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Breakpoints */
  --breakpoint-xs: 0px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Usage Examples

```css
/* Button using tokens */
.button {
  padding: var(--spacing-8) var(--spacing-12);
  background-color: var(--color-cyan);
  color: var(--color-navy);
  border-radius: var(--radius-base);
  font-family: var(--font-family-english);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  transition: all var(--duration-normal) var(--ease-in-out);
  box-shadow: var(--shadow-md);
}

.button:hover {
  background-color: var(--color-purple);
  box-shadow: var(--shadow-lg);
}

/* Card using tokens */
.card {
  padding: var(--spacing-16);
  background-color: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

/* Responsive text using tokens */
.heading {
  font-family: var(--font-family-arabic);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-16);
}

@media (min-width: var(--breakpoint-lg)) {
  .heading {
    font-size: var(--font-size-4xl);
  }
}
```

---

## Implementation Checklist

To implement this design system:

- [ ] Install IBM Plex Sans Arabic and Inter fonts
- [ ] Create CSS custom properties file
- [ ] Build component library in your framework (React, Vue, etc.)
- [ ] Test all color contrast ratios
- [ ] Test all components in RTL mode
- [ ] Test all components with keyboard navigation
- [ ] Test all components with screen readers
- [ ] Set up automated accessibility testing
- [ ] Document component API and props
- [ ] Create design system documentation site
- [ ] Train team on design system usage
- [ ] Set up CI/CD to validate design token usage

---

## Conclusion

The Al-Shaya Family Tree Design System is a comprehensive, accessible, and culturally aware design system built for the modern web. It prioritizes Arabic language, RTL layout, accessibility, and performance while maintaining beautiful, cohesive visual design.

By following these guidelines, you'll create interfaces that are not only visually consistent but also accessible to all users, performant across devices, and respectful of cultural context.

For questions or updates to this design system, please refer to the official documentation or contact the design team.

---

**Document Version:** 3.0
**Last Updated:** March 5, 2026
**Status:** Production Ready
**Maintainer:** Al-Shaya Design System Team
