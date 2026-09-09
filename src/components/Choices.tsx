type Props = {
  yesLabel?: string
  noLabel?: string
  selected?: string | null
  onSelect: (value: string) => void
}

export function YesNo({ yesLabel = 'YES', noLabel = 'NO', selected, onSelect }: Props) {
  return (
    <div className="mb-6 flex w-full max-w-[480px] gap-4">
      <ChoiceCard label={yesLabel} value="Yes" kind="yes" selected={selected === 'Yes'} onSelect={onSelect} />
      <ChoiceCard label={noLabel} value="No" kind="no" selected={selected === 'No'} onSelect={onSelect} />
    </div>
  )
}

function ChoiceCard({
  label,
  value,
  kind,
  selected,
  onSelect,
}: {
  label: string
  value: string
  kind: 'yes' | 'no'
  selected: boolean
  onSelect: (value: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex h-[190px] flex-1 flex-col overflow-hidden rounded-xl border-0 p-0 ${selected ? 'animate-btn-pop' : ''}`}
    >
      <div className="grid flex-[0_0_60%] place-items-center bg-[#DEDEDE]">
        {kind === 'yes' ? (
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path d="M4 12.5l5.5 5.5L20 7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="grid flex-1 place-items-center bg-[#6D29FF]">
        <span className="text-[28px] font-bold uppercase tracking-[0.5px] text-white">{label}</span>
      </div>
    </button>
  )
}

export function OptionList({
  options,
  selected,
  onSelect,
}: {
  options: { label: string; value: string }[]
  selected?: string | null
  onSelect: (value: string) => void
}) {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={`rounded-lg border-0 bg-[#6128DB] text-left text-white ${selected === option.value ? 'animate-btn-pop' : ''}`}
        >
          <div className="px-5 py-4 text-left text-[22px] font-bold leading-snug sm:text-[28px]">{option.label}</div>
        </button>
      ))}
    </div>
  )
}
