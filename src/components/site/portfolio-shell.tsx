import type { ReactNode } from "react";

import { SiteHeader } from "./site-header";

type PortfolioShellProps = {
  children: ReactNode;
  currentSlug?: string;
  wide?: boolean;
};

export function PortfolioShell({
  children,
  currentSlug,
  wide = false,
}: PortfolioShellProps) {
  return (
    <div className={`mx-auto w-full px-3 pb-12 md:px-4 ${wide ? "max-w-[1320px]" : "max-w-[1080px]"}`}>
      <SiteHeader currentSlug={currentSlug} />
      <main className={wide ? "pt-10 md:pt-12" : "pt-14"}>{children}</main>
    </div>
  );
}
