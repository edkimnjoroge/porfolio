# Original Carousel Restoration and Teal Theme Design

Date: 2026-06-19
Status: Approved design

Restore the project carousel contract from old backup html: container noright, cards without forced widths, Owl autoWidth enabled with four desktop items, and one fixed-width mobile item below 700px. Preserve dynamic data, filtering, arrows, autoplay, and modals. app.js will be the sole initializer for the dynamic carousel; init.js must exclude portfolio-carousel.

For the dark theme, use #104050 as the body background with reusable darker and lighter teal surface tokens. Preserve the gold accent and text hierarchy. body.light and index-light.html remain light.

Verify through a red-green regression check, JavaScript syntax checks, rendered geometry on both port-5500 pages, dark and light computed backgrounds, and absence of horizontal page overflow.
