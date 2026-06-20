# Project Layout and Profile Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Correct project-card alignment and use the supplied JPG portrait.

**Architecture:** Keep the existing renderer and change only the carousel sizing contract and profile asset path.

**Tech Stack:** HTML, JavaScript, jQuery, Owl Carousel, Python

## Task

1. Add a failing source-level regression check in test_portfolio_layout.py.
2. Remove the generated 300px card width in js/app.js.
3. Disable autoWidth and configure 1, 2, and 3 responsive items.
4. Update index.html to reference the supplied JPG.
5. Run the regression check, JavaScript syntax check, and local HTTP asset checks.

No commit is possible because the workspace is not a Git repository.
