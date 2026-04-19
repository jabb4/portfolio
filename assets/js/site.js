(function () {
  const content = window.portfolioContent;

  if (!content) {
    return;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const element = byId(id);

    if (element) {
      element.textContent = value;
    }
  }

  function setMetaDescription(value) {
    const meta = document.querySelector('meta[name="description"]');

    if (meta) {
      meta.setAttribute("content", value);
    }
  }

  function projectHref(basePath, slug) {
    return `${basePath}${slug}/`;
  }

  function linkMarkup(link, className) {
    if (!link.href) {
      return `<span class="project-link-muted" aria-disabled="true">${link.label}</span>`;
    }

    const isExternal = /^https?:\/\//.test(link.href);
    const target = isExternal ? ' target="_blank" rel="noreferrer"' : "";

    return `<a class="${className}" href="${link.href}"${target}>${link.label}</a>`;
  }

  function renderNavigation(homeHref, projectBasePath, currentSlug) {
    const brand = byId("brand-link");
    const projectNav = byId("project-nav");

    if (brand) {
      brand.href = homeHref;
      brand.textContent = content.profile.name;
    }

    if (!projectNav) {
      return;
    }

    projectNav.innerHTML = `
      <div class="project-dropdown">
        <button
          class="project-dropdown-button"
          type="button"
          aria-expanded="false"
          aria-haspopup="true"
          aria-controls="project-dropdown-menu"
        >
          Projects
        </button>
        <div class="project-dropdown-menu" id="project-dropdown-menu" hidden>
          ${content.projects
            .map((project) => {
              const activeClass = project.slug === currentSlug ? "is-active" : "";
              const currentPage =
                project.slug === currentSlug ? ' aria-current="page"' : "";

              return `<a class="${activeClass}" href="${projectHref(
                projectBasePath,
                project.slug
              )}"${currentPage}>${project.title}</a>`;
            })
            .join("")}
        </div>
      </div>
    `;

    setupProjectDropdown(projectNav.querySelector(".project-dropdown"));
  }

  function setupProjectDropdown(dropdown) {
    if (!dropdown || dropdown.dataset.bound === "true") {
      return;
    }

    const button = dropdown.querySelector(".project-dropdown-button");
    const menu = dropdown.querySelector(".project-dropdown-menu");
    const links = Array.from(dropdown.querySelectorAll(".project-dropdown-menu a"));

    dropdown.dataset.bound = "true";

    const setOpen = (open) => {
      dropdown.classList.toggle("is-open", open);

      if (button) {
        button.setAttribute("aria-expanded", String(open));
      }

      if (menu) {
        menu.hidden = !open;
      }
    };

    const isOpen = () => dropdown.classList.contains("is-open");

    const focusLink = (index) => {
      if (!links.length) {
        return;
      }

      const nextIndex = (index + links.length) % links.length;
      links[nextIndex].focus();
    };

    const dropFocus = () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };

    const closeDropdown = () => {
      setOpen(false);
    };

    setOpen(false);

    button?.addEventListener("click", () => {
      setOpen(!isOpen());
    });

    button?.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        event.preventDefault();
        closeDropdown();
        dropFocus();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setOpen(true);
        focusLink(0);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setOpen(true);
        focusLink(links.length - 1);
      }
    });

    menu?.addEventListener("keydown", (event) => {
      const currentIndex = links.indexOf(document.activeElement);

      if (event.key === "Escape") {
        event.preventDefault();
        closeDropdown();
        dropFocus();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusLink(currentIndex + 1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        focusLink(currentIndex - 1);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        focusLink(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        focusLink(links.length - 1);
      }
    });

    document.addEventListener("pointerdown", (event) => {
      if (!isOpen() || dropdown.contains(event.target)) {
        return;
      }

      closeDropdown();
    });

    dropdown.addEventListener("focusout", (event) => {
      if (dropdown.contains(event.relatedTarget)) {
        return;
      }

      window.setTimeout(() => {
        if (!dropdown.contains(document.activeElement)) {
          closeDropdown();
        }
      }, 0);
    });

    links.forEach((link) => {
      link.addEventListener("click", closeDropdown);
    });
  }

  function renderContact() {
    const { profile } = content;
    const contactLinks = byId("contact-links");

    setText("contact-title", profile.contactTitle);
    setText("contact-copy", profile.contactCopy);

    if (!contactLinks) {
      return;
    }

    contactLinks.innerHTML = [
      {
        label: "Email",
        href: `mailto:${profile.email}`,
      },
      {
        label: "GitHub",
        href: profile.github,
      },
      {
        label: "LinkedIn",
        href: profile.linkedin,
      },
    ]
      .map((link) => linkMarkup(link, "contact-link"))
      .join("");
  }

  function projectCardMarkup(project, projectBasePath) {
    const href = projectHref(projectBasePath, project.slug);

    return `
      <a class="project-card" data-interactive-card href="${href}">
        <div class="project-card-topline">
          <div class="project-title-link">${project.title}</div>
          <span class="project-year">${project.year}</span>
        </div>
        <p class="project-summary">${project.summary}</p>
        <div class="tag-list">
          ${project.stack.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </a>
    `;
  }

  function setupInteractiveCards() {
    const cards = document.querySelectorAll("[data-interactive-card]");

    cards.forEach((card) => {
      const resetCard = () => {
        card.style.setProperty("--card-rotate-x", "0deg");
        card.style.setProperty("--card-rotate-y", "0deg");
      };

      resetCard();

      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const percentX = (x / bounds.width) * 100;
        const percentY = (y / bounds.height) * 100;
        const rotateY = ((percentX - 50) / 50) * 4;
        const rotateX = ((50 - percentY) / 50) * 4;

        card.style.setProperty("--card-rotate-x", `${rotateX}deg`);
        card.style.setProperty("--card-rotate-y", `${rotateY}deg`);
      });

      card.addEventListener("pointerleave", resetCard);
      card.addEventListener("blur", resetCard);
      card.addEventListener("focus", resetCard);
    });
  }

  function renderHomePage() {
    const featuredProjects = byId("featured-projects");
    const profileImage = byId("profile-image");
    const featured = content.projects.filter((project) => project.featured).slice(0, 3);

    document.title = `${content.profile.name} | Portfolio`;
    setMetaDescription(content.profile.introCopy);
    setText("intro-code", content.profile.helloLine);
    setText("intro-title", content.profile.introTitle);
    setText("intro-copy", content.profile.introCopy);

    if (profileImage) {
      profileImage.src = content.profile.profileImage;
      profileImage.alt = content.profile.profileImageAlt || content.profile.name;
    }

    if (featuredProjects) {
      featuredProjects.innerHTML = featured
        .map((project) => projectCardMarkup(project, "projects/"))
        .join("");

      setupInteractiveCards();
    }
  }

  function renderProjectPage() {
    const slug = document.body.dataset.projectSlug;
    const project = content.projects.find((entry) => entry.slug === slug);
    const sections = byId("project-sections");
    const highlights = byId("project-highlights");
    const stack = byId("project-stack");
    const links = byId("project-links");
    const backLink = byId("back-link");

    if (!project) {
      document.title = `${content.profile.name} | Portfolio`;
      setText("project-title", "Project not found");
      setText(
        "project-summary",
        "This project page does not match any project entry in assets/js/content.js."
      );
      return;
    }

    document.title = `${project.title} | ${content.profile.name}`;
    setMetaDescription(project.summary);
    setText("project-label", project.label);
    setText("project-title", project.title);
    setText("project-year", project.year);
    setText("project-summary", project.summary);

    if (backLink) {
      backLink.href = "../../#projects";
    }

    if (stack) {
      stack.innerHTML = project.stack.map((item) => `<span class="tag">${item}</span>`).join("");
    }

    if (links) {
      links.innerHTML = project.links
        .map((link) => linkMarkup(link, "contact-link"))
        .join("");
    }

    if (sections) {
      sections.innerHTML = project.sections
        .map(
          (section) => `
            <article class="detail-card">
              <h3>${section.title}</h3>
              <p>${section.text}</p>
            </article>
          `
        )
        .join("");
    }

    if (highlights) {
      highlights.innerHTML = project.highlights.map((item) => `<li>${item}</li>`).join("");
    }
  }

  function renderSite() {
    const page = document.body.dataset.page;

    if (page === "project") {
      renderNavigation("../../", "../", document.body.dataset.projectSlug || "");
      renderContact();
      renderProjectPage();
      return;
    }

    renderNavigation("./", "projects/", "");
    renderContact();
    renderHomePage();
  }

  renderSite();
})();
