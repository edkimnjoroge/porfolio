# Original Carousel and Teal Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore the backup carousel contract, apply the dark teal palette, and render the supplied profile JPG directly.

**Architecture:** app.js remains the sole owner of the dynamic Owl carousel. Shared CSS tokens control dark surfaces while body.light overrides remain unchanged.

**Tech Stack:** HTML, CSS, JavaScript, jQuery, Owl Carousel, Python

## Global Constraints

- Preserve project filters, autoplay, arrows, modals, and bilingual content.
- Keep index-light.html light.
- Keep the gold accent.

## Task 1: Regression checks and carousel restoration

1. Extend test_portfolio_layout.py for backup wrappers, Owl settings, sole ownership, profile JPG, and teal tokens.
2. Run the test and confirm failure.
3. Restore container noright, original Owl sizing, and single initialization ownership.
4. Update both profile image elements and backgrounds to the JPG.
5. Apply dark teal CSS variables and replace principal dark surfaces.
6. Run regression and JavaScript syntax checks.
7. Verify computed carousel geometry, backgrounds, and overflow on both port-5500 URLs.

No commit step is available because the workspace is not a Git repository.
