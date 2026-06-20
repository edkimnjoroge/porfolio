# Portfolio Copy Cleanup Design

## Goal

Clean up legacy, placeholder-like, and migration-oriented copy in the live static portfolio so the site reads like a deliberate professional portfolio rather than a restored WordPress export.

## Scope

This cleanup applies only to the live site files:

- `data/content.js`
- `data/portfolio.js`
- `index.html`
- `index-light.html`

This cleanup does not apply to:

- `old backup html/`
- `docs/`
- `d:\Projects\Edkimfx\edkimfx_wordpress`

Those sources may still be useful as historical reference, but they are not part of the live user experience.

## Key Rule

Keep `WordPress` only where it is a truthful technology reference for a project's implementation, stack, or delivery context.

Remove `WordPress` when it is only being used to describe where an asset came from, how an image was recovered, or how the current site was assembled from an older source.

## Problems To Fix

The live site currently contains several classes of weak or distracting copy:

1. Migration-story copy
   - Examples: references to `old project page`, `archived slideshow`, `WordPress media library`, `restored gallery`, `preview thumbnail`, and similar provenance language.

2. Placeholder-like UI or footer copy
   - Examples: hosting-oriented statements such as `Built as a fast static site for Cloudflare Pages.` that explain deployment rather than communicate portfolio identity.

3. Underspecified labels and captions
   - Examples: `website preview`, `featured preview`, `uploaded MP4`, and similar labels that describe the asset mechanically instead of meaningfully.

4. Archive-first descriptions
   - Examples: project descriptions that emphasize restoration, recovery, or original upload source more than the project outcome, role, or value.

## Cleanup Strategy

Use a surgical content pass rather than a structural refactor.

The cleanup will:

- rewrite only user-facing copy in the live files
- preserve project structure, ordering, sections, categories, and behavior
- preserve valid external links unless a label needs improvement
- preserve truthful stack references such as `WordPress`, `Laravel`, `React`, `Node.js`, `Perfex CRM`, `Maya`, `Cinema 4D`, and similar tools when they describe the work itself

The cleanup will not:

- change layout or navigation structure
- remove projects
- change data model shape
- alter modal behavior or gallery logic
- rewrite backup or historical source files

## Content Rules

### Global Copy

For `data/content.js`:

- rewrite footer text so it explains the portfolio clearly and professionally
- remove platform- or hosting-centric phrasing unless it directly benefits the reader
- keep the tone aligned with the software-first identity of the site

### Project Entries

For `data/portfolio.js`:

- focus each entry on project purpose, role, stack, and outcome
- replace provenance language with viewer-oriented description
- keep `WordPress` in summaries, roles, or stack fields only when it was the real implementation platform
- reduce repeated wording such as `original`, `archived`, `restored`, `preview`, and `media library` unless a specific use is genuinely meaningful

### Gallery Captions

Gallery items should describe what the user is seeing, not where the file came from.

Preferred caption style:

- `Homepage view of the public product site.`
- `Dashboard screen showing the operations overview.`
- `Module view used during internal workflow management.`
- `Video frame from the final ad export.`
- `Brand guide prepared for client-facing use.`

Avoid caption style like:

- `Original WordPress preview image`
- `Archived slideshow screenshot`
- `Uploaded MP4 from the media library`
- `Old project page background`

### Labels And Links

Where labels are vague, rename them to be more useful:

- `Visit website` may remain when accurate
- `Uploaded MP4` should become a more descriptive video label
- `Archived WordPress page` should either be clarified as an archive link or removed if it weakens the presentation
- `featured preview` or `website preview` should become `homepage screenshot`, `landing page view`, `dashboard view`, `module screen`, or equivalent

## File-Specific Plan

### `data/content.js`

- replace footer copy that currently explains the hosting setup rather than the portfolio
- retain the overall site voice and bilingual structure already present in the file

### `data/portfolio.js`

- rewrite gallery captions across software and creative projects
- tighten summaries and full descriptions where archive-restoration language currently dominates
- keep accurate implementation references for WordPress-based projects
- improve weak labels for links and media items where necessary

### `index.html` and `index-light.html`

- update remaining hardcoded user-facing labels that still read as inherited or generic
- preserve structure and mirrored parity between the dark and light variants

## Verification

After implementation, run targeted searches in the live site for leftover legacy wording, including:

- `Cloudflare Pages`
- `archived`
- `slideshow`
- `media library`
- `old project page`
- `WordPress preview`
- `featured preview`
- `uploaded MP4`

Some `WordPress` matches may remain, but only where they are true stack references.

## Success Criteria

The cleanup is successful when:

- the live site reads as a current portfolio rather than a migration artifact
- software entries emphasize business value, role, stack, and delivery
- creative entries feel curated rather than recovered from an archive
- gallery captions explain the asset meaningfully
- `WordPress` remains only where it truthfully describes the project technology
- no live footer or project copy explains the site primarily in terms of hosting or restoration history

## Risks And Guardrails

- Over-cleaning risk: removing `WordPress` from places where it is a legitimate implementation detail. Guardrail: keep it where it truthfully describes stack or delivery.
- Tone drift risk: rewriting copy into generic marketing language. Guardrail: keep the tone practical, specific, and portfolio-oriented.
- Consistency risk: fixing one variant but not the other. Guardrail: apply mirrored updates to both `index.html` and `index-light.html`.

## Recommended Implementation Order

1. Update global copy in `data/content.js`
2. Rewrite project summaries, descriptions, labels, and gallery captions in `data/portfolio.js`
3. Update any remaining hardcoded labels in `index.html`
4. Mirror those label changes in `index-light.html`
5. Run targeted grep verification for legacy phrases
