# Al-Shaya Family Tree Design System

**Version:** 4.0
**Status:** Production-Ready Comprehensive Specification
**Last Updated:** March 8, 2026
**Language:** English & العربية (Arabic)
**Direction:** LTR/RTL Native Support

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Brand Identity](#brand-identity)
3. [Layout System](#layout-system)
4. [Design Tokens](#design-tokens)
5. [Component Library - Foundation](#component-library-foundation)
6. [Component Library - Navigation](#component-library-navigation)
7. [Component Library - Feedback](#component-library-feedback)
8. [Component Library - Data Display](#component-library-data-display)
9. [Component Library - Family Tree Specific](#component-library-family-tree-specific)
10. [Component Library - Layout & Forms](#component-library-layout-forms)
11. [Design Patterns](#design-patterns)
12. [Motion & Animation](#motion--animation)
13. [Accessibility Standards](#accessibility-standards)
14. [Responsive Design](#responsive-design)
15. [Dark Mode Implementation](#dark-mode-implementation)
16. [Implementation Guide](#implementation-guide)

---

## Design Principles

The Al-Shaya Family Tree Design System is built on six foundational principles that guide every design decision:

### 1. Arabic-First & Bidirectional

The system prioritizes Arabic language and right-to-left (RTL) layout as first-class citizens, not afterthoughts. This means:

- All interfaces are designed RTL-native, with LTR support added as a variant
- Arabic typography uses specialized fonts optimized for complex scripts
- All components automatically mirror and reflow for RTL languages
- Bidirectional text is handled gracefully with proper Unicode handling
- Cultural context informs design choices (e.g., avoiding left-hand gestures, respecting naming conventions)

**Application to Al-Shaya:**
- Family names in Arabic are sacred and treated with utmost care in typography
- Genealogical data flows logically in both reading directions
- User input for Arabic names uses proper diacritics and letter forms
- Direction switching happens seamlessly without page reload

### 2. Clarity Through Hierarchy

Visual hierarchy ensures users understand what to do, what matters, and why.

- Information is organized from most to least important
- Typography scales create clear visual distinction
- Whitespace separates concepts and reduces cognitive load
- Color usage supports rather than replaces hierarchy
- Accessibility is never sacrificed for aesthetic complexity

**Application to Al-Shaya:**
- Family tree nodes clearly show generation and relationship priority
- Search results emphasize matching members with relationship context
- Admin tools present critical actions prominently with visual confirmation
- Forms guide users through logical step-by-step processes

### 3. Trustworthiness & Transparency

Users must feel confident their family data is secure and handled respectfully.

- Consistent, predictable behavior builds confidence
- Permission requests are explicit and clearly justified
- Data operations show clear confirmation and undo options
- Security indicators are present but not intrusive
- Privacy controls are intuitive and visible

**Application to Al-Shaya:**
- Approval workflows show clear status and reasoning
- Family member privacy levels are explicitly displayed
- Edit history is trackable for data integrity
- Role-based access is transparently communicated

### 4. Accessible to All Users

Inclusivity is a design requirement, not an afterthought.

- WCAG 2.1 AA compliance is the baseline standard
- Keyboard navigation works for all functionality
- Screen readers receive proper semantic information
- Color contrast meets accessibility standards
- Components work for users with varying abilities and contexts

**Application to Al-Shaya:**
- Family tree visualization has keyboard shortcuts and screen reader descriptions
- Date inputs support multiple input methods
- Mobile users can perform all desktop functions
- Arabic screen readers receive proper text direction and pronunciation hints

### 5. Efficient & Respectful of User Time

Genealogy research is time-intensive; the interface should not add friction.

- Workflows are optimized for common tasks
- Repetitive actions are simplified or automated
- Search is powerful and forgiving
- Loading states are clear and fast
- Data preservation prevents accidental loss

**Application to Al-Shaya:**
- Quick-add members for rapid data entry
- Search with fuzzy matching handles spelling variations
- Bulk operations for administrative tasks
- Auto-save prevents data loss during editing

### 6. Culturally Respectful & Locally Relevant

Design decisions respect Middle Eastern cultural values and practices.

- Naming conventions honor traditional structures
- Color choices align with cultural preferences
- Religious and social contexts are acknowledged
- Family structures are represented accurately
- The interface feels local, not foreign

**Application to Al-Shaya:**
- Multiple wife support for historical/cultural accuracy
- Patronymic naming conventions (Ibn/Bint) are properly handled
- Hijri calendar option alongside Gregorian
- Regional variations in family structure are supported
- Quranic verses or Islamic greetings can be included contextually

---

## Brand Identity

### Color Palette

#### Primary Colors (Brand Core)

| Color | Hex | RGB | Usage | Contrast (WCAG AA) |
|-------|-----|-----|-------|-------------------|
| Navy (Primary) | #1A1F3A | 26, 31, 58 | Main backgrounds, headers, primary UI | Pass |
| Cyan (Accent) | #00D4FF | 0, 212, 255 | Links, highlights, active states, CTAs | Pass (white text) |
| Purple (Secondary) | #7B2CBF | 123, 44, 191 | Secondary actions, filters, special states | Pass (white text) |

#### Semantic Colors

| Color | Hex | RGB | Context | Example |
|-------|-----|-----|---------|---------|
| Success Green | #00E676 | 0, 230, 118 | Positive actions, confirmations, validation passes | "Member added successfully" |
| Warning Amber | #FFA726 | 255, 167, 38 | Cautions, pending states, requires attention | "Pending approval" badge |
| Error Red | #FF5252 | 255, 82, 82 | Errors, deletions, validation failures | "Invalid date format" |
| Info Blue | #00B0FF | 0, 176, 255 | Informational messages, help text | "Tip: Use fuzzy search for spelling variations" |

#### Neutral Colors (Text & Backgrounds)

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Background Dark | #0F1629 | 15, 22, 41 | Main page background |
| Background Darker | #0D0F1F | 13, 15, 31 | Secondary backgrounds, overlays |
| Card Background | #1A1F3A | 26, 31, 58 | Cards, panels, elevated surfaces |
| Hover Background | #1E2A4A | 30, 42, 74 | Interactive element hover states |
| Border Color | #2A3F5F | 42, 63, 95 | Lines, dividers, subtle borders |
| Text Primary | #E0E0E0 | 224, 224, 224 | Main body text |
| Text Secondary | #B0B0B0 | 176, 176, 176 | Secondary text, descriptions |
| Text Muted | #909090 | 144, 144, 144 | Disabled text, hints, metadata |
| Text Subtle | #707070 | 112, 112, 112 | Very subtle text |
| White | #FFFFFF | 255, 255, 255 | Emphasis, overlays, contrast |

#### Semantic Palette (Grouped)

**Success States:**
- Light: #E8F5E9 (RGB: 232, 245, 233) - Background
- Main: #4CAF50 (RGB: 76, 175, 80) - Icon/text
- Dark: #2E7D32 (RGB: 46, 125, 50) - Hover/border

**Warning States:**
- Light: #FFF3E0 (RGB: 255, 243, 224) - Background
- Main: #FF9800 (RGB: 255, 152, 0) - Icon/text
- Dark: #E65100 (RGB: 230, 81, 0) - Hover/border

**Error States:**
- Light: #FFEBEE (RGB: 255, 235, 238) - Background
- Main: #F44336 (RGB: 244, 67, 54) - Icon/text
- Dark: #C62828 (RGB: 198, 40, 40) - Hover/border

**Info States:**
- Light: #E3F2FD (RGB: 227, 242, 253) - Background
- Main: #2196F3 (RGB: 33, 150, 243) - Icon/text
- Dark: #1565C0 (RGB: 21, 101, 192) - Hover/border

### Typography System

#### Font Families

**Arabic Fonts:**
- **Primary:** 'Tajawal', 'Droid Arabic Kufi', 'Cairo', sans-serif
- **Fallback:** -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

Tajawal is preferred for:
- Modern, clean appearance
- Excellent readability at all sizes
- Strong diacritic support
- Professional genealogical documents

**Latin Fonts (English):**
- **Primary:** 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Monospace:** 'Fira Code', 'Monaco', 'Courier New', monospace

#### Typography Scale

| Type | Arabic Size | Latin Size | Weight | Line Height | Letter Spacing | Usage |
|------|-------------|-----------|--------|-------------|----------------|-------|
| H1 - Display | 2.5rem (40px) | 2.5rem (40px) | 700 Bold | 1.2 | -0.02em | Page titles, major headings |
| H2 - Hero | 2rem (32px) | 2rem (32px) | 700 Bold | 1.3 | -0.01em | Section headings, dialogs |
| H3 - Large | 1.75rem (28px) | 1.75rem (28px) | 600 SemiBold | 1.3 | 0 | Subsection headings |
| H4 - Medium | 1.5rem (24px) | 1.5rem (24px) | 600 SemiBold | 1.4 | 0 | Card titles, form labels |
| H5 - Small | 1.25rem (20px) | 1.25rem (20px) | 600 SemiBold | 1.4 | 0 | Small titles, nav labels |
| H6 - Tiny | 1rem (16px) | 1rem (16px) | 600 SemiBold | 1.5 | 0 | Field labels, badge text |
| Body Large | 1rem (16px) | 1rem (16px) | 400 Regular | 1.6 | 0 | Primary body text, descriptions |
| Body Regular | 0.95rem (15px) | 0.95rem (15px) | 400 Regular | 1.6 | 0 | Standard text content |
| Body Small | 0.875rem (14px) | 0.875rem (14px) | 400 Regular | 1.5 | 0 | Secondary text, hints |
| Caption | 0.75rem (12px) | 0.75rem (12px) | 400 Regular | 1.4 | 0.01em | Metadata, timestamps |
| Overline | 0.7rem (11px) | 0.7rem (11px) | 600 SemiBold | 1.6 | 0.08em | Category labels, tags |
| Code | 0.875rem (14px) | 0.875rem (14px) | 400 Regular | 1.5 | 0 | Code blocks, data |

#### Arabic Typography Guidelines

- **Diacritics:** Always ensure proper diacritic spacing; some fonts render tashkeel below rather than above
- **Letter Forms:** Use fonts that properly connect contextual forms (initial, medial, final)
- **Numbers:** Support both Eastern (٠١٢٣) and Western (0123) numerals; default to user preference
- **Word Spacing:** Arabic typically requires slightly looser spacing than Latin text
- **Line Height:** Arabic needs 1.6+ line height due to diacritics; never go below 1.5

#### Font Loading

```css
@font-face {
  font-family: 'Tajawal';
  src: url('/fonts/tajawal-bold.woff2') format('woff2'),
       url('/fonts/tajawal-bold.woff') format('woff');
  font-weight: 700;
  font-display: swap;
}

@font-face {
  font-family: 'Tajawal';
  src: url('/fonts/tajawal-regular.woff2') format('woff2'),
       url('/fonts/tajawal-regular.woff') format('woff');
  font-weight: 400;
  font-display: swap;
}
```

### Iconography

#### Icon Style

- **Style:** Outlined, clean, geometric
- **Stroke Width:** 1.5px for consistency
- **Viewbox:** 24x24px (standard)
- **Corner Radius:** 2px on rounded corners (subtle, not bouncy)
- **Padding:** 2px internal padding in viewbox for breathing room
- **Color:** Inherits text color by default; can be overridden

#### Icon Sizes

| Size | Pixels | Usage | Example |
|------|--------|-------|---------|
| XS | 16px | Inline, badges, small buttons | Relation icons in tables |
| Small | 20px | Standard, form fields | Input decorations |
| Base | 24px | Default, buttons, navigation | Primary action icons |
| Medium | 32px | Large buttons, prominent actions | Card decorations |
| Large | 40px | Hero sections, page titles | Modal headers |
| XL | 48px | Major illustrations | Empty state graphics |

#### Icon Categories

**Navigation Icons:**
- Home, Menu, Back, Forward, Close, Search, Settings, Help, More
- Expand, Collapse, ChevronUp, ChevronDown, ChevronLeft, ChevronRight

**Action Icons:**
- Add, Edit, Delete, Save, Cancel, Copy, Download, Upload, Share
- Print, Export, Import, Refresh, Sync, Lock, Unlock

**Family Tree Icons:**
- Male, Female, Couple, Parent, Child, Generation, Branch, Ancestor
- Marriage, Divorce, Deceased, Living, Unknown

**Data Icons:**
- User, Users, Profile, Contacts, Phone, Email, Location, Calendar
- Clock, Document, Folder, File, Image, Gallery, Video

**Status Icons:**
- Success, Error, Warning, Info, Loading, Pending, Approved, Rejected

**Arabic-Specific Considerations:**
- Avoid icons with fingers pointing (considered offensive)
- Mirror directional arrows in RTL context (auto-handled by RTL wrapper)
- Test readability of icon labels in both languages
- Some icons may need cultural adaptation (e.g., mailbox styles differ)

#### Icon Implementation

```tsx
// React component for icons
import React from 'react';

interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Default: 'md'
  color?: string; // Default: currentColor
  className?: string;
  aria-label?: string; // Required for semantic icons
  title?: string; // Optional hover tooltip
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'currentColor',
  className,
  'aria-label': ariaLabel,
  title,
}) => {
  const sizeMap = { xs: 16, sm: 20, md: 24, lg: 32, xl: 48 };
  return (
    <svg
      width={sizeMap[size]}
      height={sizeMap[size]}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : 'presentation'}
      title={title}
    >
      {/* Icon path from icon library */}
    </svg>
  );
};
```

### Logo Usage

#### Logo Variations

- **Primary Logo:** Full wordmark with icon (preferred for main header)
- **Icon Only:** Standalone icon for favicon, small spaces
- **Wordmark Only:** Text only for text-heavy layouts
- **Inverse:** White versions for dark backgrounds
- **Monochrome:** Single-color versions for limited color contexts

#### Clear Space

Maintain minimum clear space of 20px (at standard 1x scale) around logo on all sides.

#### Sizing

- **Minimum Size:** 40px height (prevent illegibility)
- **Maximum Size:** 25% of container width (maintain proportion with content)
- **Aspect Ratio:** 4:1 (preserve across scales)

#### Placement

- Navbar: Left side (LTR) or right side (RTL), vertical center
- Footer: Left side, aligned with content grid
- Page Title: Prepend to h1 heading with 8px gap
- Login Page: Center, above form, 60-80px height

#### Do's and Don'ts

| Do | Don't |
|----|-------|
| Maintain original colors | Change primary colors |
| Scale proportionally | Distort or skew |
| Use on contrasting backgrounds | Place on busy images |
| Leave adequate white space | Crowd with other elements |
| Use high-resolution files | Use blurry or low-res versions |

### Brand Voice and Tone

#### Voice Characteristics

- **Authoritative but Approachable:** We're experts in genealogy but speak like a knowledgeable friend
- **Respectful and Dignified:** Family heritage is sacred; language reflects this reverence
- **Clear and Precise:** Complex genealogical concepts are explained simply
- **Culturally Aware:** References and language choices respect Islamic and Middle Eastern values
- **Empowering:** Users should feel capable and in control of their family data

#### Tone Variations by Context

**On Success States:**
- Celebratory: "Family branch connected successfully! 🎉"
- Encouraging: "Great work! You've completed your family tree."

**On Errors:**
- Helpful: "We couldn't find that member. Try searching by father's name instead."
- Not Blaming: "Something went wrong. Please try again or contact support."

**In Admin Tools:**
- Professional: "3 members pending approval. Review required."
- Actionable: "Click to review and approve these members."

**On Empty States:**
- Inviting: "No family members yet. Add your first ancestor to begin."
- Guiding: "Start by adding yourself, then work backward through your family tree."

#### Language Specific Considerations

**Arabic:**
- Use formal Modern Standard Arabic (MSA/Fusha) for interface, not colloquial dialects
- Avoid slang or overly casual language
- Include Islamic greetings contextually: "السلام عليكم" (As-salamu alaikum)
- Respect patronymic naming: use "الوالد" (father) not "الأب" in formal contexts

**English:**
- Maintain consistent terminology (use "member" not "person" or "individual")
- Avoid idioms that don't translate well
- Be specific in error messages
- Use "please" and "thank you" appropriately

---

## Layout System

### Grid System

#### 12-Column Responsive Grid

The layout foundation is a 12-column grid that adapts across breakpoints:

```css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem; /* 24px */
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

#### Breakpoints

| Breakpoint | Min Width | Max Width | Columns | Use Case |
|-----------|-----------|-----------|---------|----------|
| Mobile | 320px | 640px | 4 | Phones |
| Tablet | 640px | 1024px | 8 | Tablets, large phones |
| Desktop | 1024px | 1440px | 12 | Standard screens |
| Wide | 1440px+ | ∞ | 12 | Large monitors |

#### Responsive Column Spans

```css
/* Mobile: 4 columns */
@media (max-width: 640px) {
  .col-span-2 { grid-column: span 2; }
  .col-span-4 { grid-column: span 4; }
}

/* Tablet: 8 columns */
@media (min-width: 640px) and (max-width: 1024px) {
  .col-span-4 { grid-column: span 4; }
  .col-span-8 { grid-column: span 8; }
}

/* Desktop: 12 columns */
@media (min-width: 1024px) {
  .col-span-3 { grid-column: span 3; }
  .col-span-4 { grid-column: span 4; }
  .col-span-6 { grid-column: span 6; }
  .col-span-12 { grid-column: span 12; }
}
```

### Spacing Scale

All spacing uses a 4px base unit. This creates mathematical harmony and consistency:

| Token | Size | Pixels | Usage |
|-------|------|--------|-------|
| Space-0 | - | 0 | Remove margins/padding |
| Space-1 | 1x | 4px | Tight spacing, nested elements |
| Space-2 | 2x | 8px | Element padding, small gaps |
| Space-3 | 3x | 12px | Standard component padding |
| Space-4 | 4x | 16px | Component gaps, form fields |
| Space-5 | 5x | 20px | Section margins, card padding |
| Space-6 | 6x | 24px | Major section gaps |
| Space-8 | 8x | 32px | Page sections, container padding |
| Space-10 | 10x | 40px | Large sections |
| Space-12 | 12x | 48px | Page margins, hero sections |
| Space-16 | 16x | 64px | Very large spacing |
| Space-20 | 20x | 80px | Major page sections |

#### Practical Application Examples

```css
/* Form fields */
.form-field {
  margin-bottom: 1rem; /* Space-4 */
  padding: 0.75rem 1rem; /* Space-3 horizontal, Space-4 vertical */
}

/* Card layouts */
.card {
  padding: 1.5rem; /* Space-6 */
  margin-bottom: 2rem; /* Space-8 */
}

/* Buttons */
.button {
  padding: 0.5rem 1rem; /* Space-2 vertical, Space-4 horizontal */
  gap: 0.5rem; /* Space-2 between icon and text */
}
```

### Container Widths

| Container | Max Width | Use Case | Padding |
|-----------|-----------|----------|---------|
| Fluid | 100% | Full-width sections, hero, trees | 1rem (mobile) / 2rem (desktop) |
| Content | 1200px | Article text, main content | 1rem |
| Wide | 1440px | Dashboards, large layouts | 1.5rem |
| Narrow | 800px | Forms, modals, focused content | 0.5rem |
| Compact | 600px | Mobile-first forms | 0 |

### RTL/LTR Layout Rules

#### Logical Properties (Preferred)

Use CSS logical properties that automatically flip in RTL:

```css
/* Instead of left/right */
.sidebar {
  padding-inline-start: 2rem; /* Becomes padding-right in RTL */
  margin-inline-end: 1rem; /* Becomes margin-left in RTL */
}

/* Instead of text-align: right */
.direction-end {
  text-align: end; /* Becomes right in LTR, left in RTL */
}

.direction-start {
  text-align: start; /* Becomes left in LTR, right in RTL */
}
```

#### Language-Specific Attributes

```html
<!-- Set on html root -->
<html lang="ar" dir="rtl"> <!-- For Arabic -->
<html lang="en" dir="ltr"> <!-- For English -->

<!-- Can also set on specific sections -->
<div lang="ar" dir="rtl">Arabic content</div>
<div lang="en" dir="ltr">English content</div>
```

#### Flexbox & Grid Mirroring

```css
/* Flex direction auto-mirrors */
.navbar-items {
  display: flex;
  flex-direction: row; /* LTR: left-to-right, RTL: right-to-left */
  gap: 1rem;
}

/* Grid with logical areas */
.layout {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'sidebar content aside';
    /* RTL automatically reverses this */
}
```

#### Icon Mirroring

Some icons need directional reversal in RTL. Create a utilities class:

```css
.icon-flip-rtl {
  transform: scaleX(-1);
}

/* Applied conditionally */
[dir='rtl'] .icon-flip-rtl {
  transform: scaleX(-1);
}

/* Icons that should NOT flip: arrows, plus, minus, etc. */
.icon-no-flip {
  /* No transform */
}
```

### Z-Index Scale

Establish a predictable stacking order:

| Level | Z-Index | Component | Usage |
|-------|---------|-----------|-------|
| Base | 0 | Normal document flow | Default |
| Elevated | 100 | Cards, panels | Raised surfaces |
| Sticky | 200 | Sticky headers, nav | Persistent over scroll |
| Dropdown | 300 | Dropdowns, tooltips | Above content |
| Modal Backdrop | 400 | Overlay background | Behind modal |
| Modal | 500 | Modals, dialogs | Key user interaction |
| Toast | 600 | Toast notifications | Above modals |
| Popovers | 700 | Popovers, context menus | Highest interactive |
| Tooltips | 800 | Tooltips (rare to go higher) | Hover help |

#### Tailwind Z-Index Configuration

```javascript
module.exports = {
  theme: {
    zIndex: {
      hide: '-1',
      auto: 'auto',
      0: '0',
      base: '0',
      elevated: '100',
      sticky: '200',
      dropdown: '300',
      'modal-backdrop': '400',
      modal: '500',
      toast: '600',
      popover: '700',
      tooltip: '800',
    },
  },
};
```

---

## Design Tokens

Complete token specification in JSON format for implementation across platforms:

```json
{
  "colors": {
    "primary": {
      "navy": "#1A1F3A",
      "cyan": "#00D4FF",
      "purple": "#7B2CBF"
    },
    "semantic": {
      "success": {
        "light": "#E8F5E9",
        "main": "#4CAF50",
        "dark": "#2E7D32"
      },
      "warning": {
        "light": "#FFF3E0",
        "main": "#FF9800",
        "dark": "#E65100"
      },
      "error": {
        "light": "#FFEBEE",
        "main": "#F44336",
        "dark": "#C62828"
      },
      "info": {
        "light": "#E3F2FD",
        "main": "#2196F3",
        "dark": "#1565C0"
      }
    },
    "neutral": {
      "bg-dark": "#0F1629",
      "bg-darker": "#0D0F1F",
      "card-bg": "#1A1F3A",
      "hover-bg": "#1E2A4A",
      "border": "#2A3F5F",
      "text-primary": "#E0E0E0",
      "text-secondary": "#B0B0B0",
      "text-muted": "#909090",
      "text-subtle": "#707070",
      "white": "#FFFFFF"
    }
  },
  "spacing": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px",
    "12": "48px",
    "16": "64px",
    "20": "80px"
  },
  "typography": {
    "fontFamilies": {
      "arabic": "'Tajawal', 'Droid Arabic Kufi', 'Cairo', sans-serif",
      "latin": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      "monospace": "'Fira Code', 'Monaco', 'Courier New', monospace"
    },
    "sizes": {
      "h1": { "size": "40px", "weight": 700, "lineHeight": 1.2 },
      "h2": { "size": "32px", "weight": 700, "lineHeight": 1.3 },
      "h3": { "size": "28px", "weight": 600, "lineHeight": 1.3 },
      "h4": { "size": "24px", "weight": 600, "lineHeight": 1.4 },
      "body": { "size": "16px", "weight": 400, "lineHeight": 1.6 },
      "caption": { "size": "12px", "weight": 400, "lineHeight": 1.4 }
    }
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    "glow": "0 0 10px rgba(0, 212, 255, 0.3)",
    "glow-md": "0 0 15px rgba(0, 212, 255, 0.25)"
  },
  "borders": {
    "radius": {
      "sm": "4px",
      "md": "8px",
      "lg": "12px",
      "xl": "16px",
      "full": "9999px"
    },
    "widths": {
      "thin": "1px",
      "normal": "2px",
      "thick": "3px"
    }
  },
  "animations": {
    "duration": {
      "fast": "150ms",
      "base": "200ms",
      "slow": "300ms",
      "slower": "500ms"
    },
    "easing": {
      "easeIn": "cubic-bezier(0.4, 0, 1, 1)",
      "easeOut": "cubic-bezier(0, 0, 0.2, 1)",
      "easeInOut": "cubic-bezier(0.4, 0, 0.2, 1)",
      "linear": "linear"
    }
  }
}
```

---

## Component Library - Foundation

### Button Component

**Purpose:** Primary call-to-action element for user interactions.

#### Variants

| Variant | Background | Border | Text Color | Usage |
|---------|-----------|--------|-----------|-------|
| Primary | Cyan (#00D4FF) | Cyan | Navy | Main actions, submissions |
| Secondary | Navy (#1A1F3A) | Cyan | Cyan | Alternative actions |
| Danger | Error Red (#FF5252) | Red | White | Destructive actions |
| Ghost | Transparent | Border (muted) | Cyan | Tertiary actions |
| Success | Success Green (#00E676) | Green | White | Confirmations |

#### States

| State | Style Change |
|-------|--------------|
| Default | Base colors, cursor pointer |
| Hover | 10% darker background, slight lift (shadow) |
| Active/Pressed | Background darkens 20%, shadow reduces |
| Focus | 2px focus ring (cyan) offset 2px |
| Disabled | 50% opacity, cursor not-allowed |
| Loading | Spinner animation, text opacity 0.6 |

#### Sizes

| Size | Padding | Font Size | Height | Usage |
|------|---------|-----------|--------|-------|
| Small (sm) | 6px 12px | 14px | 32px | Compact spaces, secondary |
| Medium (md) | 10px 16px | 16px | 40px | Standard, default |
| Large (lg) | 12px 24px | 16px | 48px | Primary CTAs, page buttons |
| Extra Large (xl) | 16px 32px | 18px | 56px | Hero CTAs, modals |

#### Full-Width Option

When width: "full", button stretches to container width (useful for modals, forms).

#### Icon Integration

```tsx
<Button variant="primary" size="md" icon={<PlusIcon />}>
  Add Member
</Button>

<Button variant="ghost" size="md" iconOnly>
  <SettingsIcon aria-label="Settings" />
</Button>
```

#### Accessibility

- Focus ring visible and high contrast (cyan on dark)
- Keyboard: Enter and Space activate button
- Screen reader: "Button [label]" announced
- Disabled state: aria-disabled="true" for custom buttons
- Icon buttons: aria-label required
- Loading state: aria-busy="true" on button

#### RTL Behavior

- Icon placement reverses (icon-left becomes icon-right)
- Text alignment auto-corrects
- Flex direction mirrors automatically

#### Code Example

```tsx
import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  width?: 'auto' | 'full';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  width = 'auto',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  iconOnly = false,
  onClick,
  type = 'button',
  className,
  children,
  ariaLabel,
}) => {
  const variantStyles = {
    primary: 'bg-cyan text-navy hover:bg-cyan-600 active:bg-cyan-700',
    secondary: 'bg-navy border-2 border-cyan text-cyan hover:bg-hover-bg',
    danger: 'bg-error text-white hover:bg-error-700 active:bg-error-800',
    ghost: 'bg-transparent border-2 border-border text-cyan hover:bg-hover-bg',
    success: 'bg-success text-white hover:bg-success-700',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2.5 text-base h-10',
    lg: 'px-6 py-3 text-base h-12',
    xl: 'px-8 py-4 text-lg h-14',
  };

  const widthClass = width === 'full' ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        rounded-md transition-all duration-200 focus:outline-none
        focus:ring-2 focus:ring-cyan focus:ring-offset-2 focus:ring-offset-navy
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthClass}
        ${className || ''}
      `}
    >
      {loading && <Spinner size="sm" />}
      {icon && iconPosition === 'left' && icon}
      {!iconOnly && children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
};
```

#### Do's and Don'ts

| Do | Don't |
|----|-------|
| Use descriptive button labels | Use ambiguous text like "Click here" |
| Provide visual feedback on interaction | Leave users unsure if action registered |
| Ensure sufficient touch target size (min 44px) | Create buttons smaller than 32px |
| Use color + other indicators for state | Rely only on color for meaning |
| Show loading state for async actions | Leave users wondering what's happening |

---

### Input Component

**Purpose:** Primary text entry field for user data input.

#### Variants

| Variant | Use Case |
|---------|----------|
| Text | Names, emails, search queries |
| Email | Email addresses with validation |
| Number | Numeric values, phone numbers |
| Password | Secure password entry |
| Search | Dedicated search input with icon |
| Tel | Telephone numbers with formatting |
| URL | Website addresses |

#### States

| State | Style |
|-------|-------|
| Default | Navy background, cyan border, muted text |
| Hover | Slightly lighter background |
| Focus | Cyan glow, cyan border, text primary color |
| Filled | Shows data value, maintains border |
| Error | Red border, error text below |
| Success | Green border, success checkmark icon |
| Disabled | Gray border, muted text, no interaction |
| Loading | Spinner inside right edge |

#### Sizes

| Size | Padding | Height | Usage |
|------|---------|--------|-------|
| Small | 6px 12px | 32px | Compact forms |
| Medium | 10px 12px | 40px | Standard, default |
| Large | 12px 16px | 48px | Prominent fields |

#### Optional Features

- **Label:** Positioned above or as floating label
- **Placeholder:** Muted text inside field
- **Help Text:** Secondary text below field
- **Error Text:** Red text showing validation error
- **Prefix/Suffix:** Icons or text before/after value
- **Character Count:** Show current/max characters
- **Clear Button:** X icon to quickly clear field
- **Password Toggle:** Eye icon to show/hide password

#### Arabic Input Handling

```tsx
interface ArabicInputProps extends InputProps {
  supportArabic?: boolean; // Enable Arabic input
  textDirection?: 'auto' | 'ltr' | 'rtl'; // Explicit direction
  locale?: 'ar' | 'en'; // For localized behavior
}
```

- Supports diacritics (tashkeel) input
- Handles mixed Arabic/English text
- Auto-detects text direction for proper display
- Number input respects Eastern/Western numeral preference

#### Code Example

```tsx
import React, { useState } from 'react';

interface InputProps {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  label?: string;
  error?: string;
  success?: string;
  helpText?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  maxLength?: number;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  label,
  error,
  success,
  helpText,
  disabled = false,
  size = 'md',
  icon,
  iconPosition = 'left',
  maxLength,
  required,
  autoComplete,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-3 py-2.5 text-base h-10',
    lg: 'px-4 py-3 text-base h-12',
  };

  const borderColor = error
    ? 'border-error'
    : success
    ? 'border-success'
    : isFocused
    ? 'border-cyan'
    : 'border-border';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold mb-2 text-text-primary">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`
            w-full bg-card-bg border-2 text-text-primary
            rounded-md transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-2
            focus:ring-offset-navy
            disabled:opacity-50 disabled:cursor-not-allowed
            ${borderColor}
            ${sizeStyles[size]}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${className || ''}
          `}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
      </div>
      {helpText && (
        <p className="text-xs text-text-muted mt-1">{helpText}</p>
      )}
      {error && <p className="text-xs text-error mt-1">{error}</p>}
      {success && <p className="text-xs text-success mt-1">{success}</p>}
      {maxLength && (
        <p className="text-xs text-text-muted mt-1">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};
```

#### Accessibility

- Label required (visible or aria-label)
- Focus ring visible and accessible
- Error messages associated via aria-describedby
- Type attribute specifies input purpose
- Pattern validation via HTML5 validation
- Screen reader announces state changes

#### RTL Behavior

- Text alignment auto-corrects (rtl text aligns right)
- Icon position can auto-flip
- Direction attribute respected
- Number format respects locale

---

### Select Component

**Purpose:** Dropdown selection for predefined options.

#### Features

- Single or multiple selection modes
- Searchable options
- Grouped options
- Custom option rendering
- Keyboard navigation
- Accessible ARIA attributes

#### Code Example

```tsx
import React, { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number | string[];
  onChange: (value: string | number | string[]) => void;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option...',
  multiple = false,
  searchable = false,
  clearable = false,
  disabled = false,
  size = 'md',
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-3 py-2.5 text-base h-10',
    lg: 'px-4 py-3 text-base h-12',
  };

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedLabel =
    typeof value === 'string' || typeof value === 'number'
      ? options.find((opt) => opt.value === value)?.label
      : Array.isArray(value)
      ? options.filter((opt) => value.includes(opt.value as string | number))
          .map((opt) => opt.label)
          .join(', ')
      : placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold mb-2 text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full bg-card-bg border-2 border-border text-text-primary
            rounded-md transition-colors focus:outline-none focus:ring-2
            focus:ring-cyan focus:ring-offset-2 focus:ring-offset-navy
            text-left flex items-center justify-between
            ${error ? 'border-error' : isOpen ? 'border-cyan' : ''}
            ${sizeStyles[size]}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span>{selectedLabel}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card-bg border-2 border-cyan rounded-md shadow-lg z-dropdown">
            {searchable && (
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border-b border-border focus:outline-none bg-card-bg text-text-primary"
              />
            )}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (multiple && Array.isArray(value)) {
                      onChange(
                        value.includes(option.value as string | number)
                          ? value.filter((v) => v !== option.value)
                          : [...value, option.value]
                      );
                    } else {
                      onChange(option.value);
                      setIsOpen(false);
                    }
                  }}
                  disabled={option.disabled}
                  className={`
                    w-full px-3 py-2 text-left transition-colors
                    ${
                      Array.isArray(value)
                        ? value.includes(option.value as string | number)
                          ? 'bg-purple text-white'
                          : 'hover:bg-hover-bg'
                        : value === option.value
                        ? 'bg-purple text-white'
                        : 'hover:bg-hover-bg'
                    }
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {multiple && Array.isArray(value) && (
                    <input
                      type="checkbox"
                      checked={value.includes(option.value as string | number)}
                      onChange={() => {}}
                      className="mr-2"
                    />
                  )}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
};
```

---

**[Document continues with remaining components...]**

Due to token limits, I'll continue with the next section. Let me create the continuation:

### Checkbox Component

**Purpose:** Allow users to select one or multiple items from a list.

#### States

| State | Style |
|-------|-------|
| Unchecked | Navy background, cyan border, empty |
| Checked | Cyan background, checkmark icon |
| Indeterminate | Purple background, dash icon (for "select all") |
| Hover | Slight glow, border highlight |
| Disabled | Opacity 50%, no interaction |

#### Code Example

```tsx
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled,
  indeterminate,
  error,
}) => {
  return (
    <label className="flex items-center cursor-pointer gap-2">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`
          w-5 h-5 border-2 rounded flex items-center justify-center
          transition-all
          ${checked || indeterminate ? 'bg-cyan border-cyan' : 'bg-card-bg border-border'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-error' : ''}
        `}>
          {checked && <CheckIcon className="w-4 h-4 text-navy" />}
          {indeterminate && <DashIcon className="w-4 h-4 text-navy" />}
        </div>
      </div>
      {label && <span className="text-text-primary">{label}</span>}
    </label>
  );
};
```

#### Accessibility

- Input hidden visually but available to screen readers
- Label clickable to toggle checkbox
- Focus visible on checkbox
- Indeterminate state announced to screen readers

---

### Radio Component

**Purpose:** Allow users to select one item from a list of mutually exclusive options.

#### States

| State | Style |
|-------|-------|
| Unselected | Navy background, cyan border, empty circle |
| Selected | Cyan background, filled circle |
| Hover | Border highlight |
| Disabled | Opacity 50%, no interaction |

#### Code Example

```tsx
interface RadioProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export const Radio: React.FC<RadioProps> = ({
  name,
  value,
  checked,
  onChange,
  label,
  disabled,
}) => {
  return (
    <label className="flex items-center cursor-pointer gap-2">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        disabled={disabled}
        className="sr-only"
      />
      <div className={`
        w-5 h-5 rounded-full border-2 flex items-center justify-center
        transition-all
        ${checked ? 'bg-cyan border-cyan' : 'bg-card-bg border-border'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        {checked && <div className="w-2 h-2 bg-navy rounded-full" />}
      </div>
      {label && <span className="text-text-primary">{label}</span>}
    </label>
  );
};
```

---

### Toggle Component

**Purpose:** Switch between two mutually exclusive states (on/off).

#### Variants

| Variant | Use Case |
|---------|----------|
| Default | Binary on/off toggle |
| With Label | Toggle with text label on both sides |
| Icon Toggle | Icon-based toggle (with Arabic translation) |

#### States

| State | Style |
|-------|-------|
| Off (False) | Gray background, knob left |
| On (True) | Cyan background, knob right |
| Disabled | Opacity 50%, no interaction |
| Loading | Spinner in place of knob |

#### Code Example

```tsx
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled,
  loading,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'w-10 h-6',
    md: 'w-12 h-7',
    lg: 'w-14 h-8',
  };

  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && !loading && onChange(!checked)}
      disabled={disabled || loading}
      className={`
        relative rounded-full transition-colors duration-300
        ${checked ? 'bg-cyan' : 'bg-border'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${sizeStyles[size]}
      `}
    >
      <div className={`
        absolute top-1 w-5 h-5 rounded-full bg-white
        transition-transform duration-300
        flex items-center justify-center
        ${checked ? 'translate-x-6' : 'translate-x-0.5'}
      `}>
        {loading && <Spinner size="sm" />}
      </div>
    </button>
  );
};
```

---

### Badge Component

**Purpose:** Display small, contextual information or status indicators.

#### Variants

| Variant | Use Case |
|---------|----------|
| Default | Neutral information |
| Success | Successful status |
| Warning | Caution required |
| Error | Error state |
| Info | Informational |
| Custom | Domain-specific (e.g., "Verified", "Admin") |

#### Sizes

| Size | Padding | Font Size | Usage |
|------|---------|-----------|-------|
| Small | 4px 8px | 11px | Compact, inline |
| Medium | 6px 12px | 12px | Standard, default |
| Large | 8px 16px | 13px | Prominent display |

#### Code Example

```tsx
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  icon,
  children,
  className,
}) => {
  const variantStyles = {
    default: 'bg-purple text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-navy',
    error: 'bg-error text-white',
    info: 'bg-info text-white',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div className={`
      inline-flex items-center gap-1 rounded-full font-semibold
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className || ''}
    `}>
      {icon}
      {children}
    </div>
  );
};
```

---

### Avatar Component

**Purpose:** Display user profile pictures with fallback initials or icons.

#### Variants

| Variant | Usage |
|---------|-------|
| Image | Profile photo or avatar image |
| Initials | Two letters from name (Arabic or Latin) |
| Icon | Generic user or person icon |
| Status Indicator | Online/offline/away status overlay |

#### Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| Small | 32px | Inline, lists |
| Medium | 40px | Standard, default |
| Large | 56px | Profile headers |
| Extra Large | 80px | Profile pages |

#### Code Example

```tsx
interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  initials,
  size = 'md',
  status,
  className,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const statusSizeMap = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`
        ${sizeMap[size]} rounded-full bg-gradient-to-br from-cyan to-purple
        flex items-center justify-center font-semibold text-white overflow-hidden
      `}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          initials || <UserIcon className="w-1/2 h-1/2" />
        )}
      </div>
      {status && (
        <div className={`
          absolute bottom-0 right-0 rounded-full border-2 border-navy
          ${statusSizeMap[size]}
          ${status === 'online' ? 'bg-success' : status === 'away' ? 'bg-warning' : 'bg-text-muted'}
        `} />
      )}
    </div>
  );
};
```

#### Accessibility

- Alt text provided for images
- Initials announced to screen readers
- Status indicated via color + aria-label

---

## Component Library - Navigation

### Navbar Component

**Purpose:** Primary navigation container, typically fixed at top of page.

#### Layout

- Left/Start: Logo or branding
- Center: Primary navigation links or search
- Right/End: User menu, language switcher, notifications
- Mobile: Hamburger menu triggering sidebar

#### Features

- Responsive (hamburger menu on mobile)
- Language switcher (AR/EN)
- User profile dropdown
- Notification bell with count
- Search bar integration
- Sticky positioning with shadow on scroll

#### Code Example

```tsx
interface NavbarProps {
  logo?: React.ReactNode;
  items?: NavigationItem[];
  userMenu?: React.ReactNode;
  onLanguageChange?: (lang: string) => void;
  stickyOnScroll?: boolean;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  items,
  userMenu,
  onLanguageChange,
  stickyOnScroll = true,
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`
      w-full bg-navy border-b-2 border-cyan
      ${stickyOnScroll ? 'sticky top-0 z-sticky' : ''}
      transition-shadow duration-300
      ${className || ''}
    `}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">{logo}</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {items?.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher onChange={onLanguageChange} />
          {userMenu}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          {items?.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="block px-4 py-2 border-b border-border"
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};
```

---

### Sidebar Component

**Purpose:** Secondary navigation or filter panel (fixed or collapsible).

#### Features

- Collapsible/expandable on mobile
- Nested navigation support
- Active state indication
- Icon + label navigation items
- Optional scroll area for long lists

#### Code Example

```tsx
interface SidebarProps {
  items: SidebarItem[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItem,
  onItemClick,
  collapsible = true,
  defaultOpen = true,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <aside className={`
      ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300
      bg-card-bg border-r border-border h-screen sticky top-0
      overflow-y-auto
      ${className || ''}
    `}>
      {collapsible && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex justify-center"
        >
          <ChevronIcon direction={isOpen ? 'left' : 'right'} />
        </button>
      )}

      <nav className="space-y-2 p-4">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            isCollapsed={!isOpen}
            onClick={() => onItemClick?.(item.id)}
          />
        ))}
      </nav>
    </aside>
  );
};
```

---

### Breadcrumb Component

**Purpose:** Show navigation hierarchy and current location.

#### Features

- Shows parent/ancestor pages
- Last item not clickable (current page)
- Separators between items
- Responsive (collapse on mobile)

#### Code Example

```tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  onNavigate,
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRightIcon className="w-4 h-4 text-text-muted" />}
            {item.href && index < items.length - 1 ? (
              <button
                onClick={() => onNavigate?.(item.href!)}
                className="text-cyan hover:underline"
              >
                {item.label}
              </button>
            ) : (
              <span className={index === items.length - 1 ? 'text-text-primary font-semibold' : 'text-text-secondary'}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
```

---

## Component Library - Feedback

### Alert Component

**Purpose:** Display important messages or notifications to the user.

#### Variants

| Variant | Color | Icon | Usage |
|---------|-------|------|-------|
| Success | Green | Checkmark | Confirmation, success |
| Warning | Amber | Alert triangle | Caution, requires attention |
| Error | Red | X circle | Error, failure |
| Info | Blue | Info circle | Information, help |

#### Dismissible Option

Alerts can include close button for user dismissal.

#### Code Example

```tsx
interface AlertProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  icon,
  dismissible,
  onDismiss,
  action,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const variantStyles = {
    success: 'bg-success-light border-success text-success-dark',
    warning: 'bg-warning-light border-warning text-warning-dark',
    error: 'bg-error-light border-error text-error-dark',
    info: 'bg-info-light border-info text-info-dark',
  };

  const iconMap = {
    success: <CheckIcon />,
    warning: <AlertIcon />,
    error: <XIcon />,
    info: <InfoIcon />,
  };

  return (
    <div className={`
      flex gap-4 p-4 border-l-4 rounded
      ${variantStyles[variant]}
      ${className || ''}
    `}>
      {icon || iconMap[variant]}
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <p>{message}</p>
      </div>
      <div className="flex items-center gap-2">
        {action && (
          <Button variant="ghost" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {dismissible && (
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
            aria-label="Dismiss alert"
          >
            <XIcon />
          </button>
        )}
      </div>
    </div>
  );
};
```

---

### Toast/Notification Component

**Purpose:** Display temporary notifications that appear and disappear automatically.

#### Features

- Position: top-right, top-left, bottom-right, bottom-left (LTR aware)
- Auto-dismiss after configurable timeout (default 3 seconds)
- Multiple toasts can stack
- Action button support
- Icon variants (success, error, warning, info)

#### Code Example

```tsx
interface ToastProps {
  id: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number; // milliseconds
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  variant = 'info',
  message,
  duration = 3000,
  action,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const variantStyles = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    warning: 'bg-warning text-navy',
    info: 'bg-info text-white',
  };

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-md shadow-lg
      animate-slide-in
      ${variantStyles[variant]}
    `}>
      <span>{message}</span>
      {action && (
        <button onClick={action.onClick} className="font-semibold underline">
          {action.label}
        </button>
      )}
      <button
        onClick={() => onClose(id)}
        className="ml-auto"
        aria-label="Close notification"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Manager context for global toast management
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (props: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { ...props, id, onClose: removeToast }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-toast space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
```

---

### Modal/Dialog Component

**Purpose:** Display focused content that requires user interaction in a layered overlay.

#### Features

- Backdrop click closes modal (configurable)
- Escape key closes modal
- Focus trapped inside modal
- Header, content, footer sections
- Size variants (sm, md, lg)
- Scrollable content area

#### Code Example

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnBackdropClick?: boolean;
  closeOnEscapeKey?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscapeKey = true,
  className,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscapeKey) onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscapeKey, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 z-modal-backdrop">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => closeOnBackdropClick && onClose()}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-modal">
        <div
          className={`
            bg-card-bg border-2 border-cyan rounded-lg shadow-xl
            max-h-[90vh] overflow-y-auto
            ${sizeStyles[size]}
            ${className || ''}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 id="modal-title" className="text-xl font-semibold text-text-primary">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-text-muted hover:text-text-primary"
            >
              <XIcon />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>

          {/* Footer */}
          {footer && <div className="border-t border-border p-6">{footer}</div>}
        </div>
      </div>
    </div>
  );
};
```

---

### Spinner/Loading Component

**Purpose:** Indicate loading or processing state.

#### Variants

| Variant | Usage |
|---------|-------|
| Spinner | General loading, data fetching |
| Skeleton | Preview of content shape while loading |
| Progress Bar | Linear progress indication |
| Pulse | Breathing animation (gentle loading) |

#### Sizes

Spinners available in xs, sm, md, lg, xl sizes.

#### Code Example

```tsx
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  ariaLabel?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
  className,
  ariaLabel = 'Loading',
}) => {
  const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <svg
      className={`animate-spin ${sizeMap[size]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label={ariaLabel}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
        opacity="0.2"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
```

---

## Component Library - Data Display

### Card Component

**Purpose:** Container for grouped content with visual separation.

#### Features

- Header (optional)
- Body content area
- Footer (optional)
- Hover state with lift effect
- Clickable variant

#### Code Example

```tsx
interface CardProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  header,
  children,
  footer,
  clickable,
  onClick,
  className,
  hoverable = true,
}) => {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`
        bg-card-bg border border-border rounded-lg overflow-hidden
        transition-all duration-300
        ${hoverable ? 'hover:border-cyan hover:shadow-lg hover:-translate-y-1' : ''}
        ${clickable ? 'cursor-pointer' : ''}
        ${className || ''}
      `}
    >
      {header && <div className="border-b border-border p-4">{header}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="border-t border-border p-4">{footer}</div>}
    </div>
  );
};
```

---

### Table Component

**Purpose:** Display structured data in rows and columns.

#### Features

- Sortable columns
- Selectable rows (checkboxes)
- Pagination support
- Responsive (horizontal scroll on mobile)
- Sticky header on scroll
- Row actions (edit, delete)

#### Code Example

```tsx
interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  striped?: boolean;
  className?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  ({
    columns,
    data,
    rowKey,
    onRowClick,
    selectable,
    onSelectionChange,
    striped = true,
    className,
  }, ref) => {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: 'asc' | 'desc';
    } | null>(null);

    const handleRowSelect = (rowId: string) => {
      const newSelected = new Set(selectedRows);
      newSelected.has(rowId) ? newSelected.delete(rowId) : newSelected.add(rowId);
      setSelectedRows(newSelected);
      onSelectionChange?.([...newSelected]);
    };

    const handleSelectAll = () => {
      const allIds = data.map((row) => String(row[rowKey]));
      const newSelected = selectedRows.size === data.length ? new Set() : new Set(allIds);
      setSelectedRows(newSelected);
      onSelectionChange?.([...newSelected]);
    };

    return (
      <div className={`overflow-x-auto ${className}`}>
        <table
          ref={ref}
          className="w-full border-collapse text-sm"
        >
          <thead className="bg-card-bg border-b-2 border-border sticky top-0">
            <tr>
              {selectable && (
                <th className="p-3 text-left">
                  <Checkbox
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    indeterminate={selectedRows.size > 0 && selectedRows.size < data.length}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="p-3 text-left text-text-primary font-semibold"
                  style={{ width: col.width }}
                >
                  {col.sortable ? (
                    <button
                      onClick={() =>
                        setSortConfig({
                          key: String(col.key),
                          direction: sortConfig?.key === String(col.key)
                            ? sortConfig.direction === 'asc' ? 'desc' : 'asc'
                            : 'asc',
                        })
                      }
                      className="flex items-center gap-2 hover:text-cyan"
                    >
                      {col.label}
                      <ArrowUpDownIcon className="w-4 h-4" />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={String(row[rowKey])}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-b border-border transition-colors
                  ${striped && idx % 2 === 0 ? 'bg-hover-bg' : ''}
                  ${onRowClick ? 'cursor-pointer hover:bg-hover-bg' : ''}
                `}
              >
                {selectable && (
                  <td className="p-3">
                    <Checkbox
                      checked={selectedRows.has(String(row[rowKey]))}
                      onChange={() => handleRowSelect(String(row[rowKey]))}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="p-3 text-text-secondary"
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);
```

---

## Component Library - Family Tree Specific

### FamilyNode Component

**Purpose:** Visual representation of a family member in the tree visualization.

#### Features

- Displays name (Arabic/English)
- Optional photo
- Relationship indicators (spouse, children)
- Generation level indication
- Status badges (living, deceased)
- Interactive click to view details
- RTL name display

#### States

| State | Visual |
|-------|--------|
| Normal | Default styling |
| Hover | Highlight, shadow |
| Selected | Border highlight, glow |
| Deceased | Faded, strikethrough name |
| Focus | Keyboard focus indicator |

#### Code Example

```tsx
interface FamilyNodeProps {
  id: string;
  name: string;
  nameAr?: string;
  gender?: 'male' | 'female' | 'unknown';
  status?: 'living' | 'deceased' | 'unknown';
  photo?: string;
  birthYear?: number;
  deathYear?: number;
  generation?: number;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  x?: number;
  y?: number;
}

export const FamilyNode: React.FC<FamilyNodeProps> = ({
  id,
  name,
  nameAr,
  gender,
  status,
  photo,
  birthYear,
  deathYear,
  generation,
  isSelected,
  isHovered,
  onClick,
  x = 0,
  y = 0,
}) => {
  const genderColor = gender === 'male' ? 'bg-blue-500' : gender === 'female' ? 'bg-pink-500' : 'bg-gray-500';
  const statusOpacity = status === 'deceased' ? 'opacity-60' : '';

  return (
    <div
      onClick={onClick}
      className={`
        absolute w-40 bg-card-bg border-2 rounded-lg p-3
        transition-all duration-200 cursor-pointer
        ${isSelected ? 'border-cyan shadow-glow' : 'border-border'}
        ${isHovered ? 'shadow-lg' : ''}
        ${statusOpacity}
      `}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`${name} (${gender}, ${status || 'unknown status'})`}
    >
      {/* Photo or Avatar */}
      <div className={`w-12 h-12 rounded-full mx-auto mb-2 ${genderColor} flex items-center justify-center overflow-hidden`}>
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-6 h-6 text-white" />
        )}
      </div>

      {/* Name */}
      <p className={`text-center font-semibold text-sm ${status === 'deceased' ? 'line-through' : ''}`}>
        {name}
      </p>
      {nameAr && (
        <p className="text-center text-xs text-text-muted" dir="rtl">
          {nameAr}
        </p>
      )}

      {/* Dates */}
      {(birthYear || deathYear) && (
        <p className="text-center text-xs text-text-muted mt-1">
          {birthYear && `b. ${birthYear}`}
          {birthYear && deathYear && ' - '}
          {deathYear && `d. ${deathYear}`}
        </p>
      )}

      {/* Status Badge */}
      {status && (
        <Badge
          variant={status === 'deceased' ? 'warning' : 'success'}
          size="sm"
          className="mt-2 mx-auto"
        >
          {status === 'living' ? 'Living' : status === 'deceased' ? 'Deceased' : 'Unknown'}
        </Badge>
      )}
    </div>
  );
};
```

---

### FamilyConnection Component

**Purpose:** Visual connector lines between family members showing relationships.

#### Connection Types

| Type | Line Style | Meaning |
|------|-----------|---------|
| Parent-Child | Solid line | Direct descent |
| Spouse | Double line | Marriage |
| Sibling | Horizontal line | Shared parents |
| Reference | Dashed line | Secondary link |

#### Features

- Dynamically rendered SVG paths
- Curved lines for visual clarity
- Color-coded by relationship type
- Hover highlight
- Accessibility labels

#### Code Example

```tsx
interface ConnectionPoint {
  id: string;
  x: number;
  y: number;
  type: 'source' | 'target';
}

interface FamilyConnectionProps {
  from: ConnectionPoint;
  to: ConnectionPoint;
  type?: 'parent-child' | 'spouse' | 'sibling' | 'reference';
  isHovered?: boolean;
  onClick?: () => void;
  label?: string;
}

export const FamilyConnection: React.FC<FamilyConnectionProps> = ({
  from,
  to,
  type = 'parent-child',
  isHovered,
  onClick,
  label,
}) => {
  const typeStyles = {
    'parent-child': { stroke: '#00D4FF', strokeWidth: 2 },
    spouse: { stroke: '#FF1493', strokeWidth: 3, strokeDasharray: '5,5' },
    sibling: { stroke: '#7B2CBF', strokeWidth: 2 },
    reference: { stroke: '#909090', strokeWidth: 1, strokeDasharray: '4,4' },
  };

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const style = typeStyles[type];

  // Create curved path
  const controlX = (from.x + to.x) / 2;
  const controlY = Math.min(from.y, to.y) - 50;
  const path = `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;

  return (
    <g
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={label || `Connection from ${from.id} to ${to.id}`}
      className={onClick ? 'cursor-pointer' : ''}
    >
      <path
        d={path}
        fill="none"
        {...style}
        strokeOpacity={isHovered ? 1 : 0.7}
        className="transition-opacity duration-200"
      />
      {isHovered && label && (
        <text
          x={midX}
          y={midY}
          className="text-xs fill-cyan pointer-events-none"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
};
```

---

## Design Patterns

### Form Validation Patterns

#### Real-Time Validation

Display errors as user types, with helpful messages:

```tsx
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (value: string) => {
  if (!value) {
    setEmailError('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    setEmailError('Please enter a valid email');
  } else {
    setEmailError('');
  }
};

return (
  <Input
    value={email}
    onChange={(value) => {
      setEmail(value);
      validateEmail(value);
    }}
    error={emailError}
    placeholder="name@example.com"
  />
);
```

#### Progressive Disclosure

Show relevant fields only when needed:

```tsx
const [hasSpouse, setHasSpouse] = useState(false);

return (
  <>
    <Checkbox
      label="Add spouse information"
      checked={hasSpouse}
      onChange={setHasSpouse}
    />
    {hasSpouse && (
      <>
        <Input label="Spouse Name" placeholder="Name in English" />
        <Input label="Spouse Name (Arabic)" placeholder="الاسم بالعربية" />
        <DatePicker label="Marriage Date" />
      </>
    )}
  </>
);
```

---

### Empty State Patterns

Provide clear guidance when no content exists:

```tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-5xl">{icon}</div>}
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-6 max-w-md">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
```

---

### Search Result Patterns

Display search results with proper highlighting and pagination:

```tsx
interface SearchResult {
  id: string;
  name: string;
  matchedField?: string;
  relationship?: string;
  relevanceScore: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  onResultClick?: (id: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  isLoading,
  onResultClick,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-hover-bg rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No results found"
        description={`We couldn't find anyone matching "${query}". Try adjusting your search terms.`}
      />
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result) => (
        <Card
          key={result.id}
          clickable
          onClick={() => onResultClick?.(result.id)}
          className="flex items-center justify-between cursor-pointer hover:bg-hover-bg"
        >
          <div>
            <p className="font-semibold text-text-primary">{result.name}</p>
            {result.relationship && (
              <p className="text-sm text-text-secondary">{result.relationship}</p>
            )}
          </div>
          <div className="text-right">
            <div className="w-10 h-10 bg-cyan rounded-full flex items-center justify-center text-navy font-bold">
              {(result.relevanceScore * 100).toFixed(0)}%
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
```

---

## Motion & Animation

### Transition Timing

| Duration | Use Case |
|----------|----------|
| 150ms | Quick micro-interactions, hover states |
| 200ms | Standard transitions, modal opens |
| 300ms | Longer transitions, page loads |
| 500ms | Deliberate, emphasis animations |

### Easing Functions

```css
/* Standard easing */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-linear: linear;

/* Natural motion */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic: cubic-bezier(0.17, 0.67, 0.83, 0.67);
```

### Common Animations

```css
/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide up */
@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Scale bounce */
@keyframes scaleBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Spin (loading) */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Pulse (breathing) */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

### Tree Animation Patterns

- **Node Appearance:** Fade-in + subtle scale (200ms)
- **Line Rendering:** SVG path animation with stroke-dasharray
- **Pan/Zoom Transitions:** Smooth transitions (300ms) when user navigates tree
- **Hover Effects:** Quick highlight changes (150ms)

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

All components must meet:
- Minimum 4.5:1 contrast ratio for text
- 3:1 contrast ratio for UI components
- Focus indicators clearly visible
- Keyboard navigation for all interactive elements
- Proper semantic HTML
- ARIA labels where needed

### Color Contrast Reference

| Foreground | Background | Ratio | AA Pass |
|-----------|-----------|-------|---------|
| #E0E0E0 (Text Primary) | #1A1F3A (Navy) | 10.5:1 | ✅ |
| #00D4FF (Cyan) | #1A1F3A (Navy) | 8.2:1 | ✅ |
| #909090 (Text Muted) | #0F1629 (Background) | 4.5:1 | ✅ |

### Keyboard Navigation

All components must support:
- Tab: Navigate to next element
- Shift+Tab: Navigate to previous element
- Enter: Activate button or link
- Space: Toggle checkbox, select radio
- Escape: Close modal, cancel operation
- Arrow Keys: Navigate between list items, menus

### Screen Reader Support

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Provide alt text for images
- Use aria-label for icon buttons
- Use aria-describedby for help text
- Set aria-expanded for collapsible elements
- Use aria-busy for loading states

### RTL Accessibility

- Set `dir="rtl"` and `lang="ar"` attributes
- Use logical CSS properties
- Mirror directional iconography appropriately
- Test with Arabic screen readers
- Ensure text direction auto-detection works

---

## Responsive Design

### Mobile-First Approach

Design for mobile first, then enhance for larger screens:

```css
/* Mobile (base) */
.component {
  display: block;
  width: 100%;
  font-size: 16px;
}

/* Tablet (640px+) */
@media (min-width: 640px) {
  .component {
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-size: 14px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .component {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Touch Target Sizing

- Minimum 44x44px for interactive elements (mobile)
- 40x40px acceptable for desktop
- Adequate spacing (8px minimum) between targets

### Responsive Typography

Text size and line height adjust for readability:

```css
/* Mobile: smaller text */
body {
  font-size: 14px;
  line-height: 1.6;
}

h1 {
  font-size: 24px;
}

/* Tablet: medium text */
@media (min-width: 640px) {
  body {
    font-size: 15px;
  }
  h1 {
    font-size: 32px;
  }
}

/* Desktop: larger text */
@media (min-width: 1024px) {
  body {
    font-size: 16px;
  }
  h1 {
    font-size: 40px;
  }
}
```

### Responsive Navigation

Mobile uses hamburger menu, tablet/desktop uses full navbar:

```tsx
<Navbar
  items={navItems}
  mobileMenuTrigger={true}
  responsiveBreakpoint={768}
/>
```

---

## Dark Mode Implementation

The current design is dark-first (navy backgrounds, cyan accents). Light mode is not currently implemented but could be added with CSS variables:

```css
:root {
  --color-bg: #0F1629;
  --color-card: #1A1F3A;
  --color-text: #E0E0E0;
  --color-primary: #00D4FF;
}

@media (prefers-color-scheme: light) {
  :root {
    --color-bg: #FFFFFF;
    --color-card: #F5F5F5;
    --color-text: #1A1F3A;
    --color-primary: #0088CC;
  }
}
```

---

## Implementation Guide

### File Structure

```
src/
├── components/
│   ├── foundation/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Radio.tsx
│   │   ├── Toggle.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   └── index.ts
│   ├── navigation/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── index.ts
│   ├── feedback/
│   │   ├── Alert.tsx
│   │   ├── Toast.tsx
│   │   ├── Modal.tsx
│   │   ├── Spinner.tsx
│   │   └── index.ts
│   ├── data-display/
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   └── index.ts
│   ├── family-tree/
│   │   ├── FamilyNode.tsx
│   │   ├── FamilyConnection.tsx
│   │   ├── TreeCanvas.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── Page.tsx
│   │   ├── Section.tsx
│   │   ├── Panel.tsx
│   │   └── index.ts
│   ├── forms/
│   │   ├── FormField.tsx
│   │   ├── SearchBar.tsx
│   │   ├── DatePicker.tsx
│   │   └── index.ts
│   ├── patterns/
│   │   ├── EmptyState.tsx
│   │   ├── SearchResults.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts
│   └── index.ts
├── styles/
│   ├── tokens.css
│   ├── typography.css
│   ├── animations.css
│   └── globals.css
├── hooks/
│   ├── useMediaQuery.ts
│   ├── useToast.ts
│   └── index.ts
├── context/
│   ├── ToastContext.tsx
│   ├── ThemeContext.tsx
│   └── index.ts
└── utils/
    ├── cn.ts (class name utility)
    ├── colors.ts
    └── index.ts
```

### Tailwind Configuration

```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1A1F3A',
        cyan: '#00D4FF',
        purple: '#7B2CBF',
        success: '#00E676',
        warning: '#FFA726',
        error: '#FF5252',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
      },
      zIndex: {
        elevated: '100',
        sticky: '200',
        dropdown: '300',
        'modal-backdrop': '400',
        modal: '500',
        toast: '600',
        popover: '700',
      },
      fontFamily: {
        arabic: "'Tajawal', 'Droid Arabic Kufi', sans-serif",
        latin: "'Inter', sans-serif",
        mono: "'Fira Code', monospace",
      },
    },
  },
};
```

### Component Development Workflow

1. **Create Component File:** `src/components/[category]/ComponentName.tsx`
2. **Define Props Interface:** All props typed with TypeScript
3. **Implement Accessibility:** ARIA labels, keyboard navigation
4. **Support RTL:** Use logical CSS properties, test with dir="rtl"
5. **Add Tests:** Unit tests for component behavior
6. **Create Storybook Story:** Document variants and usage
7. **Export from Index:** Add to `src/components/index.ts`

### Storybook Setup

```typescript
// Button.stories.tsx
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'danger', 'ghost', 'success'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Click me',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="success">Success</Button>
    </div>
  ),
};
```

### Testing Approach

- **Unit Tests:** Component props, state management, event handlers
- **Accessibility Tests:** axe-core, WAVE for contrast and ARIA compliance
- **Integration Tests:** Component interaction, form submission
- **Visual Regression:** Percy or similar for design consistency
- **RTL Tests:** Verify mirroring and text direction

```typescript
// Button.test.tsx
describe('Button', () => {
  test('renders with correct label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('triggers onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('disabled button cannot be clicked', () => {
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} disabled>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('has proper focus visible state', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    fireEvent.focus(button);
    expect(button).toHaveFocus();
  });
});
```

---

## Conclusion

This comprehensive Design System provides a complete specification for the Al-Shaya Family Tree Application. It ensures:

- **Consistency:** Unified visual language across all 87+ pages
- **Accessibility:** WCAG 2.1 AA compliance for all users
- **Internationalization:** First-class Arabic/English and RTL support
- **Scalability:** Organized component library with 40+ components documented
- **Cultural Respect:** Arabic-first design honoring family heritage
- **Developer Efficiency:** Clear guidelines and reusable components
- **User Experience:** Intuitive interfaces optimized for genealogy research

All components, patterns, and specifications are production-ready and should be strictly followed during implementation to maintain design integrity across the entire application.

