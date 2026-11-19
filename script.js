(() => {
  const year = document.getElementById("yr");
  if (year) year.textContent = new Date().getFullYear();
  const header = document.querySelector(".site-header");
  const menu = document.querySelector(".menu-toggle");
  const nav = document.getElementById("main-nav");
  const backdrop = document.querySelector(".nav-backdrop");
  const compactNav = matchMedia("(max-width: 1200px)");
  if (header && menu && nav && backdrop) {
    const label = menu.querySelector(".menu-label");
    const isOpen = () => menu.getAttribute("aria-expanded") === "true";
    function setMenu(open, restoreFocus = false) {
      open = Boolean(open && compactNav.matches);
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation",
      );
      label.textContent = open ? "Close" : "Menu";
      nav.classList.toggle("open", open);
      nav.hidden = compactNav.matches && !open;
      backdrop.hidden = !open;
      document.documentElement.classList.toggle("nav-is-open", open);
      if (restoreFocus) menu.focus();
    }
    const measureHeader = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        header.getBoundingClientRect().height + "px",
      );
    };
    new ResizeObserver(measureHeader).observe(header);
    menu.addEventListener("click", () => setMenu(!isOpen()));
    nav
      .querySelector(".nav-close")
      ?.addEventListener("click", () => setMenu(false, true));
    backdrop.addEventListener("click", () => setMenu(false, true));
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        event.preventDefault();
        setMenu(false, true);
      }
    });
    document.addEventListener("pointerdown", (event) => {
      if (isOpen() && !header.contains(event.target)) setMenu(false);
    });
    document.addEventListener("focusin", (event) => {
      if (isOpen() && !header.contains(event.target)) setMenu(false);
    });
    compactNav.addEventListener("change", () => {
      const focusWasInNav = nav.contains(document.activeElement);
      const focusWasOnMenu = document.activeElement === menu;
      setMenu(false);
      if (compactNav.matches && focusWasInNav) menu.focus();
      else if (!compactNav.matches && focusWasOnMenu)
        nav.querySelector("a").focus();
      measureHeader();
    });
    window.addEventListener("pageshow", () => setMenu(false));
    const updateCurrentLink = () => {
      const current = location.pathname.split("/").pop() || "index.html";
      nav.querySelectorAll("a").forEach((link) => {
        const target = new URL(link.href);
        const active =
          target.origin === location.origin &&
          target.pathname.split("/").pop() === current &&
          target.hash === location.hash;
        if (active)
          link.setAttribute("aria-current", target.hash ? "location" : "page");
        else link.removeAttribute("aria-current");
      });
    };
    window.addEventListener("hashchange", updateCurrentLink);
    updateCurrentLink();
    setMenu(false);
    measureHeader();
  }
  const slides = [...document.querySelectorAll(".slide")];
  const dots = document.getElementById("dots");
  let index = 0;
  if (dots && slides.length) {
    function go(n) {
      index = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        s.classList.toggle("active", k === index);
        s.setAttribute("aria-hidden", String(k !== index));
      });
      [...dots.children].forEach((d, k) => {
        d.classList.toggle("on", k === index);
        d.setAttribute("aria-pressed", String(k === index));
      });
    }
    slides.forEach((_, n) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Show review " + (n + 1));
      b.addEventListener("click", () => go(n));
      dots.appendChild(b);
    });
    document
      .querySelector(".prev")
      .addEventListener("click", () => go(index - 1));
    document
      .querySelector(".next")
      .addEventListener("click", () => go(index + 1));
    go(0);
  }
  document.querySelector(".form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    e.currentTarget.querySelector(".form-status").textContent =
      "Your demo enquiry is ready. No message has been sent; this preview is not connected to an inbox.";
  });
})();

// Play the silent background film unless the visitor prefers reduced motion.
(() => {
  const film = document.getElementById("hero-film");
  if (!film) return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const syncPlayback = () => {
    if (motion.matches || document.hidden) film.pause();
    else film.play().catch(() => {});
  };
  motion.addEventListener("change", syncPlayback);
  document.addEventListener("visibilitychange", syncPlayback);
  syncPlayback();
})();
