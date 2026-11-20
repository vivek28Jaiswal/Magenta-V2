---
name: Clarity Engine
colors:
  surface: '#fff8f5'
  surface-dim: '#e2d8d2'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf2eb'
  surface-container: '#f6ece6'
  surface-container-high: '#f0e6e0'
  surface-container-highest: '#eae1da'
  on-surface: '#1f1b17'
  on-surface-variant: '#5d403a'
  inverse-surface: '#342f2b'
  inverse-on-surface: '#f9efe8'
  outline: '#926f68'
  outline-variant: '#e7bdb5'
  surface-tint: '#bb1800'
  primary: '#b71700'
  on-primary: '#ffffff'
  primary-container: '#e02a0f'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a6'
  secondary: '#625d5b'
  on-secondary: '#ffffff'
  secondary-container: '#e9e1dd'
  on-secondary-container: '#686361'
  tertiary: '#0058be'
  on-tertiary: '#ffffff'
  tertiary-container: '#2170e4'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a6'
  on-primary-fixed: '#3f0300'
  on-primary-fixed-variant: '#8f1000'
  secondary-fixed: '#e9e1dd'
  secondary-fixed-dim: '#ccc5c2'
  on-secondary-fixed: '#1e1b19'
  on-secondary-fixed-variant: '#4a4643'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#fff8f5'
  on-background: '#1f1b17'
  surface-variant: '#eae1da'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.025em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  code:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system expresses rigorous analytical clarity, editorial composure, and purposeful urgency. Designed for candidates navigating high-stakes career transitions, the experience replaces uncertainty with objective, evidence-driven insights. It delivers the precision of a high-craft engineering workbench combined with the refined restraint of an editorial monograph.

The design movement is **Warm Minimalist SaaS**—drawing immediate inspiration from modern tools like Linear and Raycast, yet rooted in a warm, physical paper substrate rather than cold sterile grays. Crisp white floating cards rest over a muted linen foundation, establishing a grounded hierarchy where layout boundaries are defined through delicate low-contrast structural rules rather than heavy drop shadows. High-frequency interactions emphasize density, rapid scannability, compact typographic lead-ins, and focused bursts of vermillion accent to draw intent straight to critical discrepancies and insights.

## Colors

The palette is engineered around deliberate chromatic restraint. Color functions exclusively as semantic metadata or directional cues; structural containers rely on tonal shift and micro-borders rather than saturated fills.

- **Primary Canvas Background (`#F0F0E9`)**: A bespoke warm linen tone that softens contrast, mitigates glare during intensive editing sessions, and grounds interface modules.
- **Card & Elevated Surfaces (`#FFFFFF` and `#FAFAF7`)**: Pure white cards isolate analytical sections, while `#FAFAF7` establishes nested surface depths (e.g., table headers, code-style evidence blocks, metadata chips).
- **Primary Vermillion (`#FF4124`)**: High-energy signal color reserved strictly for focal primary CTAs, active segmented states, score outliers, and essential navigation points. Hover transitions shift deeper toward `#E0351B`.
- **Text & Structure**: The secondary ink color (`#1C1917`) provides sharp text contrast at high density. Muted text steps down to `#78716C` and `#A8A29E`.
- **Semantic Channels**:
  - **Success / Match (`#10B981`)**: Keyword alignments, validated criteria, strong evidence indicators.
  - **Warning / Missing (`#F59E0B`)**: Neutral gaps, recommended clarifications, partial fits.
  - **Danger / Conflict (`#EF4444`)**: Direct resume contradictions, critical qualification absences.
  - **Info / Evidence (`#3B82F6`)**: Contextual notes, source citations, semantic extraction overlays.
- **Border Rules**: Surfaces use hairline boundaries (`#E2E2D8` or `rgba(28, 25, 23, 0.08)`), avoiding dense visual separation.

## Typography

Type behavior prioritizes dense, geometric legibility with tight tracking curves. Font metrics stay compact: headings feature negative letter-spacing (`-0.015em` to `-0.025em`) to evoke an intentional, engineered product feel. 

- **Display & Headings**: Reserved for core score overviews, match diagnoses, and workspace breadcrumbs. Set in weight 600 with compressed leading to keep analytical summaries tight above the fold.
- **Body Hierarchy**: Primary reading elements rely on 14px (`body-md`) and 13px (`body-sm`) weights to ensure tabular data, side-by-side JD comparison panels, and extracted evidence phrases maximize screen estate without sacrificing scan speed.
- **Labels & Micro-Metrics**: Uppercase transformations are used sparingly and restricted exclusively to `label-sm` when indicating status badges, verification categories, or evidence source tags.

## Layout & Spacing

The layout model employs a fluid multi-column grid coupled with strict vertical rhythm designed for side-by-side analytical workflows.

- **Desktop (>= 1200px)**: 12-column grid with a fixed split-view paradigm. The primary workbench organizes into a 5:7 or 4:8 split (Job Specification pane on the left; Evidence Matrix and Resume Diagnostics on the right). Canvas padding defaults to `margin` (`2rem`) with `1.25rem` gutters.
- **Tablet (768px - 1199px)**: 8-column layout. Side-by-side panes collapse into responsive tabbed modules or stacked vertical cards with `1rem` gutters.
- **Mobile (< 768px)**: 4-column layout with pinned bottom action bars, full-width edge-to-edge modular cards, and horizontal scroll carousels for chip filtering.
- **Spacing Rhythm**: Component internals use an 8pt base grid adjusted for tool-dense compactness: `space-xs` (4px) for badge internals, `space-sm` (8px) for input and button horizontal padding, `space-md` (12px) for item gaps, `space-lg` (20px) for inner card padding, and `space-xl` (32px) for section separation.

