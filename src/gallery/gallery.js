(() => {
  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.insetBlockStart = "-1000px";
    document.body.append(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();

    if (!copied) {
      throw new Error("Copy failed");
    }
  };

  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy-target]");
    if (!button) return;

    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;

    const label = button.textContent;
    try {
      await copyText(target.textContent);
      button.dataset.copied = "true";
      button.textContent = "Copied";
    } catch {
      button.textContent = "Copy failed";
    }

    window.setTimeout(() => {
      button.textContent = label;
      delete button.dataset.copied;
    }, 1600);
  });

  const filterButtons = [...document.querySelectorAll("button[data-filter]")];
  const cards = [...document.querySelectorAll(".g-card[data-category]")];
  const visibleCount = document.getElementById("g-visible-count");
  const visibleNoun = document.getElementById("g-visible-noun");
  const emptyFilter = document.getElementById("g-empty-filter");

  if (filterButtons.length && cards.length) {
    const applyFilter = (filter) => {
      let visible = 0;

      for (const card of cards) {
        const show = filter === "all" || card.dataset.category === filter;
        card.hidden = !show;
        if (show) visible += 1;
      }

      for (const button of filterButtons) {
        button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
      }

      if (visibleCount) visibleCount.textContent = String(visible);
      if (visibleNoun) visibleNoun.textContent = visible === 1 ? "block" : "blocks";
      if (emptyFilter) emptyFilter.hidden = visible !== 0;
    };

    for (const button of filterButtons) {
      button.addEventListener("click", () => applyFilter(button.dataset.filter));
    }
  }

  const stage = document.querySelector(".g-stage");
  const viewportButtons = [...document.querySelectorAll("button[data-viewport]")];

  if (stage && viewportButtons.length) {
    const applyViewport = (viewport) => {
      stage.dataset.viewport = viewport;
      for (const button of viewportButtons) {
        button.setAttribute("aria-pressed", String(button.dataset.viewport === viewport));
      }

      try {
        localStorage.setItem("actual-blocks:viewport", viewport);
      } catch {
        /* Storage can be unavailable; the control still works. */
      }
    };

    for (const button of viewportButtons) {
      button.addEventListener("click", () => applyViewport(button.dataset.viewport));
    }

    try {
      const saved = localStorage.getItem("actual-blocks:viewport");
      if (saved === "desktop" || saved === "mobile") applyViewport(saved);
    } catch {
      /* Ignore storage access failures. */
    }
  }

  const themeButtons = [...document.querySelectorAll("button[data-preview-theme]")];
  const frame = document.getElementById("g-preview-frame");
  const openLink = document.querySelector("[data-preview-link]");

  const variantButtons = [...document.querySelectorAll("button[data-preview-variant]")];
  const previewUrl = document.getElementById("g-preview-url");

  if (stage && themeButtons.length && frame) {
    // Original and remix are two generated documents over the same fragment;
    // the theme travels as a query parameter to whichever one is shown.
    let theme = stage.dataset.previewTheme || "light";
    let variant = "original";

    const previewBase = () => (variant === "remix" ? frame.dataset.previewRemixSrc : frame.dataset.previewSrc);

    const showPreview = () => {
      const base = previewBase();
      if (base) frame.src = `${base}?theme=${theme}`;
      if (openLink && base) openLink.href = `${base}?theme=${theme}`;
      if (previewUrl && base) previewUrl.textContent = base.replace(/^\.\.\//, "");
    };

    const applyVariant = (value) => {
      variant = value;
      stage.dataset.previewVariant = value;
      for (const button of variantButtons) {
        button.setAttribute("aria-pressed", String(button.dataset.previewVariant === value));
      }
      showPreview();
    };

    for (const button of variantButtons) {
      button.addEventListener("click", () => applyVariant(button.dataset.previewVariant));
    }

    const applyTheme = (value) => {
      theme = value;
      stage.dataset.previewTheme = theme;

      for (const button of themeButtons) {
        button.setAttribute("aria-pressed", String(button.dataset.previewTheme === theme));
      }

      showPreview();

      try {
        localStorage.setItem("actual-blocks:theme", theme);
      } catch {
        /* Storage can be unavailable; the control still works. */
      }
    };

    for (const button of themeButtons) {
      button.addEventListener("click", () => applyTheme(button.dataset.previewTheme));
    }

    try {
      const saved = localStorage.getItem("actual-blocks:theme");
      if (saved === "light" || saved === "dark") applyTheme(saved);
    } catch {
      /* Ignore storage access failures. */
    }
  }

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = tabs
    .map((tab) => document.getElementById(tab.getAttribute("aria-controls")))
    .filter(Boolean);

  if (tabs.length && panels.length === tabs.length) {
    const activateTab = (activeTab, moveFocus = false) => {
      for (const tab of tabs) {
        const selected = tab === activeTab;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;

        const panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      }

      if (moveFocus) activeTab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab));

      tab.addEventListener("keydown", (event) => {
        let nextIndex = null;

        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;

        if (nextIndex !== null) {
          event.preventDefault();
          activateTab(tabs[nextIndex], true);
        }
      });
    });
  }
})();
