export type LeadGrade = 'A' | 'B' | 'C'

export type Qualification = {
  grade: LeadGrade
  qualified: boolean
  disqualifyReason: string | null
  estimatedMonthly: number
}

const COMPETITOR_FIRMS = new Set([
  'Trajector Disability',
  'Premier Disability',
  'Citizens Disability',
  'Nyman Turkish PC',
  'Allsup',
  'Quikaid',
  'Kirkendall Dwyer LLP',
  'Newlin Disability',
])

export function scoreLead(answers: Record<string, string>): Qualification {
  const firm = answers.PPR_atty_firm
  if (firm && COMPETITOR_FIRMS.has(firm)) {
    return {
      grade: 'C',
      qualified: false,
      disqualifyReason: 'atty-disqual',
      estimatedMonthly: 0,
    }
  }

  let points = 0
  if (answers.PPR_receiving_ben === 'I am not receiving any disability benefits (SSD or SSI)') points += 2
  if (answers.PPR_question_6kdqgg === 'Not working') points += 3
  else if (answers.PPR_question_6kdqgg === '20 hours or less per week') points += 1
  if (answers.PPR_fiveyearwork === 'More than 6 years' || answers.PPR_fiveyearwork === 'Between 4 and 6 years') {
    points += 2
  }
  if (answers.PPR_outofwork === 'Yes') points += 3
  if (answers.PPR_visit === 'Yes') points += 2
  if (answers.PPR_pendingApl === 'No') points += 1
  if (answers.PPR_atty === 'No') points += 2

  const age = answers.PPR_optin_age
  if (age === '50-54' || age === '55-63') points += 3
  else if (age === '40-49' || age === '64 or older') points += 1
  else if (age === 'Under 40') points -= 2

  const grade: LeadGrade = points >= 12 ? 'A' : points >= 7 ? 'B' : 'C'
  const estimatedMonthly = estimateBenefit(age)

  return {
    grade,
    qualified: true,
    disqualifyReason: null,
    estimatedMonthly,
  }
}

function estimateBenefit(ageRange?: string): number {
  switch (ageRange) {
    case '55-63':
      return 2840
    case '50-54':
      return 2460
    case '64 or older':
      return 3010
    case '40-49':
      return 1980
    default:
      return 1640
  }
}

export const MAX_SSA_BENEFIT = 4152
