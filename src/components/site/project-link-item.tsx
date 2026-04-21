type ProjectLinkItemProps = {
  href: string;
  label: string;
  className?: string;
  mutedClassName?: string;
};

export function ProjectLinkItem({
  href,
  label,
  className,
  mutedClassName,
}: ProjectLinkItemProps) {
  if (!href) {
    return (
      <span
        className={
          mutedClassName ??
          "inline-flex min-h-11 items-center rounded-full border border-white/8 bg-white/5 px-4 text-sm text-slate-500"
        }
      >
        {label}
      </span>
    );
  }

  const isExternal = /^https?:\/\//.test(href);

  return (
    <a
      className={
        className ??
        "inline-flex min-h-11 items-center rounded-full border border-white/10 bg-slate-900/80 px-4 text-sm text-slate-100 transition hover:-translate-y-0.5 hover:border-sky-300/35 hover:bg-slate-900"
      }
      href={href}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {label}
    </a>
  );
}
