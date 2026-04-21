import Link from "next/link";

import { ContactPanel } from "@/components/site/contact-panel";
import { PortfolioShell } from "@/components/site/portfolio-shell";

export default function NotFound() {
  return (
    <PortfolioShell>
      <section className="pt-4">
        <div className="rounded-[1.75rem] border border-white/10 bg-[rgba(16,18,26,0.92)] p-8 shadow-[0_18px_48px_rgba(0,0,0,0.35)]">
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-sky-300">404</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-slate-50 md:text-5xl">
            That project page does not exist.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            The route does not match any project in the portfolio data source.
          </p>
          <Link
            className="mt-8 inline-flex min-h-11 items-center rounded-full border border-white/10 bg-slate-900/80 px-4 text-sm text-slate-100 transition hover:border-sky-300/35 hover:bg-slate-900"
            href="/"
          >
            Return home
          </Link>
        </div>
      </section>

      <ContactPanel />
    </PortfolioShell>
  );
}
