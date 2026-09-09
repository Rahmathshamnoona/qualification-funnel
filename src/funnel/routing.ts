import { QUESTIONS } from './questions'

export type RouteTarget = string | 'email'

export function nextStep(currentId: string, value: string, answers: Record<string, string>): RouteTarget {
  const jump = branch(currentId, value, answers)
  if (jump && QUESTIONS.some((step) => step.id === jump)) return jump

  const index = QUESTIONS.findIndex((step) => step.id === currentId)
  if (index === QUESTIONS.length - 1 || index === -1) return 'email'
  return QUESTIONS[index + 1]!.id
}

function branch(currentId: string, value: string, answers: Record<string, string>): string | null {
  switch (currentId) {
    case 'page_sm72h5':
      return value === 'Not working' ? 'lastworked' : 'fiveyearwork'
    case 'fiveyearwork':
      return value === 'Between 4 and 6 years' || value === 'More than 6 years' ? 'outofwork' : null
    case 'outofwork':
      return value === 'Yes' && answers.PPR_question_6kdqgg === 'Not working' ? 'conditionstart' : 'visit'
    case 'visit':
      return value === 'Yes' ? 'page_igxwft' : null
    case 'page_igxwft':
      return value === 'No' ? 'page_1kwm6b' : null
    case 'attorney':
      return value === 'Yes' ? 'attorneyfirm' : 'page_9rrpa3'
    case 'page_9rrpa3':
      return value === 'No' ? 'page_1kwm6b' : null
    case 'page_sozf2w':
      if (value === 'Waiting on first decision') return 'page_ddujlp'
      if (value === 'I requested reconsideration') return 'page_reconstatus'
      if (value === 'I requested a hearing') return 'page_doic6e'
      if (value === 'First decision was denied') return 'page_denialage'
      return 'page_1kwm6b'
    case 'page_reconstatus':
      return value === 'Got denied' ? 'page_denialage' : 'page_ddujlp'
    case 'page_denialage':
      return 'page_1kwm6b'
    case 'page_doic6e':
      return value === 'A hearing is scheduled' ? 'page_6dkfid' : 'page_ddujlp'
    case 'page_ddujlp':
      return 'page_1kwm6b'
    default:
      return null
  }
}

export function progressPercent(phase: string, stepId?: string): number {
  if (phase === 'start') return 8
  if (phase === 'email') return 82
  if (phase === 'pii') return 92
  if (phase === 'outcome') return 100
  const index = QUESTIONS.findIndex((step) => step.id === stepId)
  if (index < 0) return 15
  return Math.round(12 + (index / (QUESTIONS.length - 1)) * 68)
}
