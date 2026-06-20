# Portfolio Carousel Implementation Plan

Date: 2026-06-20
Project: `edkimfx_html`
Scope: Portfolio section implementation inside the Envato/Frenify `Resumo` template
Based on: `docs/superpowers/specs/2026-06-20-portfolio-carousel-design.md`

## Objective

Implement a portfolio section that keeps the horizontal carousel as the main browsing experience, uses live category filters to swap carousel items in place, and upgrades the existing Frenify modal into a richer project detail experience.

The work should stay inside the current one-page template and should not spill into a full-site redesign.

## Current Baseline

The current site already has:

- portfolio section shell in `index.html`
- Owl Carousel and modal interactions from `js/init.js`
- dynamic content source in `data/portfolio.js`
- custom data rendering in `js/app.js`

Current weaknesses:

- portfolio rendering in `js/app.js` is too inline-style heavy
- carousel cards are functional but not visually faithful enough to the original template
- filter controls work conceptually but do not yet feel native to the Frenify design
- modal content is richer than stock, but its layout needs to be more structured and closer to the original single-column presentation

## Delivery Strategy

Implement the portfolio redesign in five phases.

### Phase 1: Stabilize The Portfolio Data Model

Goal:

- confirm `data/portfolio.js` is sufficient as the single source of truth for the carousel and modal

Tasks:

- review every portfolio item for the fields actually needed by this template
- keep or confirm:
  - `slug`
  - `categories`
  - `year`
  - `coverImage`
  - `title`
  - `kicker`
  - `summary`
  - `fullDescription`
  - `role`
  - `stackOrTools`
  - `outcome`
  - `gallery`
  - `relatedItems`
- ensure software and creative entries can coexist in one shared carousel system
- verify every item has at least one usable representative image

Deliverable:

- stable portfolio data that drives the section cleanly without further schema churn

### Phase 2: Rebuild The Carousel Card Renderer

Goal:

- make the visible carousel cards match the original Frenify structure more closely

Tasks:

- keep the card face minimal:
  - image
  - category line
  - title
- remove visible summary text from the main card face
- keep the card markup close to the original Envato pattern from `old backup html/index.html`
- reduce inline styling in `js/app.js`
- move portfolio-card visual styles into `css/style.css`
- ensure the card width and spacing work well with Owl Carousel on desktop and mobile
- keep the header arrow controls working with the rebuilt carousel

Deliverable:

- a cleaner, more template-faithful carousel card renderer

### Phase 3: Integrate Native-Looking Filters

Goal:

- keep live filters, but make them feel like part of the original template rather than an overlayed feature

Tasks:

- keep the approved filters:
  - `All`
  - `Website & Apps`
  - `3D & Motion Graphics`
- position the filters inside the portfolio header area
- style active and inactive states using the template palette and spacing rhythm
- ensure filtering:
  - rebuilds the visible item list
  - destroys and reinitializes Owl Carousel cleanly
  - preserves header arrow behavior
  - updates modal indexing correctly

Deliverable:

- filter controls that feel native and do not break carousel behavior

### Phase 4: Restructure The Modal Detail View

Goal:

- turn the existing Frenify modal into a stronger project detail view while preserving the original modal flow

Tasks:

- keep the original modal rhythm:
  - category line
  - title
  - large cover image
  - vertically stacked content sections
- add richer content blocks without turning the modal into a different layout system
- structure the modal content as:
  - intro summary
  - detailed description paragraphs
  - project metadata block
  - gallery block when present
  - related work block when useful
- keep the Frenify modal next/previous navigation intact
- ensure modal content swaps correctly when navigating inside a filtered set

Deliverable:

- a premium but template-faithful modal detail experience

### Phase 5: CSS Cleanup, QA, And Final Review

Goal:

- make the portfolio section production-ready inside the template

Tasks:

- move portfolio-specific presentation out of JS where practical
- keep `js/app.js` focused on rendering logic rather than long inline style strings
- add or refine portfolio-specific CSS in `css/style.css`
- check:
  - carousel responsiveness
  - filter state styling
  - modal overflow and spacing
  - gallery image consistency
  - software and creative item balance
  - light and dark template variants if both are still intended
- manually test:
  - initial carousel load
  - filter switching
  - card click to modal
  - modal prev/next
  - mobile behavior

Deliverable:

- a review-ready portfolio section that is consistent with the original Frenify design language

## File Plan

Expected primary files to edit:

- `index.html`
- `css/style.css`
- `js/app.js`
- `data/portfolio.js`

Files expected to remain mostly unchanged:

- `js/init.js`
- `css/base.css`
- `css/owl-carousel.css`

## Technical Notes

### Rendering Ownership

Recommendation:

- keep `js/init.js` as the template interaction layer
- keep `js/app.js` as the data-driven content renderer

Reason:

- avoids fighting the template
- limits the scope to the portfolio section
- reduces the chance of breaking non-portfolio features

### Carousel Rebuild Safety

Recommendation:

- explicitly destroy Owl Carousel before rebuilding filtered contents
- then rebuild DOM
- then reinitialize Owl Carousel
- then rebind portfolio-specific click handlers

Reason:

- prevents duplicated wrappers
- prevents broken slide widths
- keeps modal index mapping predictable

### Modal Content Strategy

Recommendation:

- keep modal details inside hidden card content blocks or a comparable data-driven injection pattern

Reason:

- aligns with the existing Frenify modal system
- avoids building a second detail-page system

## Risks And Mitigations

### Risk: Over-customizing The Template

Problem:

- too much custom markup or styling can make the portfolio feel disconnected from the original theme

Mitigation:

- use the old backup HTML as the structural reference
- preserve the card and modal rhythm before adding enhancements

### Risk: Carousel Breakage After Filtering

Problem:

- Owl Carousel can break if rebuilt carelessly

Mitigation:

- treat carousel destroy/rebuild/reinit as a strict sequence
- test all filters repeatedly after implementation

### Risk: Modal Content Becomes Too Heavy

Problem:

- adding too much metadata or too many blocks can make the modal feel cluttered

Mitigation:

- keep the single-column reading flow
- prioritize description, role, tools, outcome, and gallery
- keep related work secondary

## Testing Checklist

- carousel loads correctly on page load
- header arrows navigate slides correctly
- filters swap visible items correctly
- carousel still works after repeated filter changes
- card click opens the correct modal content
- modal prev/next respects current filtered ordering
- gallery content renders correctly when present
- no broken images in cards or modal
- layout remains consistent on mobile

## Execution Order

1. Audit and confirm `data/portfolio.js`
2. Rebuild minimal carousel card markup
3. Move portfolio presentation styles into CSS
4. Refine filter integration and carousel rebuild logic
5. Restructure modal content into a cleaner single-column detail flow
6. Test and polish the section

## Success Criteria

The implementation is successful when:

- the portfolio remains horizontal-carousel-first
- the section feels visually close to the original Frenify portfolio
- filters work smoothly without breaking the carousel
- modal details feel richer but still template-native
- the portfolio section becomes the strongest part of the site without redesigning the rest of the template
