# Portfolio Migration Design Specification

This document details the design and architecture for migrating the personal portfolio of Edwin Njoroge from the old multi-page website (`/edkimnjoroge-portfolio`) to the new premium single-page template (`index.html` and `index-light.html`).

## 1. System Architecture

The migrated site will follow a **Single-Page Application (SPA) Translation architecture**. The design keeps the look-and-feel of the new premium template while dynamically populating all content in both English (EN) and German (DE) directly from the JSON/JavaScript data files.

```
                    +------------------------------------+
                    |  data/content.js (Text & Config)   |
                    |  data/portfolio.js (Project Data)  |
                    +-----------------+------------------+
                                      |
                                      v
+------------------+        +-------------------+        +--------------------+
|  index.html      | <----+ |     js/app.js     | +----> |  index-light.html  |
|  (Dark Theme)    |        | (Renderer/Engine) |        |  (Light Theme)     |
+------------------+        +-------------------+        +--------------------+
```

## 2. Component Design

### 2.1 Language Switcher
- **Location:** Inside the sliding navigation menu (at the top of the menu list, above the first link) to keep the main viewport clean and uncluttered.
- **Controls:** Standard button controls (`EN` and `DE`) that update the active language.
- **Persistence:** LocalStorage key `edkimnjoroge-language` is used to remember the user's preferred language.

### 2.2 Dynamic Translation Engine (`js/app.js`)
- **Attributes:** Uses `data-i18n` for standard text translation, `data-i18n-html` for elements containing HTML tags, and placeholders for contact inputs.
- **Rendering Lifecycle:**
  1. Detect language (LocalStorage -> Browser settings -> default: `en`).
  2. Parse `window.siteContent` and update elements in DOM.
  3. Rebuild dynamic components: biography table, experience/education lists, skills chips, and portfolio items.

### 2.3 Portfolio Carousel & Filtering
- **Dynamic Grid Builder:** Reconstructs the Owl Carousel items based on the active category filter:
  - `all`: All items.
  - `website-apps`: Software Projects.
  - `three-d-motion`: Creative & TVC work.
- **Carousel Life Cycle:**
  1. On filter click, the active filter is set.
  2. The Owl Carousel instance is destroyed (`trigger('destroy.owl.carousel')` and classes removed).
  3. The `.owl-carousel` HTML is cleared and rebuilt with the filtered subset of `window.portfolioData.items`.
  4. The Owl Carousel is re-initialized with the dynamic configuration matching the template settings.

### 2.4 Portfolio Modal Popup Mapping
- Detailed project summaries will be injected inside `.fn__hidden` container for each carousel card.
- Clicking on a carousel item opens the native template modalbox containing:
  - **Header:** Title, Kicker, Category, Year.
  - **Full Description:** Multi-paragraph detailed analysis.
  - **Metadata Table (Aside):** Role, Stack/Tools, Outcome, Year.
  - **Gallery Grid:** Displays all gallery items for the project with their captions.
  - **Related Items:** Compares and links to other related items within the portfolio.

### 2.5 About & Biography Table
- Displays Name (`Edwin Njoroge`) and Email (`edkimnjoroge@gmail.com`).
- Other default fields from the template (Birthday, Age, Skype, Phone, Address) are dynamically hidden when not populated to maintain data integrity.

---

## 3. Data Flow

```
[User Page Load]
       |
       v
[Read LocalStorage/Browser Prefs] ---> [Select Language]
                                             |
                                             v
[Update Static HTML Texts via data-i18n] <---+
                                             |
                                             v
[Render Biography table & Resume lists] <----+
                                             |
                                             v
[Render Portfolio Carousel with Default Filter]
       |
       +---> [Click Category Filter] ----> [Filter Items -> Re-init Carousel]
       |
       +---> [Click Portfolio Item] ------> [Retrieve hidden details & Open Modal]
       |
       +---> [Toggle Language Button] ----> [Update LocalStorage & Re-render Page]
```

---

## 4. Error Handling & Edge Cases

1. **Carousel Re-initialization Fails:** If jQuery/Owl Carousel fails to re-init after filtering, fallback to a CSS Grid layout for display.
2. **Missing Media Files:** In case media files from `/assets/images/` fail to load, display a clean gradient backup container with the project title.
3. **Missing Language Entries:** Fallback to the English translation (`en`) if a translation is missing in the German (`de`) namespace.

---

## 5. Testing & Verification Plan

### Manual Verification Steps
- Validate layout rendering under both dark mode (`index.html`) and light mode (`index-light.html`).
- Confirm language switcher updates all text (biography, skills, footer, descriptions) instantly.
- Test category filters on the Portfolio section and ensure the carousel rebuilds smoothly on desktop, tablet, and mobile breakpoints.
- Open project modals for all 13 portfolio items to verify detailed descriptions, roles, stack tools, outcomes, and gallery images render cleanly.
