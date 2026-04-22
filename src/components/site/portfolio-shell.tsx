import type { ReactNode } from "react";

import { SiteHeader } from "./site-header";

type PortfolioShellProps = {
  children: ReactNode;
  currentSlug?: string;
};

export function PortfolioShell({ children, currentSlug }: PortfolioShellProps) {
  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 pb-14 md:px-5 lg:px-6">
      <SiteHeader currentSlug={currentSlug} />
      <main className="pt-10 md:pt-12">{children}</main>
    </div>
  );
}
