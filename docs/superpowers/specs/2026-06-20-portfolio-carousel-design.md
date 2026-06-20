# Portfolio Carousel Design Spec

Date: 2026-06-20
Project: `edkimfx_html`
Scope: Portfolio section redesign inside the Envato/Frenify `Resumo` template

## Goal

Keep the horizontal portfolio carousel as the main browsing experience and improve it so it works as the strongest section of the site.

The portfolio should:

- preserve the template's premium one-page feel
- support software and creative work in one shared system
- use category filters to swap carousel items in place
- open richer modal project details on click
- stay visually consistent with the Frenify `Resumo` design language

## Current Template Baseline

The new site already has the right core structure:

- a one-page layout in `index.html`
- a portfolio section using Owl Carousel
- a native modal system in `js/init.js`
- a data-driven project source in `data/portfolio.js`
- a custom render layer in `js/app.js`

The original Envato backup in `old backup html/index.html` confirms the intended pattern:

- horizontal carousel cards
- image-first project tiles
- click-to-open modal details
- next/previous navigation inside the modal

## Design Direction

The portfolio section should remain carousel-first.

This means:

- no grid as the primary layout
- no separate projects page for the main experience
- no breaking away from the existing modal interaction model

Instead, the section should feel like a refined, higher-quality version of the original template portfolio, populated with Edwin's real content.

## Browsing Model

### Main Portfolio View

The main portfolio view stays as a horizontal carousel under the `Portfolio` section.

Each card should show:

- project image
- category label
- project title

The card face should stay close to the original Frenify structure:

- image first
- category line
- title only

Do not add a visible summary paragraph to the main carousel card unless spacing testing later proves it is necessary.

The carousel should remain the first thing users interact with when browsing work.

### Filter Behavior

Filtering should happen directly in the portfolio section and should rebuild the carousel contents in place.

Approved filters:

- `All`
- `Website & Apps`
- `3D & Motion Graphics`

Behavior:

- clicking a filter swaps the visible carousel items
- the carousel reinitializes cleanly after filtering
- navigation arrows continue to work after filtering
- modal indexing continues to match the filtered set

This keeps the main interaction simple:

`choose category -> browse horizontally -> open item`

### Modal Behavior

Clicking a carousel item opens the existing Frenify modal.

The modal should become the detailed project view, not just a larger title-and-text popup.

Each modal entry should include:

- category and year
- project title
- cover image
- short intro summary beneath the title when useful
- 2 to 3 paragraphs of project description
- role
- stack or tools
- outcome
- gallery when available
- related work when useful

The existing modal next/previous navigation should stay in place and continue to move between currently filtered items.

The modal layout should preserve the original template structure first:

- category line
- title
- large cover image
- vertically stacked content sections

Additional metadata and gallery blocks can be added, but they should feel like a richer version of the original single-column modal flow rather than a completely different layout system.

## Content Strategy

### Shared Portfolio System

Software and creative projects stay inside one unified portfolio system.

They are separated by filtering, not by separate page architecture.

This means:

- the portfolio section remains one coherent experience
- software work still appears as the stronger professional direction
- creative/TVC work remains available without taking over the site identity

### Item Quality Standard

Each project entry should feel intentional, not like a placeholder record.

Every item should have:

- a strong title
- a clear category
- one concise summary line for modal intro or supporting detail
- fuller project detail copy for the modal
- at least one real representative image

Where source material is weaker, the content should still be honest and archival in tone instead of overstating certainty.

## Visual Direction

The portfolio redesign should stay close to the Frenify template aesthetic.

This means:

- keep the image-led carousel cards
- preserve the spacing rhythm and typography scale of the template
- avoid introducing a second visual system that looks pasted in
- keep filter controls minimal, sharp, and aligned with the existing palette
- keep the modal feeling premium and content-rich rather than overloaded

The portfolio should feel upgraded, not replaced.

## Technical Direction

### Template Architecture

Keep the current architectural split:

- `index.html` provides the section shell
- `data/portfolio.js` stores project content
- `js/app.js` renders the portfolio and language-aware content
- `js/init.js` continues to own the template interactions and modal behavior

### Rendering Model

The portfolio should remain data-driven.

Recommended rendering behavior:

- `data/portfolio.js` remains the single source of truth
- `js/app.js` builds carousel cards and modal bodies from that data
- filtering updates the rendered item set and then reinitializes Owl Carousel
- modal click handlers are rebound after carousel rebuilds

### Modal Integration

The design should reuse the existing Frenify modal shell rather than inventing a second lightbox or separate detail-page system.

Reason:

- it matches the template's native interaction model
- it keeps the portfolio one-page
- it avoids introducing duplicated project-detail logic

## Required Improvements

### Carousel Card Improvements

Current card rendering is functional but too JS-heavy and partially inline-styled.

The next implementation should:

- clean up card markup structure
- move as much styling as practical into CSS
- make text hierarchy stronger on the card face
- ensure carousel item widths feel balanced across desktop and mobile

### Modal Content Improvements

Current modal content is better than the stock template but still needs polishing.

The next implementation should:

- make the modal layout more structured
- improve gallery presentation
- make metadata easier to scan
- make related items feel visually connected rather than appended blocks

### Filter Integration

The current filter implementation idea is correct, but it should feel more native to the template.

The next implementation should:

- visually integrate filters into the section header area
- ensure active states are clear
- ensure re-rendering does not break carousel behavior

## Constraints

- keep the portfolio section inside the current one-page template
- keep the horizontal carousel as the main browsing experience
- keep the existing Frenify modal pattern
- do not redesign the whole site around the portfolio
- do not move to a grid-first portfolio layout
- do not reintroduce the previous multi-page static portfolio as the main base

## Success Criteria

The redesign is successful when:

- the portfolio remains carousel-first
- filters swap carousel contents smoothly
- carousel cards feel polished and intentional
- modal details feel substantial and professional
- software and creative work coexist without confusing the main site identity
- the section still feels like part of the original Envato template

## Implementation Focus

The first implementation plan should focus only on the portfolio section.

It should cover:

- portfolio markup cleanup
- carousel card rendering improvements
- filter integration
- modal detail structure
- gallery presentation
- CSS cleanup for portfolio-specific visuals

The rest of the site should remain mostly untouched unless a portfolio-related dependency requires adjustment.
