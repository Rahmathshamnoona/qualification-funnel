import { useState } from 'react'
import { Disclaimer, Footer, Header, SsaNote } from '../components/Chrome'
import { YesNo } from '../components/Choices'

type Props = {
  onAnswer: (value: 'yes' | 'no') => void
}

export function Landing({ onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function choose(value: string) {
    const mapped = value === 'Yes' ? 'yes' : 'no'
    setSelected(value)
    window.setTimeout(() => onAnswer(mapped), 240)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f4f1]">
      <Header />
      <main className="flex flex-1 flex-col items-center px-8 pt-7 pb-6">
        <div className="animate-fade-up flex w-full max-w-lg flex-col items-center">
          <h1 className="mb-5 max-w-lg text-center text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#333]">
            Over 50 and Unemployed?
          </h1>
          <p className="max-w-lg text-center text-[19px] font-light text-[#111]">
            You may be eligible for up to <strong className="font-extrabold">$4,152 every month</strong> in disability
            benefits
          </p>
          <p className="mt-3 mb-5 text-center text-[19px] font-light text-[#111]">Answer below to see if you qualify</p>
          <h2 className="mb-8 text-center text-[22px] font-medium leading-[1.15] text-[#111]">
            Are You 40 Years or Older?
          </h2>
          <YesNo selected={selected} onSelect={choose} yesLabel="YES" noLabel="NO" />
          <div className="flex-1" />
          <div className="w-full max-w-lg pt-16">
            <Disclaimer />
          </div>
        </div>
      </main>
      <SsaNote />
      <Footer />
    </div>
  )
}
