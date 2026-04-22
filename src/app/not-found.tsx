import Link from "next/link";

import { ContactPanel } from "@/components/site/contact-panel";
import { PortfolioShell } from "@/components/site/portfolio-shell";

export default function NotFound() {
  return (
    <PortfolioShell>
      <section className="pt-4">
        <div className="surface-panel surface-panel-grid px-8 py-8 md:px-10 md:py-10">
          <p className="section-kicker">404</p>
          <h1 className="section-title mt-4 text-slate-50 md:text-5xl">
            That project page does not exist.
          </h1>
          <p className="section-copy mt-5 max-w-2xl text-lg">
            The route does not match any project in the portfolio data source.
          </p>
          <Link className="action-pill mt-8" href="/">
            Return home
          </Link>
        </div>
      </section>

      <ContactPanel />
    </PortfolioShell>
  );
}
