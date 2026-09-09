import { useState, type FormEvent } from 'react'
import { Header } from '../components/Chrome'
import { formatPhone, isValidPhone, isValidZip, TCPA_TEXT } from '../lib/api'

type Props = {
  initial: { firstName?: string; lastName?: string; phone?: string; zip?: string }
  onSubmit: (data: { firstName: string; lastName: string; phone: string; zip: string }) => void
}

export function Contact({ initial, onSubmit }: Props) {
  const [firstName, setFirstName] = useState(initial.firstName ?? '')
  const [lastName, setLastName] = useState(initial.lastName ?? '')
  const [phone, setPhone] = useState(initial.phone ? formatPhone(initial.phone) : '')
  const [zip, setZip] = useState(initial.zip ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const next: Record<string, string> = {}
    if (!firstName.trim()) next.firstName = 'Required'
    if (!lastName.trim()) next.lastName = 'Required'
    if (!isValidPhone(phone)) next.phone = 'Enter a valid mobile number'
    if (!isValidZip(zip)) next.zip = 'Enter a 5-digit ZIP'
    return next
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone,
      zip: zip.trim(),
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="mx-auto w-full max-w-[500px] flex-1 px-5 pt-7 pb-8">
        <h2 className="mb-7 text-center text-[28px] font-extrabold leading-[1.25] text-[#111]">
          Final step: Enter your contact info to see how much you qualify for
        </h2>
        <form className="flex flex-col gap-3.5" onSubmit={submit}>
          <Field
            icon="person"
            placeholder="Your first name"
            autoComplete="given-name"
            value={firstName}
            error={errors.firstName}
            onChange={setFirstName}
          />
          <Field
            icon="person"
            placeholder="Your last name"
            autoComplete="family-name"
            value={lastName}
            error={errors.lastName}
            onChange={setLastName}
          />
          <div>
            <div className={`flex items-center overflow-hidden rounded-[14px] border-[1.5px] bg-white ${errors.phone ? 'border-[#dc2626]' : 'border-[#E0E0E0]'}`}>
              <div className="flex shrink-0 items-center gap-1 border-r-[1.5px] border-[#E0E0E0] px-3.5 py-0">
                <span className="text-xl">🇺🇸</span>
              </div>
              <input
                type="tel"
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Your mobile number"
                value={phone}
                onChange={(event) => {
                  setPhone(formatPhone(event.target.value))
                  setErrors((current) => ({ ...current, phone: '' }))
                }}
                className="min-w-0 flex-1 border-0 bg-transparent px-3.5 py-[18px] text-[17px] text-[#1a1a1a] outline-none"
              />
            </div>
            {errors.phone ? <p className="mt-1 ml-1 text-xs text-[#dc2626]">{errors.phone}</p> : <p className="mt-1 ml-1 text-xs text-[#6B7280]">We'll send updates about your application to this number.</p>}
          </div>
          <Field
            icon="pin"
            placeholder="ZIP code"
            autoComplete="postal-code"
            inputMode="numeric"
            value={zip}
            error={errors.zip}
            onChange={(value) => setZip(value.replace(/\D/g, '').slice(0, 5))}
          />
          <button
            type="submit"
            className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#6128DB] py-5 text-[20px] font-extrabold text-white active:scale-95"
          >
            See What I Am Eligible For
          </button>
        </form>
        <p className="mt-4 text-center text-[10px] leading-relaxed text-[#aaa]">{TCPA_TEXT}</p>
      </main>
    </div>
  )
}

function Field({
  icon,
  placeholder,
  value,
  error,
  onChange,
  autoComplete,
  inputMode,
}: {
  icon: 'person' | 'pin'
  placeholder: string
  value: string
  error?: string
  onChange: (value: string) => void
  autoComplete?: string
  inputMode?: 'numeric'
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9CA3AF]">
        {icon === 'person' ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s7-5.4 7-11a7 7 0 10-14 0c0 5.6 7 11 7 11z" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        )}
      </div>
      <input
        className={`w-full rounded-[14px] border-[1.5px] bg-white py-[18px] pr-4 pl-12 text-[17px] text-[#1a1a1a] outline-none ${error ? 'border-[#dc2626]' : 'border-[#E0E0E0] focus:border-[#6128DB]'}`}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <p className="mt-1 ml-1 text-xs text-[#dc2626]">{error}</p> : null}
    </div>
  )
}
