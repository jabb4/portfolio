export type ProjectTemplateId = "home-server";

export type ProjectSection = {
  title: string;
  text: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  introTitle: string;
  introCopy: string;
  profileImage: string;
  profileImageAlt: string;
  email: string;
  github: string;
  linkedin: string;
  contactTitle: string;
  contactCopy: string;
};

export type Project = {
  slug: string;
  title: string;
  label: string;
  year: string;
  featured: boolean;
  summary: string;
  stack: string[];
  heroTags?: string[];
  sections: ProjectSection[];
  highlights: string[];
  links: ProjectLink[];
  customTemplate?: ProjectTemplateId;
};

export type HomeServerFact = {
  label: string;
  value: string;
};

export type HomeServerDevice = {
  id: string;
  title: string;
  role: string;
  summary: string;
  facts: HomeServerFact[];
  services: string[];
};

export type HomeServerContent = {
  heading: string;
  intro: string;
  fallbackMessage: string;
  deviceOrder: string[];
  devicesById: Record<string, HomeServerDevice>;
};

export type PortfolioContent = {
  profile: Profile;
  projects: Project[];
  homeServer: HomeServerContent;
};

export const portfolio: PortfolioContent = {
  profile: {
    name: "Jacob Bengtsson",
    introTitle: "I'm Jacob, and this is where I keep the projects I'm proud of.",
    introCopy:
      "I enjoy being creative and building new things that are fun. I'm driven by finding solutions to real-life problems.",
    profileImage: "/images/profile-pic.png",
    profileImageAlt: "Portrait of Jacob Bengtsson",
    email: "hello@yourdomain.com",
    github: "https://github.com/yourusername",
    linkedin: "https://www.linkedin.com/in/yourname/",
    contactTitle: "Let's talk.",
    contactCopy:
      "I'm always interested in new challenges, so if you have an idea and find my work interesting, I'd be glad to talk.",
  },
  projects: [
    {
      slug: "home-server",
      title: "Home Lab",
      label: "Self-Hosted Infrastructure",
      year: "Ongoing",
      featured: true,
      customTemplate: "home-server",
      summary:
        "A self-built 12U home lab with Proxmox, a Talos Kubernetes cluster, dedicated Raspberry Pi utility nodes, UPS protection, and segmented networking.",
      stack: ["Proxmox", "Talos", "Kubernetes", "Raspberry Pi"],
      heroTags: [
        "Proxmox",
        "Kubernetes",
        "Linux",
        "DNS",
        "Docker",
        "Self-Hosting",
        "Networking",
      ],
      sections: [
        {
          title: "Overview",
          text:
            "A real home lab built around a 4U Proxmox host, dedicated Raspberry Pi utility nodes, UPS protection, and a router-managed internal network.",
        },
        {
          title: "Focus",
          text:
            "The focus is on reliability, self-hosting, observability, and keeping infrastructure understandable enough to operate confidently.",
        },
        {
          title: "Value",
          text:
            "It acts as both a production playground for real services and a long-term systems engineering project.",
        },
      ],
      highlights: [
        "4U Proxmox host with dedicated workload separation.",
        "Rack-mounted supporting Raspberry Pi infrastructure for DNS and UPS control.",
        "Detailed service layout documented in a public infrastructure repository.",
      ],
      links: [
        { label: "Repository", href: "https://github.com/jabb4/home-server" },
        {
          label: "Architecture",
          href: "https://github.com/jabb4/home-server#readme",
        },
      ],
    },
    {
      slug: "temp2",
      title: "Temp2",
      label: "Placeholder",
      year: "TBD",
      featured: true,
      summary:
        "Temporary placeholder project. Replace this with your second real project.",
      stack: ["Placeholder", "TBD"],
      sections: [
        {
          title: "Overview",
          text:
            "This page is here so the project dropdown and route structure stay in place while you build out real content.",
        },
        {
          title: "Focus",
          text:
            "Use this area to describe what the project needed to achieve and what constraints shaped it.",
        },
        {
          title: "Value",
          text:
            "Once you have a real project ready, replace this text with the outcome and why it mattered.",
        },
      ],
      highlights: [
        "Temporary highlight one.",
        "Temporary highlight two.",
        "Temporary highlight three.",
      ],
      links: [
        { label: "Repository", href: "" },
        { label: "Live Demo", href: "" },
      ],
    },
    {
      slug: "temp3",
      title: "Temp3",
      label: "Placeholder",
      year: "TBD",
      featured: true,
      summary:
        "Temporary placeholder project. Replace this with your third real project.",
      stack: ["Placeholder", "TBD"],
      sections: [
        {
          title: "Overview",
          text:
            "This placeholder keeps the project page format ready while you decide what to feature here.",
        },
        {
          title: "Focus",
          text:
            "Use this section later to explain your role, the technical choices, and the user impact.",
        },
        {
          title: "Value",
          text:
            "When you are ready, replace this text with the results and what makes the project worth showing.",
        },
      ],
      highlights: [
        "Temporary highlight one.",
        "Temporary highlight two.",
        "Temporary highlight three.",
      ],
      links: [
        { label: "Repository", href: "" },
        { label: "Live Demo", href: "" },
      ],
    },
  ],
  homeServer: {
    heading: "Server rack",
    intro: "Hover or select hardware in the rack to inspect how the lab is assembled.",
    fallbackMessage: "3D preview unavailable. Use the device list to inspect the rack.",
    deviceOrder: ["stratton", "router", "rocky", "nut", "ups"],
    devicesById: {
      stratton: {
        id: "stratton",
        title: "Server",
        role: "Primary compute and service host",
        summary:
          "The server is the core of the rack: a 4U Proxmox host that runs the Talos Kubernetes nodes plus the remaining legacy VMs for storage, apps, Home Assistant, and edge services.",
        facts: [
          { label: "Hardware", value: "Custom build server PC" },
          { label: "Host OS", value: "Proxmox" },
        ],
        services: [
          "Home Assistant",
          "TrueNAS",
          "Grafana",
          "Prometheus",
          "Traefik",
          "Authentik",
          "Uptime Kuma",
          "Jellyfin",
          "Immich",
          "Paperless-ngx",
        ],
      },
      rocky: {
        id: "rocky",
        title: "DNS",
        role: "DNS filtering and resolution",
        summary:
          "DNS handles local name resolution for the rack and gives the lab a dedicated Raspberry Pi service node for filtering and resolution on the services network.",
        facts: [
          { label: "Hardware", value: "Raspberry Pi 5" },
          { label: "Host OS", value: "DietPi" },
        ],
        services: ["Pi-hole"],
      },
      nut: {
        id: "nut",
        title: "UPS Management",
        role: "Power monitoring and safe shutdown orchestration",
        summary:
          "UPS Management keeps the UPS integration independent from the main host, which lets the rack handle graceful shutdown flows without tying them directly to the server.",
        facts: [
          { label: "Hardware", value: "Raspberry Pi 3B+" },
          { label: "Host OS", value: "DietPi" },
        ],
        services: ["NUT"],
      },
      router: {
        id: "router",
        title: "Router",
        role: "Rack edge routing and network segmentation",
        summary:
          "The router is the rack's network boundary. It ties together the default LAN, management, services, and legacy VM networks and is the best place to understand how the lab is segmented.",
        facts: [
          { label: "Hardware", value: "UniFi Dream Machine SE" },
          { label: "Host OS", value: "UniFi OS" },
        ],
        services: ["Firewall", "Routing"],
      },
      ups: {
        id: "ups",
        title: "UPS",
        role: "Battery-backed power and shutdown safety net",
        summary:
          "The UPS anchors the bottom of the rack and protects the rest of the system against abrupt power loss. It is paired with UPS Management for graceful shutdown behavior.",
        facts: [
          { label: "Hardware", value: "PowerWalker VI 2000 RLP" },
          { label: "Host OS", value: "None" },
        ],
        services: [],
      },
    },
  },
};

export const featuredProjects = portfolio.projects.filter((project) => project.featured).slice(0, 3);

export function getProjectBySlug(slug: string) {
  return portfolio.projects.find((project) => project.slug === slug);
}
