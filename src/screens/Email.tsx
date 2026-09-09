import { useState, type FormEvent } from 'react'
import { Footer, Header, SsaNote } from '../components/Chrome'
import { isValidEmail } from '../lib/api'

type Props = {
  initialEmail?: string
  onSubmit: (email: string) => void
}

export function EmailCapture({ initialEmail = '', onSubmit }: Props) {
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(false)

  function submit(event?: FormEvent) {
    event?.preventDefault()
    const value = email.trim().toLowerCase()
    if (!value) {
      setError('This is a required field')
      return
    }
    if (!isValidEmail(value)) {
      setError('Please enter a valid email address')
      return
    }
    onSubmit(value)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f4f1]">
      <Header />
      <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-5 pt-7 pb-28">
        <div className="animate-fade-up">
          <h2 className="mb-2.5 text-center text-[26px] font-extrabold leading-[1.25] text-[#111]">
            You're Pre-Qualified for Up to $4,152/Month!
          </h2>
          <p className="mb-7 text-center text-base font-medium text-[#555]">Enter your email to get your results now!</p>
          <p className="mb-3.5 text-center text-[19px] font-extrabold text-[#111]">Where should we send them?</p>
          <form onSubmit={submit}>
            <div className="relative mb-3.5">
              <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={focused ? 'text-[#6D29FF]' : 'text-[#C5C5C5]'}>
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="Your email address"
                value={email}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                }}
                className="w-full rounded-[14px] border-2 bg-white py-[18px] pr-[18px] pl-12 text-[17px] text-[#111] outline-none"
                style={{
                  borderColor: error ? '#dc2626' : focused ? '#6D29FF' : '#e5e7eb',
                  boxShadow: focused ? '0 0 0 4px rgba(91,53,212,0.1)' : 'none',
                }}
              />
              {error ? <p className="mt-1.5 text-[13px] text-[#dc2626]">{error}</p> : null}
            </div>
            <button
              type="submit"
              className="flex h-16 w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#6D29FF] text-[19px] font-extrabold text-white shadow-[0_6px_28px_rgba(91,53,212,0.32)] active:scale-[0.975]"
            >
              Send My Results
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
          <p className="mt-3.5 text-center text-xs text-[#999] italic">*California ZIP codes are stored but not routed to partners.</p>
        </div>
      </main>
      <SsaNote />
      <Footer />
    </div>
  )
}
