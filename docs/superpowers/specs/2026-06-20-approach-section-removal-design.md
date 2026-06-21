# Approach Section Removal Design

## Goal

Remove the `Approach / How I work` section from the live portfolio site, along with its matching navigation link, so the About area is more concise.

## Selected Approach

Use a structural removal:

- delete the full `#services` section from both entry pages
- remove the `Approach` navigation link that targets `#services`
- keep the rest of the About content unchanged
- avoid adding a replacement section

## Why This Approach

This is cleaner than blanking the text while leaving an empty section behind.

It avoids:

- dead navigation links
- empty content containers
- new filler copy that the user may not want

## File Plan

### `index.html`

- remove the `Approach` nav item
- remove the full `#services` section block

### `index-light.html`

- apply the same removal so both entry pages stay mirrored

### `data/content.js`

- no content rewrite is required for this change
- existing translation keys can remain unused unless a later cleanup pass removes them

## Verification

After implementation, verify:

1. The `Approach` nav link is gone from both entry pages.
2. The `#services` section no longer exists in either page.
3. No diagnostics are introduced.
4. The page layout still flows correctly after the About section.
5. The change is pushed to `main` so GitHub Pages updates.

## Success Criteria

The change is successful when:

- the `Approach / How I work` section is removed
- the matching nav link is removed
- the rest of the site remains unchanged

## Guardrails

- Do not rewrite unrelated About content.
- Do not add a replacement section.
- Keep the change mirrored between `index.html` and `index-light.html`.
