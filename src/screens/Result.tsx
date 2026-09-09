import { Header, SsaNote } from '../components/Chrome'
import { MAX_SSA_BENEFIT } from '../funnel/score'

type Props = {
  firstName?: string
  estimatedMonthly: number
  grade: string
  qualified: boolean
  matchQuality?: number
}

export function Result({ firstName, estimatedMonthly, grade, qualified, matchQuality }: Props) {
  if (!qualified) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f5f4f1]">
        <Header />
        <main className="mx-auto max-w-sm flex-1 px-5 pt-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f3f4f6]">
            <svg className="h-10 w-10 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-2 text-3xl font-bold">Thank You for Your Time</h2>
          <p className="mb-6 text-[#6b7280]">
            Since you already have legal representation, we're unable to assist with your case at this time.
          </p>
          <p className="text-sm text-[#9ca3af]">If your situation changes, you can check eligibility again.</p>
        </main>
      </div>
    )
  }

  const amount = estimatedMonthly || MAX_SSA_BENEFIT

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-10">
      <Header />
      <div className="mx-auto max-w-[440px] px-4 pt-5">
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5ED] px-3.5 py-1 text-xs font-bold tracking-wide text-[#1B6B3A]">
            YOU PRE QUALIFY
          </div>
        </div>
        <p className="text-center text-xs font-medium text-[#555]">
          {firstName ? `${firstName}, you` : 'You'} pre-qualify for up to
        </p>
        <p className="mb-1 text-center text-[44px] font-extrabold leading-none text-[#1B6B3A]">
          ${amount.toLocaleString()}
          <span className="text-xl font-semibold opacity-70">/mo*</span>
        </p>
        <p className="mb-4 text-center text-xs text-[#555]">in Disability Benefits · Grade {grade}</p>

        <div className="mb-4 rounded-[18px] border-[2.5px] border-[#6D29FF] bg-[#F7F5F0] p-5 shadow-[0_4px_24px_rgba(109,41,255,0.10)]">
          <p className="mb-1.5 text-[13px] font-bold text-[#6D29FF]">You've done the hard part</p>
          <h1 className="mb-2.5 text-2xl font-extrabold leading-tight text-[#1A1A1A]">Last step: a quick 5-minute call.</h1>
          <p className="mb-3.5 text-sm leading-relaxed text-[#444]">
            A benefits specialist reviews the answers you already gave and explains your options. Free.
          </p>
          <a
            href="tel:8666756051"
            className="flex w-full items-center justify-center gap-3 rounded-[14px] bg-[#1D8348] px-4 py-4 text-white shadow-[0_6px_20px_rgba(29,131,72,0.4)]"
          >
            <span className="text-[17px] font-extrabold">Tap to Call</span>
            <span className="text-[13px] font-medium opacity-85">(866) 675-6051 · It's free</span>
          </a>
        </div>

        <div className="mb-4 flex justify-center gap-5 text-[11px] font-medium text-[#999]">
          <span>🔒 Confidential</span>
          <span>⏱ 5 min</span>
          <span>💰 $0 cost</span>
        </div>

        <div className="rounded-xl border border-[#E8E4DD] bg-white p-4 text-sm text-[#444]">
          <p className="mb-2 font-bold text-[#1A1A1A]">What happens next</p>
          <ol className="space-y-2">
            <li>1. We confirm the details you already entered</li>
            <li>2. A specialist checks benefit pathways</li>
            <li>3. You decide whether to file — no paperwork in this demo</li>
          </ol>
          {matchQuality != null ? (
            <p className="mt-3 text-xs text-[#6b7280]">Estimated Meta match quality for this conversion: {matchQuality}/10</p>
          ) : null}
        </div>
        <SsaNote />
      </div>
    </div>
  )
}
