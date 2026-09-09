export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#6D29FF] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex items-center justify-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white">
          <span className="text-[17px] font-extrabold leading-none tracking-[-1px] text-[#6D29FF]">BP</span>
        </div>
        <span className="text-xl font-extrabold tracking-[-0.3px] text-white">BenefitPath</span>
      </div>
    </header>
  )
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-1.5 bg-[#E5E2F0]">
      <div className="progress-fill h-full bg-[#6128DB]" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

export function Footer() {
  return (
    <footer className="px-5 py-4 text-center">
      <a href="/terms" className="text-sm text-[#666] underline">
        Terms
      </a>
      <span className="mx-2 text-sm text-[#999]">·</span>
      <a href="/privacy" className="text-sm text-[#666] underline">
        Privacy policy
      </a>
    </footer>
  )
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6b7280]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back
    </button>
  )
}

export function Disclaimer() {
  return (
    <p className="max-w-lg text-xs leading-relaxed text-[#A3A3A3]">
      Disclaimer BenefitPath is a private demo used for a take-home assignment. It is not affiliated with, endorsed by,
      or associated with the U.S. government or the Social Security Administration (SSA). Information is for general
      demonstration only and is not legal advice. Maximum possible benefit figures follow published SSA examples and
      vary by individual.
    </p>
  )
}

export function SsaNote() {
  return (
    <p className="px-5 text-center text-[11px] text-[#A3A3A3] italic">
      *Maximum possible benefit per{' '}
      <a
        href="https://www.ssa.gov/news/en/cola/factsheets/2026.html"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        SSA
      </a>
      . Individual amounts vary.
    </p>
  )
}
