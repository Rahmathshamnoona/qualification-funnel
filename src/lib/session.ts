const KEY = 'bp_context'

export type SessionState = {
  leadId: string
  sessionId: string
  pageViewEventId: string
  answers: Record<string, string>
  over40?: string
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  zip?: string
  history: string[]
}

function newId(): string {
  return crypto.randomUUID()
}

export function loadSession(): SessionState {
  const created: SessionState = {
    leadId: newId(),
    sessionId: newId(),
    pageViewEventId: newId(),
    answers: {},
    history: [],
  }

  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      saveSession(created)
      return created
    }
    const parsed = JSON.parse(raw) as Partial<SessionState>
    return {
      ...created,
      ...parsed,
      answers: parsed.answers ?? {},
      history: parsed.history ?? [],
      leadId: parsed.leadId || created.leadId,
      sessionId: parsed.sessionId || created.sessionId,
      pageViewEventId: parsed.pageViewEventId || created.pageViewEventId,
    }
  } catch {
    saveSession(created)
    return created
  }
}

export function saveSession(state: SessionState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function resetSession(): SessionState {
  localStorage.removeItem(KEY)
  return loadSession()
}

export function captureQueryParams(): Record<string, string> {
  const params: Record<string, string> = {}
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (value && !value.startsWith('{')) params[key] = value
  })
  return params
}
