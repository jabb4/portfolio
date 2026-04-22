type ProjectLinkItemProps = {
  href: string;
  label: string;
  className?: string;
  mutedClassName?: string;
};

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.09 3.3 9.41 7.88 10.94.58.1.79-.25.79-.56v-2.17c-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.71.08-.69.08-.69 1.16.08 1.77 1.19 1.77 1.19 1.02 1.77 2.69 1.26 3.35.96.1-.75.4-1.26.72-1.55-2.55-.29-5.23-1.29-5.23-5.74 0-1.27.45-2.31 1.18-3.13-.12-.29-.51-1.48.11-3.08 0 0 .97-.31 3.18 1.19a11.07 11.07 0 0 1 5.79 0c2.21-1.5 3.18-1.19 3.18-1.19.62 1.6.23 2.79.11 3.08.73.82 1.18 1.86 1.18 3.13 0 4.46-2.69 5.45-5.26 5.73.41.36.77 1.07.77 2.16v3.2c0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.66 18.35.5 12 .5Z" />
    </svg>
  );
}

export function ProjectLinkItem({
  href,
  label,
  className,
  mutedClassName,
}: ProjectLinkItemProps) {
  const hasGitHubIcon = label === "Repository";
  const content = (
    <>
      {hasGitHubIcon ? <GitHubIcon /> : null}
      <span>{label}</span>
    </>
  );

  if (!href) {
    return (
      <span
        className={
          mutedClassName ??
          "action-pill-muted cursor-default gap-2 text-slate-500 hover:translate-y-0"
        }
      >
        {content}
      </span>
    );
  }

  const isExternal = /^https?:\/\//.test(href);

  return (
    <a
      className={className ?? "action-pill gap-2"}
      href={href}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {content}
    </a>
  );
}
