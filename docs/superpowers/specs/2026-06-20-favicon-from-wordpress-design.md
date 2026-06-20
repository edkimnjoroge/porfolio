# Favicon From WordPress Design

## Goal

Add a favicon to the static portfolio site by reusing the existing favicon asset from the old WordPress project, then deploy the change to GitHub Pages.

## Source Asset

Use this existing source file from the WordPress project:

`d:\Projects\Edkimfx\edkimfx_wordpress\wp-content\uploads\2024\06\favicon.png`

The user confirmed this is the correct favicon.

## Selected Approach

Use a minimal PNG favicon setup:

- copy the existing `favicon.png` into the static site repository
- add standard favicon `<link>` tags to both entry pages
- avoid generating extra formats such as `.ico`, Apple touch icons, or a web manifest

## Why This Approach

This is the smallest safe change that satisfies the request and works well for a GitHub Pages static site.

It avoids:

- unnecessary asset generation
- extra files that are not needed for the current deployment target
- additional browser-specific setup that would add complexity without clear benefit

## File Plan

### Static Site Asset

Add the favicon file to the static site in a stable top-level location so it is easy to reference from both HTML entry pages.

Preferred destination:

`d:\Projects\Edkimfx\edkimfx_html\favicon.png`

### `index.html`

- add a favicon link in the `<head>` pointing to `favicon.png`

### `index-light.html`

- add the same favicon link in the `<head>` so both entry pages stay in sync

## Verification

After implementation, verify:

1. `favicon.png` exists in the static site repository.
2. `index.html` references the favicon.
3. `index-light.html` references the favicon.
4. The browser requests the favicon successfully in local preview.
5. The change is pushed to `main` so GitHub Pages can pick it up.

## Success Criteria

The change is successful when:

- the static site serves the WordPress-derived favicon
- both entry pages include the favicon link
- the favicon is present after pushing to GitHub

## Guardrails

- Keep the source favicon unchanged rather than editing or recompressing it.
- Mirror the same head update across both HTML entry pages.
- Do not add unrelated head metadata while making this change.