## Elevation & Depth

Depth is established through tactile layering rather than heavy ambient occlusion. Surfaces mimic crisp archival stock stacked on warm drawing tables.

- **Level 0 (Foundation)**: `#F0F0E9` canvas. Recessed data wells, search fields, and inactive segmented backgrounds use inset tinting (`rgba(0, 0, 0, 0.03)`).
- **Level 1 (Cards & Workbench Panes)**: `#FFFFFF` panels finished with a 1px uniform perimeter border of `#E2E2D8` (`rgba(28, 25, 23, 0.08)`). Shadow is whisper-light: `0 1px 2px rgba(28, 25, 23, 0.04)`.
- **Level 2 (Hover States & Flyouts)**: Interactive cards on hover lift subtly: border shifts to `rgba(28, 25, 23, 0.14)` with shadow `0 4px 12px -2px rgba(28, 25, 23, 0.06)`.
- **Level 3 (Modals, Overlays & Popovers)**: Dropdown selects, quick-inspect popovers, and analysis dialogs leverage `#FFFFFF` with double-pass diffusion: `0 8px 24px -4px rgba(28, 25, 23, 0.08), 0 2px 6px rgba(28, 25, 23, 0.04)`.
- **Level 4 (Toasts & Floating Utility Bars)**: Vermillion-accented toasts or pinned navigation bars sit at `0 12px 32px -4px rgba(28, 25, 23, 0.12)`.

## Shapes

The geometric vernacular pairs structured rectangularity with soft humanistic corners.

- **Core Elements (0.5rem / 8px)**: Inputs, buttons, list item highlights, and standard table cells adhere to an 8px radius, matching the tight optical flow of tabular inspection.
- **Container Surfaces (`rounded-lg` / 12px - 14px)**: Analysis cards, split workspace viewports, and modal dialogs use 10px-12px curvature.
- **Nested Context (`rounded-xl` / 16px - 20px)**: Top-level viewport wrappers and outer multi-panel dash shells.
- **Pill Badges (`9999px`)**: Evidence tags, status markers, key qualification pills, and numeric indicator bubbles leverage complete circular pills to visually contrast with the grid-bound cards.

## Components

### Buttons
- **Primary**: Background `#FF4124`, text `#FFFFFF`, font weight 500, height 36px (compact) or 40px (default), 8px radius. Hover: `#E0351B`. Active: `#C92C14`. Focus ring: 2px offset with `rgba(255, 65, 36, 0.35)`.
- **Secondary / Outline**: Background `#FFFFFF`, border 1px solid `#D8D8CF`, text `#1C1917`. Hover: background `#FAFAF7`, border `#C4C4B8`.
- **Ghost**: Background transparent, text `#78716C`. Hover: background `rgba(28, 25, 23, 0.05)`, text `#1C1917`.
- **Destructive**: Background `#EF4444`, text `#FFFFFF`. Hover: `#DC2626`.

### Chips & Evidence Tags
- **Base Pill**: Height 22px-24px, radius 9999px, padding 2px 8px, typography `label-sm`.
- **Evidence Verified**: Background `rgba(16, 185, 129, 0.10)`, text `#047857`, border `1px solid rgba(16, 185, 129, 0.20)`.
- **Evidence Missing**: Background `rgba(239, 68, 68, 0.08)`, text `#B91C1C`, border `1px solid rgba(239, 68, 68, 0.18)`.
- **Neutral Filter**: Background `#E8E8E0`, text `#57534E`, border 1px solid transparent. Active: Background `#1C1917`, text `#FFFFFF`.

### Cards & Accordion Diagnostics
- **Diagnostic Card**: Outer `#FFFFFF`, border `1px solid #E2E2D8`, padding `space-lg`. Internal rows divided by `1px solid #F0F0E9`.
- **Evidence Accordion**: Header toggle features subtle collapse chevron (16px, 1.5px stroke weight). Expanded container reveals nested `#FAFAF7` background containing direct resume excerpts matched against JD line-items.

### Inputs & Search Bars
- **Text Input**: Height 38px, background `#FFFFFF`, border `1px solid #D8D8CF`, text `#1C1917`, placeholder `#A8A29E`, radius 8px, horizontal padding `space-md`. Focus: Border `#FF4124`, ring `2px rgba(255, 65, 36, 0.15)`.
- **Search Wells**: Recessed `#EAEAE2` background, borderless until focused.

### Checkboxes & Radios
- **Checkbox**: 16px × 16px, radius 4px, border `1.5px solid #D8D8CF`, background `#FFFFFF`. Checked: Background `#FF4124`, border `#FF4124`, white checkmark icon.
- **Radio**: 16px × 16px, circular, checked state features a solid 6px `#FF4124` center dot on a `#FFFFFF` core with `#FF4124` outer boundary.

### Segmented Controls
- Contained bar within `#E8E8E0` tray, 4px padding. Selected segment slides with a pure `#FFFFFF` background, 6px radius, and micro-shadow (`0 1px 3px rgba(0,0,0,0.06)`). Active label renders in `#1C1917` (semibold), inactive in `#78716C`.

### Iconography Rules
- Minimal stroke icons (Lucide standard), drawn strictly at 1.5px stroke width. Primary rendering size 16px inside buttons/tables, 20px inside section headers.