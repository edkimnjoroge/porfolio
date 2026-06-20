(function () {
  "use strict";

  var languageStorageKey = "edkimnjoroge-language";
  var fallbackLanguage = "en";
  var currentLanguage = fallbackLanguage;
  var currentPortfolioMode = "software";
  var currentMediaItems = [];
  var currentMediaIndex = 0;

  function getPreferredLanguage() {
    var stored = window.localStorage.getItem(languageStorageKey);
    if (stored === "en" || stored === "de") return stored;
    var browserLanguage = (navigator.language || "").toLowerCase();
    return browserLanguage.startsWith("de") ? "de" : fallbackLanguage;
  }

  function setStoredLanguage(language) {
    window.localStorage.setItem(languageStorageKey, language);
  }

  function escapeHtml(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getByPath(source, path) {
    return path.split(".").reduce(function (value, key) {
      return value ? value[key] : undefined;
    }, source);
  }

  function translate(value, language) {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
      if (value[language]) return value[language];
      if (value[fallbackLanguage]) return value[fallbackLanguage];
    }
    return "";
  }

  function getPortfolioLabel(key, language) {
    if (!window.portfolioData || !window.portfolioData.labels) return "";
    return translate(window.portfolioData.labels[key], language);
  }

  function getPortfolioModeContent(language) {
    var content = window.siteContent[language] || window.siteContent[fallbackLanguage];
    return currentPortfolioMode === "creative" ? content.creative : content.projects;
  }

  function getFilterLabel(filterKey, language) {
    var filters = (window.portfolioData && window.portfolioData.filters) || [];
    for (var i = 0; i < filters.length; i++) {
      if (filters[i].key === filterKey) return translate(filters[i].label, language);
    }
    return "";
  }

  function findPortfolioItem(slug) {
    var items = (window.portfolioData && window.portfolioData.items) || [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].slug === slug) return items[i];
    }
    return null;
  }

  function getPortfolioModeForItem(item) {
    return item && item.section === "creative" ? "creative" : "software";
  }

  function getCurrentModeIndex(item) {
    var items = getFilteredPortfolioItems();
    for (var i = 0; i < items.length; i++) {
      if (items[i].slug === item.slug) return i + 1;
    }
    return 1;
  }

  function getModalBox() {
    return $(".resumo_fn_modalbox");
  }

  function applyBackgroundImages(root) {
    var scope = root ? $(root) : $(document);
    scope.find("*[data-bg-img]").each(function () {
      var bg = $(this).attr("data-bg-img");
      if (bg) $(this).css({ backgroundImage: "url(" + bg + ")" });
    });
  }

  /* ---------- LANGUAGE SWITCHER ---------- */

  function renderLanguageSwitcher(lang) {
    var nav = document.getElementById("nav");
    if (!nav) return;

    var switcher = document.getElementById("site-language-switcher");
    if (!switcher) {
      switcher = document.createElement("div");
      switcher.id = "site-language-switcher";
      switcher.className = "site-language-switcher";
      switcher.innerHTML =
        '<button class="lang-btn" data-lang="en" type="button">EN</button>' +
        '<button class="lang-btn" data-lang="de" type="button">DE</button>';
      nav.insertBefore(switcher, nav.firstChild);

      var buttons = switcher.querySelectorAll(".lang-btn");
      for (var i = 0; i < buttons.length; i++) {
        (function (btn) {
          btn.addEventListener("click", function () {
            setStoredLanguage(btn.getAttribute("data-lang"));
            renderPage(btn.getAttribute("data-lang"));
          });
        })(buttons[i]);
      }
    }

    var allBtns = switcher.querySelectorAll(".lang-btn");
    for (var j = 0; j < allBtns.length; j++) {
      if (allBtns[j].getAttribute("data-lang") === lang) {
        allBtns[j].classList.add("active");
      } else {
        allBtns[j].classList.remove("active");
      }
    }
  }

  /* ---------- TRANSLATE ALL data-i18n ELEMENTS ---------- */

  function translatePage(lang) {
    var content = window.siteContent[lang] || window.siteContent[fallbackLanguage];

    var i18nEls = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < i18nEls.length; i++) {
      var path = i18nEls[i].getAttribute("data-i18n");
      var text = getByPath(content, path);
      if (typeof text === "string") i18nEls[i].textContent = text;
    }

    var htmlEls = document.querySelectorAll("[data-i18n-html]");
    for (var h = 0; h < htmlEls.length; h++) {
      var hPath = htmlEls[h].getAttribute("data-i18n-html");
      var html = getByPath(content, hPath);
      if (typeof html === "string") htmlEls[h].innerHTML = html;
    }

    // Moving placeholders for contact form
    var placeholders = document.querySelectorAll(".moving_placeholder[data-i18n]");
    for (var p = 0; p < placeholders.length; p++) {
      var pPath = placeholders[p].getAttribute("data-i18n");
      var pText = getByPath(content, pPath);
      if (typeof pText === "string") placeholders[p].textContent = pText;
    }

    document.title = "Edwin Njoroge | " + content.site.pageTitles.home;
  }

  /* ---------- BIOGRAPHY ---------- */

  function renderBiography(lang) {
    var content = window.siteContent[lang] || window.siteContent[fallbackLanguage];

    var aboutLeft = document.querySelector(".resumo_fn_about_info .about_left");
    if (aboutLeft) {
      aboutLeft.innerHTML =
        "<table><tbody>" +
        "<tr><th>Name</th><th>" + content.home.heroName + "</th></tr>" +
        '<tr><th>Email</th><th><a href="mailto:' + content.contact.emailValue + '">' + content.contact.emailValue + "</a></th></tr>" +
        "</tbody></table>";
    }

    var cvLink = document.querySelector(".resumo_fn_cv_btn a");
    if (cvLink) {
      cvLink.setAttribute("href", "assets/cv/Edwin_Njoroge_CV.pdf");
      var textSpan = cvLink.querySelector("span:not(.icon)");
      if (textSpan) textSpan.textContent = content.home.ctas.primary;
    }

    var paragraphsContainer = document.getElementById("about-paragraphs");
    if (paragraphsContainer && content.about && content.about.paragraphs) {
      var html = "";
      for (var i = 0; i < content.about.paragraphs.length; i++) {
        html += '<p class="desc" style="margin-top:' + (i > 0 ? "15px" : "0") + ';">' + content.about.paragraphs[i] + "</p>";
      }
      paragraphsContainer.innerHTML = html;
    }
  }

  /* ---------- EXPERIENCE ---------- */

  function renderExperience(lang) {
    var content = window.siteContent[lang] || window.siteContent[fallbackLanguage];
    var expContainer = document.querySelector("#tab1 .resumo_fn_boxed_list ul");
    if (!expContainer) return;

    var html = "";
    var exp = content.resume.experience;
    for (var i = 0; i < exp.length; i++) {
      var item = exp[i];
      var pointsHtml = "";
      for (var p = 0; p < item.points.length; p++) {
        pointsHtml += '<li style="margin-bottom:5px;font-size:15px;line-height:1.6;">' + item.points[p] + "</li>";
      }
      html +=
        '<li><div class="item"><div class="item_top"><h5>' + item.company + "</h5><span>( " + item.period + " )</span></div>" +
        "<h3>" + item.role + "</h3>" +
        '<ul style="margin-top:10px;padding-left:20px;list-style-type:disc;">' + pointsHtml + "</ul></div></li>";
    }
    expContainer.innerHTML = html;
  }

  /* ---------- EDUCATION ---------- */

  function renderEducation(lang) {
    var content = window.siteContent[lang] || window.siteContent[fallbackLanguage];
    var eduContainer = document.querySelector("#tab2 .resumo_fn_boxed_list ul");
    if (!eduContainer) return;

    var html = "";
    var edu = content.resume.education;
    for (var i = 0; i < edu.length; i++) {
      html +=
        '<li><div class="item"><div class="item_top"><h5>' + edu[i].org + "</h5><span>( " + edu[i].period + " )</span></div>" +
        "<h3>" + edu[i].title + "</h3></div></li>";
    }
    eduContainer.innerHTML = html;
  }

  /* ---------- SKILLS ---------- */

  function renderSkills(lang) {
    var content = window.siteContent[lang] || window.siteContent[fallbackLanguage];
    var skillsContainer = document.getElementById("tab3");
    if (!skillsContainer) return;

    var html = '<div class="resumo_fn_skills_groups" style="display:flex;flex-direction:column;gap:25px;margin-bottom:25px;">';
    var groups = content.resume.skillGroups;
    for (var g = 0; g < groups.length; g++) {
      html += '<div class="skills_group">';
      html += '<h4 style="margin-bottom:12px;font-size:15px;text-transform:uppercase;letter-spacing:1px;color:var(--mc);">' + groups[g].title + "</h4>";
      html += '<div class="skills_chips" style="display:flex;flex-wrap:wrap;gap:8px;">';
      for (var s = 0; s < groups[g].items.length; s++) {
        html += '<span class="skill_chip">' + groups[g].items[s] + "</span>";
      }
      html += "</div></div>";
    }
    html += "</div>";
    html += '<div class="resumo_fn_desc" style="margin-top:20px;border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;"><p>' + content.resume.summary + "</p></div>";
    skillsContainer.innerHTML = html;
  }

  /* ---------- PORTFOLIO HELPERS ---------- */

  function getFilteredPortfolioItems() {
    var pData = window.portfolioData;
    if (!pData || !pData.items) return [];

    var targetSection = currentPortfolioMode === "creative" ? "creative" : "projects";
    var items = [];

    for (var i = 0; i < pData.items.length; i++) {
      if (pData.items[i].section === targetSection) items.push(pData.items[i]);
    }

    return items;
  }

  function updatePortfolioHeading(lang) {
    var titleNode = document.getElementById("portfolio-section-title");
    if (!titleNode) return;

    var modeContent = getPortfolioModeContent(lang);
    if (modeContent && modeContent.title) {
      titleNode.textContent = modeContent.title;
    }
  }

  function buildPortfolioCard(item, index, lang) {
    var categoryLabel = getFilterLabel(item.categories[0], lang);
    var title = translate(item.title, lang);
    var mediaCount = item.gallery && item.gallery.length ? item.gallery.length : 0;
    var itemClass = "item modal_item";
    if (item.previewType === "video") itemClass += " modal_item--video";

    return (
      '<div class="' + itemClass + '" data-index="' + index + '">' +
        '<div class="img_holder">' +
          '<img src="img/thumb/square.jpg" alt="' + escapeHtml(title) + '">' +
          '<div class="abs_img" data-bg-img="' + escapeHtml(item.coverImage) + '"></div>' +
          (item.previewType === "video" ? '<span class="portfolio_card_play" aria-hidden="true"></span>' : "") +
          (mediaCount ? '<span class="portfolio_card_count">' + escapeHtml(mediaCount + " " + getPortfolioLabel("mediaCount", lang)) + "</span>" : "") +
        "</div>" +
        '<div class="title_holder">' +
          "<p>" + escapeHtml(categoryLabel) + "</p>" +
          '<h3><a href="#">' + escapeHtml(title) + "</a></h3>" +
        "</div>" +
        '<div class="fn__hidden">' + buildPortfolioModal(item, lang) + "</div>" +
      "</div>"
    );
  }

  function buildPortfolioMeta(item, lang) {
    var labels = {
      role: getPortfolioLabel("role", lang),
      stackOrTools: getPortfolioLabel("stackOrTools", lang),
      outcome: getPortfolioLabel("outcome", lang),
      year: getPortfolioLabel("year", lang)
    };

    return (
      '<div class="portfolio_modal_meta">' +
        '<div class="portfolio_modal_meta_item">' +
          '<span class="portfolio_modal_meta_label">' + escapeHtml(labels.role) + "</span>" +
          '<span class="portfolio_modal_meta_value">' + escapeHtml(translate(item.role, lang)) + "</span>" +
        "</div>" +
        '<div class="portfolio_modal_meta_item">' +
          '<span class="portfolio_modal_meta_label">' + escapeHtml(labels.stackOrTools) + "</span>" +
          '<span class="portfolio_modal_meta_value">' + escapeHtml(translate(item.stackOrTools, lang)) + "</span>" +
        "</div>" +
        '<div class="portfolio_modal_meta_item">' +
          '<span class="portfolio_modal_meta_label">' + escapeHtml(labels.outcome) + "</span>" +
          '<span class="portfolio_modal_meta_value">' + escapeHtml(translate(item.outcome, lang)) + "</span>" +
        "</div>" +
        '<div class="portfolio_modal_meta_item">' +
          '<span class="portfolio_modal_meta_label">' + escapeHtml(labels.year) + "</span>" +
          '<span class="portfolio_modal_meta_value">' + escapeHtml(item.year) + "</span>" +
        "</div>" +
      "</div>"
    );
  }

  function buildGalleryMedia(entry, lang) {
    var type = entry.type || "image";
    var caption = translate(entry.caption, lang);
    var alt = translate(entry.alt, lang) || caption;
    var watchLabel = getPortfolioLabel("watch", lang);
    var downloadLabel = getPortfolioLabel("download", lang);

    if (type === "video") {
      return (
        '<video controls preload="metadata"' + (entry.poster ? ' poster="' + escapeHtml(entry.poster) + '"' : "") + ">" +
          '<source src="' + escapeHtml(entry.src) + '" type="video/mp4">' +
          escapeHtml(caption) +
        "</video>"
      );
    }

    if (type === "embed") {
      return (
        '<button class="portfolio_gallery_external" type="button">' +
          (entry.poster ? '<img src="' + escapeHtml(entry.poster) + '" alt="' + escapeHtml(alt) + '">' : '<span class="portfolio_gallery_external_text">' + escapeHtml(watchLabel) + "</span>") +
          '<span class="portfolio_gallery_play" aria-hidden="true"></span>' +
        "</button>"
      );
    }

    if (type === "file") {
      return (
        '<a class="portfolio_gallery_file" href="' + escapeHtml(entry.src) + '" target="_blank" rel="noreferrer">' +
          '<span class="portfolio_gallery_file_icon" aria-hidden="true"></span>' +
          '<span>' + escapeHtml(downloadLabel) + "</span>" +
        "</a>"
      );
    }

    return (
      '<button class="portfolio_gallery_image_button" type="button">' +
        '<img src="' + escapeHtml(entry.src) + '" alt="' + escapeHtml(alt) + '">' +
      "</button>"
    );
  }

  function isViewableMedia(entry) {
    var type = entry && (entry.type || "image");
    return type === "image" || type === "video" || type === "embed";
  }

  function getViewableMediaItems(item) {
    var gallery = (item && item.gallery) || [];
    var media = [];
    for (var i = 0; i < gallery.length; i++) {
      if (isViewableMedia(gallery[i])) media.push(gallery[i]);
    }
    return media;
  }

  function getViewableIndex(item, galleryIndex) {
    var gallery = (item && item.gallery) || [];
    var index = 0;
    for (var i = 0; i < gallery.length; i++) {
      if (!isViewableMedia(gallery[i])) continue;
      if (i === galleryIndex) return index;
      index++;
    }
    return 0;
  }

  function buildPortfolioGallery(item, lang) {
    if (!item.gallery || !item.gallery.length) return "";

    var html = '<div class="portfolio_modal_section">';
    html += '<h4 class="portfolio_section_heading">' + escapeHtml(getPortfolioLabel("gallery", lang)) + "</h4>";
    html += '<div class="portfolio_gallery_grid">';

    for (var i = 0; i < item.gallery.length; i++) {
      var image = item.gallery[i];
      var mediaType = image.type || "image";
      var canOpen = mediaType === "image" || mediaType === "embed";
      html +=
        '<figure class="portfolio_gallery_item portfolio_gallery_item--' + escapeHtml(mediaType) + '"' + (canOpen ? ' data-gallery-open="' + i + '"' : "") + ">" +
          '<div class="portfolio_gallery_media">' +
            buildGalleryMedia(image, lang) +
          "</div>" +
          '<figcaption class="portfolio_gallery_caption">' + escapeHtml(translate(image.caption, lang)) + "</figcaption>" +
        "</figure>";
    }

    html += "</div></div>";
    return html;
  }

  function buildPortfolioLinks(item, lang) {
    if (!item.links || !item.links.length) return "";

    var html = '<div class="portfolio_modal_section">';
    html += '<h4 class="portfolio_section_heading">' + escapeHtml(getPortfolioLabel("links", lang)) + "</h4>";
    html += '<div class="portfolio_links_list">';

    for (var i = 0; i < item.links.length; i++) {
      var link = item.links[i];
      if (!link || !link.url) continue;

      html +=
        '<a class="portfolio_link_chip" href="' + escapeHtml(link.url) + '" target="_blank" rel="noreferrer">' +
          escapeHtml(translate(link.label, lang)) +
        "</a>";
    }

    html += "</div></div>";
    return html;
  }

  function buildRelatedWork(item, lang) {
    if (!item.relatedItems || !item.relatedItems.length) return "";

    var cards = "";
    for (var i = 0; i < item.relatedItems.length; i++) {
      var related = findPortfolioItem(item.relatedItems[i]);
      if (!related) continue;

      cards +=
        '<button class="portfolio_related_item" type="button" data-related-slug="' + escapeHtml(related.slug) + '">' +
          '<span class="portfolio_related_thumb" data-bg-img="' + escapeHtml(related.coverImage) + '"></span>' +
          "<p>" + escapeHtml(getFilterLabel(related.categories[0], lang)) + "</p>" +
          "<h4>" + escapeHtml(translate(related.title, lang)) + "</h4>" +
        "</button>";
    }

    if (!cards) return "";

    return (
      '<div class="portfolio_modal_section">' +
        '<h4 class="portfolio_section_heading">' + escapeHtml(getPortfolioLabel("related", lang)) + "</h4>" +
        '<div class="portfolio_related_grid">' + cards + "</div>" +
      "</div>"
    );
  }

  function buildPortfolioModal(item, lang) {
    var categoryLabel = getFilterLabel(item.categories[0], lang);
    var title = translate(item.title, lang);
    var summary = translate(item.summary, lang);
    var descriptions = (item.fullDescription && (item.fullDescription[lang] || item.fullDescription[fallbackLanguage])) || [];
    var descriptionHtml = "";

    for (var i = 0; i < descriptions.length; i++) {
      descriptionHtml += '<p class="fn__desc">' + escapeHtml(descriptions[i]) + "</p>";
    }

    return (
      '<div class="portfolio_modal_root" data-portfolio-slug="' + escapeHtml(item.slug) + '">' +
        '<p class="fn__cat">' + escapeHtml(categoryLabel + " . " + item.year) + "</p>" +
        '<h3 class="fn__title">' + escapeHtml(title) + "</h3>" +
        '<div class="img_holder">' +
          '<img src="img/thumb/square.jpg" alt="' + escapeHtml(title) + '">' +
          '<div class="abs_img" data-bg-img="' + escapeHtml(item.coverImage) + '"></div>' +
        "</div>" +
        '<div class="portfolio_modal_intro"><p>' + escapeHtml(summary) + "</p></div>" +
        descriptionHtml +
        buildPortfolioMeta(item, lang) +
        buildPortfolioLinks(item, lang) +
        buildPortfolioGallery(item, lang) +
        buildRelatedWork(item, lang) +
      "</div>"
    );
  }

  function openPortfolioModalItem(item) {
    if (!item) return;

    var targetMode = getPortfolioModeForItem(item);
    if (currentPortfolioMode !== targetMode) {
      currentPortfolioMode = targetMode;
      updatePortfolioHeading(currentLanguage);
      rebuildPortfolioCarousel(currentLanguage);
    }

    var modalBox = getModalBox();
    var prevNext = modalBox.find(".fn__nav");
    var index = getCurrentModeIndex(item);

    prevNext.attr("data-index", index);
    prevNext.attr("data-from", "portfolio");

    $("body").addClass("modal");
    modalBox.addClass("opened");
    modalBox.find(".modal_in").html(buildPortfolioModal(item, currentLanguage));
    modalBox.find(".modal_content").stop().animate({ scrollTop: 0 }, 200);
    closeMediaViewer();
    applyBackgroundImages(modalBox);
  }

  function getCurrentModalItem() {
    var slug = $(".resumo_fn_modalbox .portfolio_modal_root").attr("data-portfolio-slug");
    return slug ? findPortfolioItem(slug) : null;
  }

  function toEmbedUrl(url) {
    var youtube = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
    if (youtube && youtube[1]) return "https://www.youtube.com/embed/" + youtube[1];

    var vimeo = String(url).match(/vimeo\.com\/([0-9]+)/);
    if (vimeo && vimeo[1]) return "https://player.vimeo.com/video/" + vimeo[1];

    return url;
  }

  function ensureMediaViewer() {
    var modalBox = getModalBox();
    var viewer = modalBox.find(".portfolio_media_viewer");
    if (viewer.length) return viewer;

    modalBox.find(".box_inner").append(
      '<div class="portfolio_media_viewer" hidden>' +
        '<button class="portfolio_media_viewer__close" type="button" data-media-close aria-label="' + escapeHtml(getPortfolioLabel("close", currentLanguage)) + '"></button>' +
        '<button class="portfolio_media_viewer__nav portfolio_media_viewer__nav--prev" type="button" data-media-prev>' + escapeHtml(getPortfolioLabel("previous", currentLanguage)) + "</button>" +
        '<div class="portfolio_media_viewer__frame">' +
          '<div class="portfolio_media_viewer__media"></div>' +
          '<p class="portfolio_media_viewer__caption"></p>' +
        "</div>" +
        '<button class="portfolio_media_viewer__nav portfolio_media_viewer__nav--next" type="button" data-media-next>' + escapeHtml(getPortfolioLabel("next", currentLanguage)) + "</button>" +
      "</div>"
    );

    return modalBox.find(".portfolio_media_viewer");
  }

  function renderMediaViewer() {
    var viewer = ensureMediaViewer();
    var mediaNode = viewer.find(".portfolio_media_viewer__media");
    var captionNode = viewer.find(".portfolio_media_viewer__caption");
    var entry = currentMediaItems[currentMediaIndex];
    if (!entry) return;

    var type = entry.type || "image";
    var caption = translate(entry.caption, currentLanguage);
    var alt = translate(entry.alt, currentLanguage) || caption;
    var mediaHtml = "";

    if (type === "video") {
      mediaHtml =
        '<video controls autoplay preload="metadata"' + (entry.poster ? ' poster="' + escapeHtml(entry.poster) + '"' : "") + ">" +
          '<source src="' + escapeHtml(entry.src) + '" type="video/mp4">' +
          escapeHtml(caption) +
        "</video>";
    } else if (type === "embed") {
      mediaHtml =
        '<iframe src="' + escapeHtml(toEmbedUrl(entry.src)) + '" title="' + escapeHtml(alt) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    } else {
      mediaHtml = '<img src="' + escapeHtml(entry.src) + '" alt="' + escapeHtml(alt) + '">';
    }

    mediaNode.html(mediaHtml);
    captionNode.text(caption);
    viewer.find("[data-media-prev], [data-media-next]").toggle(currentMediaItems.length > 1);
  }

  function openMediaViewer(item, mediaIndex) {
    currentMediaItems = getViewableMediaItems(item);
    if (!currentMediaItems.length) return;

    currentMediaIndex = Math.max(0, Math.min(mediaIndex, currentMediaItems.length - 1));
    renderMediaViewer();
    ensureMediaViewer().prop("hidden", false).addClass("is-open");
    getModalBox().addClass("media-viewer-open");
  }

  function closeMediaViewer() {
    var modalBox = getModalBox();
    var viewer = modalBox.find(".portfolio_media_viewer");
    if (!viewer.length) return;

    viewer.prop("hidden", true).removeClass("is-open");
    viewer.find(".portfolio_media_viewer__media").html("");
    modalBox.removeClass("media-viewer-open");
  }

  function moveMediaViewer(direction) {
    if (!currentMediaItems.length) return;
    currentMediaIndex = (currentMediaIndex + direction + currentMediaItems.length) % currentMediaItems.length;
    renderMediaViewer();
  }

  /* ---------- PORTFOLIO CAROUSEL REBUILD ---------- */

  function rebuildPortfolioCarousel(lang) {
    var items = getFilteredPortfolioItems();

    var carouselContainer = document.getElementById("portfolio-carousel");
    if (!carouselContainer) return;

    var $carousel = $(carouselContainer);

    // Destroy existing Owl Carousel if active
    if ($carousel.hasClass("owl-loaded")) {
      $carousel.trigger("destroy.owl.carousel");
      $carousel.html("");
      $carousel.removeClass("owl-loaded owl-drag owl-responsive owl-hidden");
    }

    carouselContainer.setAttribute("data-count", String(items.length));

    var carouselHtml = "";
    for (var i = 0; i < items.length; i++) {
      carouselHtml += buildPortfolioCard(items[i], i + 1, lang);
    }

    carouselContainer.innerHTML = carouselHtml;
    applyBackgroundImages(carouselContainer);

    var loopEnabled = items.length > 1;
    $carousel.owlCarousel({
      autoplay: true,
      autoplayTimeout: 7000,
      smartSpeed: 1000,
      margin: 20,
      nav: false,
      loop: loopEnabled,
      autoWidth: true,
      items: 4,
      dots: false,
      responsive: {
        0: { autoWidth: false, items: 1 },
        700: { autoWidth: true, items: 4 }
      }
    });

    var parent = $carousel.closest("#portfolio");
    var prev = parent.find(".my__nav .prev");
    var next = parent.find(".my__nav .next");
    prev.off("click").on("click", function () { $carousel.trigger("prev.owl"); return false; });
    next.off("click").on("click", function () { $carousel.trigger("next.owl"); return false; });

    bindModalTriggers();
  }

  /* ---------- MODAL TRIGGERS ---------- */

  function bindModalTriggers() {
    var modalBox = $(".resumo_fn_modalbox");
    var prevNext = modalBox.find(".fn__nav");

    // Rebind click on dynamic modal_items (portfolio only)
    $("#portfolio-carousel .modal_item").off("click").on("click", function () {
      var index = Number($(this).attr("data-index")) || 1;
      var items = getFilteredPortfolioItems();
      openPortfolioModalItem(items[index - 1]);

      return false;
    });

    modalBox.off("click.portfolioRelated").on("click.portfolioRelated", "[data-related-slug]", function () {
      openPortfolioModalItem(findPortfolioItem($(this).attr("data-related-slug")));
      return false;
    });

    modalBox.off("click.portfolioGallery").on("click.portfolioGallery", "[data-gallery-open]", function (event) {
      if ($(event.target).closest(".portfolio_gallery_file").length) return true;
      var item = getCurrentModalItem();
      if (!item) return false;
      var galleryIndex = Number($(this).attr("data-gallery-open")) || 0;
      openMediaViewer(item, getViewableIndex(item, galleryIndex));
      return false;
    });

    modalBox.off("click.portfolioMediaViewer").on("click.portfolioMediaViewer", "[data-media-close]", function () {
      closeMediaViewer();
      return false;
    }).on("click.portfolioMediaViewer", "[data-media-prev]", function () {
      moveMediaViewer(-1);
      return false;
    }).on("click.portfolioMediaViewer", "[data-media-next]", function () {
      moveMediaViewer(1);
      return false;
    });

    modalBox.find(".closer,.extra_closer").off("click.portfolioMediaClose").on("click.portfolioMediaClose", function () {
      closeMediaViewer();
    });

    $(document).off("keydown.portfolioMediaViewer").on("keydown.portfolioMediaViewer", function (event) {
      var viewer = getModalBox().find(".portfolio_media_viewer");
      var isOpen = viewer.length && !viewer.prop("hidden");
      if (!isOpen) return;

      if (event.key === "Escape") {
        closeMediaViewer();
        event.preventDefault();
      } else if (event.key === "ArrowLeft") {
        moveMediaViewer(-1);
        event.preventDefault();
      } else if (event.key === "ArrowRight") {
        moveMediaViewer(1);
        event.preventDefault();
      }
    });
  }

  /* ---------- PORTFOLIO MODE LINKS ---------- */

  function bindPortfolioModeLinks() {
    $('a[data-portfolio-mode]').off("click.portfolioMode").on("click.portfolioMode", function (event) {
      if (event) event.preventDefault();

      var sectionSelector = $(this).attr("href");
      var section = sectionSelector ? $(sectionSelector) : $();
      var mode = $(this).attr("data-portfolio-mode");

      setPortfolioMode(mode);
      $('a[data-portfolio-mode]').removeClass("active");
      $(this).addClass("active");

      if (section.length) {
        $("html, body").stop().animate({
          scrollTop: section.offset().top
        }, 1000);
      }

      $('#nav ul li').css({ transitionDelay: '0ms' });
      $('.resumo_fn_wrapper').removeClass('nav-opened nav-hover-close');
      $('.resumo_fn_navigation .nav_footer').removeClass('ready');

      return false;
    });
  }

  function setPortfolioMode(mode) {
    var nextMode = mode === "creative" ? "creative" : "software";
    currentPortfolioMode = nextMode;
    updatePortfolioHeading(currentLanguage);
    rebuildPortfolioCarousel(currentLanguage);
  }

  /* ---------- RENDER PAGE ---------- */

  function renderPage(lang) {
    currentLanguage = lang || fallbackLanguage;
    renderLanguageSwitcher(lang);
    translatePage(lang);
    renderBiography(lang);
    renderExperience(lang);
    renderEducation(lang);
    renderSkills(lang);
    updatePortfolioHeading(currentLanguage);
    rebuildPortfolioCarousel(currentLanguage);
    bindPortfolioModeLinks();
  }

  /* ---------- BOOT ---------- */

  // Wait for init.js to finish its DOM-ready work, then override with our dynamic data.
  // We use a short setTimeout to guarantee init.js's $(document).ready() has completed.
  $(document).ready(function () {
    setTimeout(function () {
      renderPage(getPreferredLanguage());
    }, 100);
  });

  window.renderAppPage = renderPage;
  window.getPreferredLanguage = getPreferredLanguage;
  window.setPortfolioMode = setPortfolioMode;
})();
