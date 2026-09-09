import { useState } from 'react'
import { BackButton, Footer, Header } from '../components/Chrome'
import { OptionList, YesNo } from '../components/Choices'
import type { QuestionStep } from '../funnel/questions'

type Props = {
  step: QuestionStep
  onSelect: (value: string) => void
  onBack: () => void
}

export function Question({ step, onSelect, onBack }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const binary = step.options.length === 2 && step.options[0]?.value === 'Yes' && step.options[1]?.value === 'No'

  function choose(value: string) {
    setSelected(value)
    window.setTimeout(() => onSelect(value), 240)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f4f1]">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-4 pb-8">
        <BackButton onClick={onBack} />
        <div className="animate-fade-up flex flex-col items-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#6D29FF]">{step.shortLabel}</p>
          <h2
            className="mb-3 max-w-2xl text-center text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#111] sm:text-[40px]"
          >
            {step.question}
          </h2>
          {step.hint ? <p className="mb-8 max-w-xl text-center text-base font-normal text-[#6b7280]">{step.hint}</p> : <div className="mb-8" />}
          {binary ? (
            <YesNo selected={selected} onSelect={choose} />
          ) : (
            <OptionList options={step.options} selected={selected} onSelect={choose} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
