import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-bordeaux text-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-head text-xl md:text-2xl font-bold text-white leading-tight">
              Afwegingstool Bouwtransport over Water
            </h1>
            <p className="text-cream/90 text-sm italic mt-0.5">
              Beslis onderbouwd over modal shift bij watergebonden RED-projecten
            </p>
          </div>
          <div className="hidden md:block text-right text-xs text-cream/80">
            <div className="font-semibold tracking-wider">RED COMPANY</div>
            <div>Versie 1.0 (MVP)</div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-cream-light bg-cream-light/50 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-4 text-xs text-slate-body flex flex-wrap justify-between gap-2">
          <span>
            © RED Company · Tool gebaseerd op Excel-afwegingskader v4
          </span>
          <span>
            Bronnen: TNO 2023 · Logistic Navigators 2024 · Verlinde et al. 2022
          </span>
        </div>
      </footer>
    </div>
  );
}
