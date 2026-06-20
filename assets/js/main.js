(function () {
  const routes = {
    home: "/",
    about: "/about/",
    resume: "/resume/",
    projects: "/projects/",
    creative: "/creative/",
    contact: "/contact/",
  };

  const languageStorageKey = "edkimnjoroge-language";
  const fallbackLanguage = "en";
  const defaultFilterByPage = {
    projects: "website-apps",
    creative: "three-d-motion",
  };

  let currentLanguage = fallbackLanguage;
  let currentPortfolioFilter = null;
  let lightboxItems = [];
  let lightboxIndex = 0;

  function getPreferredLanguage() {
    const stored = window.localStorage.getItem(languageStorageKey);
    if (stored === "en" || stored === "de") return stored;

    const browserLanguage = (navigator.language || "").toLowerCase();
    return browserLanguage.startsWith("de") ? "de" : fallbackLanguage;
  }

  function setStoredLanguage(language) {
    window.localStorage.setItem(languageStorageKey, language);
  }

  function getByPath(source, path) {
    return path.split(".").reduce((value, key) => (value ? value[key] : undefined), source);
  }

  function translate(value, language) {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && value[language]) return value[language];
    return "";
  }

  function getPortfolioItems() {
    return window.portfolioData?.items || [];
  }

  function getPortfolioItem(section, slug) {
    return getPortfolioItems().find((item) => item.section === section && item.slug === slug);
  }

  function renderNavigation(content, page) {
    const navRoot = document.getElementById("site-nav");
    if (!navRoot) return;

    navRoot.innerHTML = "";

    Object.entries(content.site.nav).forEach(([key, label]) => {
      const item = document.createElement("li");
      item.className = "site-nav__item";

      const link = document.createElement("a");
      link.className = "site-nav__link";
      if (key === page || (page === "portfolio-detail" && key === document.body.dataset.section)) {
        link.classList.add("is-active");
      }
      link.href = routes[key];
      link.textContent = label;

      item.appendChild(link);
      navRoot.appendChild(item);
    });
  }

  function updateLanguageToggle(language, content) {
    const label = document.getElementById("language-label");
    if (label) label.textContent = content.site.switchLabel;

    document.querySelectorAll("[data-lang]").forEach((button) => {
      const isActive = button.dataset.lang === language;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function updateTextNodes(content) {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = getByPath(content, element.dataset.i18n);
      if (typeof value === "string") element.textContent = value;
    });
  }

  function updateHtmlNodes(content) {
    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      const value = getByPath(content, element.dataset.i18nHtml);
      if (typeof value === "string") element.innerHTML = value;
    });
  }

  function renderList(containerId, items, itemClassName) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = itemClassName;
      li.textContent = item;
      container.appendChild(li);
    });
  }

  function renderHome(content) {
    renderList("home-focus-list", content.home.focusItems, "chip-list__item");

    const strengths = document.getElementById("home-strengths");
    if (strengths) {
      strengths.innerHTML = "";
      content.home.strengths.forEach((strength) => {
        const article = document.createElement("article");
        article.className = "feature-card";
        article.innerHTML = `
          <h3>${strength.title}</h3>
          <p>${strength.body}</p>
        `;
        strengths.appendChild(article);
      });
    }

    const pathways = document.getElementById("home-pathways");
    if (pathways) {
      pathways.innerHTML = "";
      content.home.pathways.forEach((path) => {
        const article = document.createElement("article");
        article.className = "feature-card";
        article.innerHTML = `
          <h3>${path.title}</h3>
          <p>${path.body}</p>
        `;
        pathways.appendChild(article);
      });
    }

    renderList("home-cta-panel-list", content.home.ctaPanelItems, "detail-list__item");
  }

  function renderResume(content) {
    const experience = document.getElementById("resume-experience");
    if (experience) {
      experience.innerHTML = "";
      content.resume.experience.forEach((item) => {
        const article = document.createElement("article");
        article.className = "timeline-card";
        article.innerHTML = `
          <div class="timeline-card__top">
            <p class="timeline-card__period">${item.period}</p>
            <h3>${item.role}</h3>
            <p class="timeline-card__company">${item.company}</p>
          </div>
          <ul class="detail-list">
            ${item.points.map((point) => `<li>${point}</li>`).join("")}
          </ul>
        `;
        experience.appendChild(article);
      });
    }

    const skills = document.getElementById("resume-skills");
    if (skills) {
      skills.innerHTML = "";
      content.resume.skillGroups.forEach((group) => {
        const article = document.createElement("article");
        article.className = "stack-card";
        article.innerHTML = `
          <h3>${group.title}</h3>
          <ul class="chip-list">
            ${group.items.map((item) => `<li class="chip-list__item">${item}</li>`).join("")}
          </ul>
        `;
        skills.appendChild(article);
      });
    }

    const education = document.getElementById("resume-education");
    if (education) {
      education.innerHTML = "";
      content.resume.education.forEach((item) => {
        const article = document.createElement("article");
        article.className = "info-card";
        article.innerHTML = `
          <p class="timeline-card__period">${item.period}</p>
          <h3>${item.title}</h3>
          <p>${item.org}</p>
        `;
        education.appendChild(article);
      });
    }

    const downloads = document.getElementById("resume-downloads");
    if (downloads) {
      downloads.innerHTML = "";
      content.resume.downloads.forEach((item) => {
        const link = document.createElement("a");
        link.className = "button button--secondary";
        link.href = item.href;
        link.textContent = item.label;
        link.setAttribute("download", "");
        downloads.appendChild(link);
      });
    }
  }

  function getFilterLabel(filterKey, language) {
    const filter = window.portfolioData.filters.find((entry) => entry.key === filterKey);
    return filter ? translate(filter.label, language) : filterKey;
  }

  function getVisiblePortfolioItems(page) {
    const filter = currentPortfolioFilter || defaultFilterByPage[page] || "all";
    const items = getPortfolioItems();
    if (filter === "all") return items;
    return items.filter((item) => item.categories.includes(filter));
  }

  function renderPortfolioFilters(content, language, page) {
    const toolbar = document.getElementById("portfolio-filters");
    const label = document.getElementById("portfolio-filter-label");
    if (!toolbar) return;

    if (!currentPortfolioFilter) currentPortfolioFilter = defaultFilterByPage[page] || "all";
    if (label) label.textContent = content[page].browseLabel;

    toolbar.innerHTML = "";

    window.portfolioData.filters.forEach((filter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-chip";
      if (filter.key === currentPortfolioFilter) button.classList.add("is-active");
      button.dataset.portfolioFilter = filter.key;
      button.setAttribute("aria-pressed", String(filter.key === currentPortfolioFilter));
      button.textContent = translate(filter.label, language);
      toolbar.appendChild(button);
    });
  }

  function renderPortfolioListing(content, language, page) {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    renderPortfolioFilters(content, language, page);

    const items = getVisiblePortfolioItems(page);
    grid.innerHTML = "";

    items.forEach((item) => {
      const categoryLabel = getFilterLabel(item.categories[0], language);
      const article = document.createElement("article");
      article.className = "portfolio-card";
      article.innerHTML = `
        <a class="portfolio-card__image-wrap" href="/${item.section}/${item.slug}/">
          <img class="portfolio-card__image" src="${item.coverImage}" alt="${translate(item.title, language)}" loading="lazy">
        </a>
        <div class="portfolio-card__body">
          <div class="portfolio-card__meta">
            <span class="portfolio-tag">${categoryLabel}</span>
            <span class="portfolio-year">${item.year}</span>
          </div>
          <p class="eyebrow">${translate(item.kicker, language)}</p>
          <h3>${translate(item.title, language)}</h3>
          <p>${translate(item.summary, language)}</p>
          <div class="portfolio-card__footer">
            <a class="button button--secondary" href="/${item.section}/${item.slug}/">${translate(window.portfolioData.labels.viewDetails, language)}</a>
          </div>
        </div>
      `;
      grid.appendChild(article);
    });
  }

  function renderDetailMetaRow(term, value) {
    return `
      <div class="detail-meta__row">
        <dt>${term}</dt>
        <dd>${value}</dd>
      </div>
    `;
  }

  function renderPortfolioDetail(language) {
    const detailRoot = document.getElementById("portfolio-detail");
    if (!detailRoot) return;

    const section = document.body.dataset.section;
    const slug = document.body.dataset.slug;
    const item = getPortfolioItem(section, slug);
    if (!item) {
      detailRoot.innerHTML = `<p class="page-intro">${translate(window.portfolioData.labels.projectNotFound, language)}</p>`;
      return;
    }

    document.title = `Edwin Njoroge | ${translate(item.title, language)}`;

    const backLink = document.getElementById("portfolio-back-link");
    if (backLink) {
      backLink.href = section === "projects" ? routes.projects : routes.creative;
      backLink.textContent = translate(window.portfolioData.labels.backTo[section], language);
    }

    const labels = window.portfolioData.labels;
    const category = getFilterLabel(item.categories[0], language);
    const descriptionHtml = item.fullDescription[language]
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
    const relatedItems = (item.relatedItems || [])
      .map((relatedSlug) => getPortfolioItems().find((entry) => entry.slug === relatedSlug))
      .filter(Boolean);

    detailRoot.innerHTML = `
      <section class="page-hero section-panel detail-hero">
        <p class="eyebrow">${translate(item.kicker, language)}</p>
        <div class="detail-hero__top">
          <div>
            <div class="portfolio-card__meta">
              <span class="portfolio-tag">${category}</span>
              <span class="portfolio-year">${item.year}</span>
            </div>
            <h1 class="page-title">${translate(item.title, language)}</h1>
            <p class="page-intro">${translate(item.summary, language)}</p>
          </div>
          <img class="detail-hero__cover" src="${item.coverImage}" alt="${translate(item.title, language)}">
        </div>
      </section>

      <section class="section detail-layout">
        <article class="section-panel detail-body">
          <div class="detail-copy">${descriptionHtml}</div>
        </article>
        <aside class="section-panel detail-aside">
          <dl class="detail-meta">
            ${renderDetailMetaRow(translate(labels.role, language), translate(item.role, language))}
            ${renderDetailMetaRow(translate(labels.stackOrTools, language), translate(item.stackOrTools, language))}
            ${renderDetailMetaRow(translate(labels.outcome, language), translate(item.outcome, language))}
            ${renderDetailMetaRow(translate(labels.year, language), item.year)}
          </dl>
        </aside>
      </section>

      <section class="section">
        <div class="section-panel">
          <div class="section-header">
            <div>
              <p class="eyebrow">${translate(labels.gallery, language)}</p>
              <h2 class="section-title">${translate(labels.gallery, language)}</h2>
            </div>
          </div>
          <div class="gallery-grid" id="detail-gallery">
            ${item.gallery
              .map(
                (entry, index) => `
                  <button class="gallery-card" type="button" data-lightbox-open="${index}">
                    <img src="${entry.src}" alt="${translate(entry.alt, language)}">
                    <span class="gallery-card__caption">${translate(entry.caption, language)}</span>
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-panel">
          <div class="section-header">
            <div>
              <p class="eyebrow">${translate(labels.related, language)}</p>
              <h2 class="section-title">${translate(labels.related, language)}</h2>
            </div>
          </div>
          <div class="portfolio-grid portfolio-grid--related">
            ${relatedItems
              .map(
                (related) => `
                  <article class="portfolio-card portfolio-card--compact">
                    <a class="portfolio-card__image-wrap" href="/${related.section}/${related.slug}/">
                      <img class="portfolio-card__image" src="${related.coverImage}" alt="${translate(related.title, language)}" loading="lazy">
                    </a>
                    <div class="portfolio-card__body">
                      <p class="eyebrow">${translate(related.kicker, language)}</p>
                      <h3>${translate(related.title, language)}</h3>
                      <p>${translate(related.summary, language)}</p>
                      <div class="portfolio-card__footer">
                        <a class="button button--secondary" href="/${related.section}/${related.slug}/">${translate(labels.viewDetails, language)}</a>
                      </div>
                    </div>
                  </article>
                `,
              )
              .join("")}
          </div>
        </div>
      </section>
    `;

    lightboxItems = item.gallery;
  }

  function renderContact(content) {
    const emailLink = document.getElementById("contact-email-link");
    if (emailLink) {
      emailLink.href = `mailto:${content.contact.emailValue}`;
      emailLink.textContent = content.contact.emailValue;
    }

    renderList("contact-links", content.contact.links, "detail-list__item");

    const actions = document.getElementById("contact-actions");
    if (actions) {
      actions.innerHTML = "";
      content.contact.actions.forEach((action) => {
        const link = document.createElement("a");
        link.className = `button button--${action.type}`;
        link.href = action.href;
        link.textContent = action.label;
        if (action.href.endsWith(".pdf")) link.setAttribute("download", "");
        actions.appendChild(link);
      });
    }
  }

  function renderFooter(content) {
    const footerStatement = document.getElementById("footer-statement");
    const footerCopyright = document.getElementById("footer-copy");
    const footerYear = document.getElementById("footer-year");

    if (footerStatement) footerStatement.textContent = content.site.footer.statement;
    if (footerCopyright) footerCopyright.textContent = content.site.footer.copyright;
    if (footerYear) footerYear.textContent = new Date().getFullYear();
  }

  function updateLightbox(language) {
    const modal = document.getElementById("lightbox-modal");
    const image = document.getElementById("lightbox-image");
    const caption = document.getElementById("lightbox-caption");
    const close = document.getElementById("lightbox-close");
    const previous = document.getElementById("lightbox-previous");
    const next = document.getElementById("lightbox-next");
    if (!modal || !image || !caption || !close || !previous || !next) return;

    close.textContent = translate(window.portfolioData.labels.close, language);
    previous.textContent = translate(window.portfolioData.labels.previous, language);
    next.textContent = translate(window.portfolioData.labels.next, language);

    const current = lightboxItems[lightboxIndex];
    if (!current) return;

    image.src = current.src;
    image.alt = translate(current.alt, language);
    caption.textContent = translate(current.caption, language);
  }

  function openLightbox(index) {
    const modal = document.getElementById("lightbox-modal");
    if (!modal || !lightboxItems.length) return;

    lightboxIndex = index;
    updateLightbox(currentLanguage);
    modal.hidden = false;
    document.body.classList.add("is-lightbox-open");
  }

  function closeLightbox() {
    const modal = document.getElementById("lightbox-modal");
    if (!modal) return;

    modal.hidden = true;
    document.body.classList.remove("is-lightbox-open");
  }

  function moveLightbox(direction) {
    if (!lightboxItems.length) return;
    lightboxIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
    updateLightbox(currentLanguage);
  }

  function renderPage(language) {
    currentLanguage = language;
    const content = window.siteContent[language] || window.siteContent[fallbackLanguage];
    const page = document.body.dataset.page || "home";

    document.documentElement.lang = language;
    document.title = `Edwin Njoroge | ${content.site.pageTitles[page] || "Portfolio"}`;

    renderNavigation(content, page);
    updateLanguageToggle(language, content);
    updateTextNodes(content);
    updateHtmlNodes(content);
    renderFooter(content);

    renderHome(content);
    renderResume(content);
    renderPortfolioListing(content, language, page);
    renderPortfolioDetail(language);
    renderContact(content);
    updateLightbox(language);
  }

  function bindLanguageEvents() {
    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.addEventListener("click", () => {
        const language = button.dataset.lang;
        setStoredLanguage(language);
        renderPage(language);
      });
    });
  }

  function bindPortfolioEvents() {
    document.addEventListener("click", (event) => {
      const filterButton = event.target.closest("[data-portfolio-filter]");
      if (filterButton) {
        currentPortfolioFilter = filterButton.dataset.portfolioFilter;
        renderPage(currentLanguage);
        return;
      }

      const galleryButton = event.target.closest("[data-lightbox-open]");
      if (galleryButton) {
        openLightbox(Number(galleryButton.dataset.lightboxOpen));
        return;
      }

      if (event.target.closest("#lightbox-close")) {
        closeLightbox();
        return;
      }

      if (event.target.closest("#lightbox-previous")) {
        moveLightbox(-1);
        return;
      }

      if (event.target.closest("#lightbox-next")) {
        moveLightbox(1);
        return;
      }

      if (event.target.id === "lightbox-modal") {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      const modal = document.getElementById("lightbox-modal");
      const isOpen = modal && !modal.hidden;
      if (event.key === "Escape") closeLightbox();
      if (isOpen && event.key === "ArrowLeft") moveLightbox(-1);
      if (isOpen && event.key === "ArrowRight") moveLightbox(1);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindLanguageEvents();
    bindPortfolioEvents();
    renderPage(getPreferredLanguage());
  });
})();
