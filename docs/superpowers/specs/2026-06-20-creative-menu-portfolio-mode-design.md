# Creative Menu Portfolio Mode Design

Date: 2026-06-20
Project: `edkimfx_html`
Scope: Add a `Creative` navigation entry that switches the shared portfolio section into a creative-only mode

## Goal

Keep the site as a single-page portfolio while allowing the main navigation to open the same portfolio section in two different modes:

- `Portfolio` for development/software work
- `Creative` for creative/3D/TVC work

The page should not duplicate the portfolio section.

## Approved Behavior

### Default Load

When a visitor opens the homepage:

- the page stays in its normal software-first state
- the portfolio section heading uses the software-facing title
- the portfolio carousel shows development-related work only

### Portfolio Menu

When a visitor clicks `Portfolio` in the main menu:

- the site switches portfolio mode to `software`
- the portfolio heading updates to the software-facing title
- the portfolio carousel rebuilds using software/development items only
- the page scrolls to the existing `#portfolio` section

### Creative Menu

When a visitor clicks `Creative` in the main menu:

- the site switches portfolio mode to `creative`
- the portfolio heading updates to `Creative Work`
- the portfolio carousel rebuilds using creative items only
- the page scrolls to the existing `#portfolio` section

## Design Direction

This feature should behave like an alternate entry into the same portfolio section, not like a second page and not like a second hidden section.

That means:

- one shared carousel shell
- one shared modal system
- one shared section on the page
- different dataset and heading depending on active mode

## Portfolio Modes

The portfolio section should support two explicit internal modes:

- `software`
- `creative`

The current data model already separates items by `section`, so the implementation should use that existing distinction rather than inventing a new categorization system.

Recommended mapping:

- `projects` items -> `software` mode
- `creative` items -> `creative` mode

## Heading Behavior

The portfolio section heading should change with the active mode.

Recommended text:

- software mode: existing software-facing title such as `Featured Projects` or `Software Projects`
- creative mode: `Creative Work`

The subtitle can remain `Portfolio`, since the section itself is still the portfolio area.

This heading change should be language-aware and work in both English and German.

## Navigation Behavior

The navigation should expose both entries:

- `Portfolio`
- `Creative`

Both entries should target the same portfolio section, but each one should set the portfolio mode before the scroll occurs.

This should work from:

- the hidden main navigation menu
- any future internal CTA that wants to jump directly into software or creative mode

## Carousel Behavior

The carousel remains the main browsing interaction.

Mode changes should:

- destroy the current Owl Carousel instance cleanly
- rebuild the carousel with the new item set
- reinitialize Owl Carousel
- preserve the existing next/previous header arrow behavior

The carousel structure and card styling should remain the same across both modes.

## Modal Behavior

The modal remains shared across both modes.

When the portfolio is in software mode:

- clicking a card opens only software-related modal navigation

When the portfolio is in creative mode:

- clicking a card opens only creative-related modal navigation

Prev/next inside the modal should always stay inside the currently active mode set.

## State Model

Introduce a lightweight runtime portfolio state variable, for example:

- `software`
- `creative`

This state should control:

- which items are rendered in the carousel
- which heading text is shown
- which menu entry is currently setting the portfolio mode

The state does not need full URL routing for this feature.

## Scope Constraints

- do not create a second portfolio section
- do not convert this into a multi-page site
- do not reintroduce category filter buttons
- do not change the modal architecture
- do not change the overall one-page navigation structure

## Success Criteria

This change is successful when:

- homepage load defaults to software/development portfolio items
- clicking `Portfolio` shows software items and the software heading
- clicking `Creative` shows creative items and the `Creative Work` heading
- both actions scroll to the same `#portfolio` section
- carousel and modal navigation remain stable after switching modes
- the feature works in both EN and DE
