# Footer Copy Removal Design

## Goal

Remove the current footer marketing copy from the live portfolio site so the footer ends more quietly and does not repeat positioning language the user dislikes.

## Current Copy Being Removed

The current English footer text is:

- `Software-first portfolio featuring full-stack systems, product delivery, and selected creative work.`
- `A focused selection of software case studies, product work, and visual projects.`

## Selected Approach

Use a minimal content-only change:

- clear the footer statement text
- clear the footer supporting line
- keep the footer structure unchanged
- mirror the same empty-state treatment in both language objects

## Why This Approach

This is the safest way to remove the unwanted tone without introducing layout churn or forcing replacement copy that the user may also dislike.

It avoids:

- inventing new marketing language
- unnecessary HTML or CSS edits
- inconsistency between language variants

## File Plan

### `data/content.js`

- update `site.footer.statement`
- update `site.footer.copyright`
- set both values to empty strings in `en`
- apply the same empty values in `de` for consistency

## Verification

After implementation, verify:

1. The old footer sentences no longer exist in `data/content.js`.
2. The site still renders without errors.
3. No diagnostics are introduced.
4. The resulting footer remains visually stable.
5. The change is pushed to `main` so GitHub Pages updates.

## Success Criteria

The change is successful when:

- the unwanted footer text is gone
- the footer remains structurally intact
- no replacement marketing copy appears
- GitHub reflects the updated footer state

## Guardrails

- Do not rewrite unrelated homepage or footer content.
- Do not change layout, spacing, or footer social links as part of this change.
- Keep the change scoped to the content source unless verification reveals a rendering issue.
