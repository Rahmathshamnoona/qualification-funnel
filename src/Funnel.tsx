import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ProgressBar } from './components/Chrome'
import { QUESTIONS, QUESTION_BY_ID } from './funnel/questions'
import { nextStep, progressPercent } from './funnel/routing'
import { scoreLead } from './funnel/score'
import { phoneDigits, submitLead, TCPA_TEXT, TCPA_VERSION } from './lib/api'
import { collectTracking } from './lib/cookies'
import { initPixel, trackPixel } from './lib/pixel'
import { loadSession, saveSession, type SessionState } from './lib/session'
import type { FunnelPhase, LeadResponse } from './types'
import { Contact } from './screens/Contact'
import { EmailCapture } from './screens/Email'
import { Landing } from './screens/Landing'
import { Matching } from './screens/Matching'
import { Question } from './screens/Question'
import { Result } from './screens/Result'

function pathFor(phase: FunnelPhase, stepId?: string): string {
  if (phase === 'start') return '/'
  if (phase === 'email') return '/email'
  if (phase === 'pii') return '/contact'
  if (phase === 'outcome') return '/result'
  return `/q/${stepId ?? QUESTIONS[0]!.id}`
}

function parsePath(pathname: string): { phase: FunnelPhase; stepId?: string } {
  if (pathname === '/email') return { phase: 'email' }
  if (pathname === '/contact') return { phase: 'pii' }
  if (pathname === '/result') return { phase: 'outcome' }
  if (pathname.startsWith('/q/')) {
    const id = pathname.slice(3)
    if (QUESTION_BY_ID[id]) return { phase: 'questions', stepId: id }
  }
  return { phase: 'start' }
}

export default function Funnel() {
  const location = useLocation()
  const navigate = useNavigate()
  const parsed = parsePath(location.pathname)
  const phase = parsed.phase
  const stepId = parsed.stepId ?? QUESTIONS[0]!.id
  const [session, setSession] = useState<SessionState>(() => loadSession())
  const [matching, setMatching] = useState(false)
  const [result, setResult] = useState<LeadResponse | null>(null)

  const qualification = useMemo(() => scoreLead(session.answers), [session.answers])

  const persist = useCallback((next: SessionState) => {
    setSession(next)
    saveSession(next)
  }, [])

  const go = useCallback(
    (nextPhase: FunnelPhase, nextStepId?: string) => {
      const path = pathFor(nextPhase, nextStepId) + window.location.search
      navigate(path)
      window.scrollTo(0, 0)
    },
    [navigate],
  )

  useEffect(() => {
    initPixel()
    trackPixel('PageView', session.pageViewEventId, { content_name: 'qualification_start' })
    const tracking = collectTracking()
    void submitLead({
      leadId: session.leadId,
      sessionId: session.sessionId,
      eventId: session.pageViewEventId,
      eventName: 'PageView',
      eventSourceUrl: window.location.href,
      answers: session.answers,
      contact: { over40: session.over40 },
      tracking,
    }).catch(() => undefined)
    // PageView once per session id; shared event_id keeps Pixel/CAPI/retries deduped.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onLanding(value: 'yes' | 'no') {
    persist({ ...session, over40: value, answers: { ...session.answers, over40: value } })
    go('questions', QUESTIONS[0]!.id)
  }

  function onQuestion(value: string) {
    const step = QUESTION_BY_ID[stepId]
    if (!step) return
    const answers = { ...session.answers, [step.dlKey]: value }
    const history = [...session.history, stepId]
    persist({ ...session, answers, history })
    const target = nextStep(stepId, value, answers)
    if (target === 'email') go('email')
    else go('questions', target)
  }

  function onBack() {
    if (phase === 'questions' && session.history.length) {
      const history = [...session.history]
      const prev = history.pop()!
      persist({ ...session, history })
      go('questions', prev)
      return
    }
    persist({ ...session, history: [] })
    go('start')
  }

  async function onEmail(email: string) {
    const eventId = crypto.randomUUID()
    persist({ ...session, email })
    trackPixel('Lead', eventId, { content_name: 'email_capture' })
    try {
      await submitLead({
        leadId: session.leadId,
        sessionId: session.sessionId,
        eventId,
        eventName: 'Lead',
        eventSourceUrl: window.location.href,
        answers: session.answers,
        contact: {
          email,
          gender: session.answers.PPR_optin_gender,
          ageRange: session.answers.PPR_optin_age,
          over40: session.over40,
        },
        tracking: collectTracking(),
      })
    } catch {
      /* still continue — outbox/ops can recover later retries from a later CompleteRegistration */
    }
    go('pii')
  }

  async function onContact(data: { firstName: string; lastName: string; phone: string; zip: string }) {
    const eventId = crypto.randomUUID()
    const phone = phoneDigits(data.phone)
    persist({ ...session, ...data, phone })
    trackPixel('CompleteRegistration', eventId, {
      content_name: 'contact_submit',
      status: qualification.qualified ? 'qualified' : 'disqualified',
    })
    setMatching(true)
    try {
      const response = await submitLead({
        leadId: session.leadId,
        sessionId: session.sessionId,
        eventId,
        eventName: 'CompleteRegistration',
        eventSourceUrl: window.location.href,
        answers: session.answers,
        contact: {
          email: session.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone,
          zip: data.zip,
          gender: session.answers.PPR_optin_gender,
          ageRange: session.answers.PPR_optin_age,
          over40: session.over40,
        },
        tracking: collectTracking(),
        consent: {
          tcpa: true,
          text: TCPA_TEXT,
          timestamp: new Date().toISOString(),
          version: TCPA_VERSION,
        },
      })
      setResult(response)
    } catch {
      setResult({
        ok: false,
        leadId: session.leadId,
        eventId,
        qualified: qualification.qualified,
        grade: qualification.grade,
        estimatedMonthly: qualification.estimatedMonthly,
        matchQuality: 0,
        meta: { queued: false, status: 'client_error' },
        automation: { queued: false, status: 'client_error' },
        demoMode: true,
      })
    }
  }

  const percent = progressPercent(phase, stepId)

  return (
    <>
      {phase === 'start' ? <Landing onAnswer={onLanding} /> : null}
      {phase === 'questions' && QUESTION_BY_ID[stepId] ? (
        <Question step={QUESTION_BY_ID[stepId]} onSelect={onQuestion} onBack={onBack} />
      ) : null}
      {phase === 'email' ? <EmailCapture initialEmail={session.email} onSubmit={onEmail} /> : null}
      {phase === 'pii' ? (
        <Contact
          initial={{ firstName: session.firstName, lastName: session.lastName, phone: session.phone, zip: session.zip }}
          onSubmit={onContact}
        />
      ) : null}
      {phase === 'outcome' ? (
        <Result
          firstName={session.firstName}
          estimatedMonthly={result?.estimatedMonthly ?? qualification.estimatedMonthly}
          grade={result?.grade ?? qualification.grade}
          qualified={result?.qualified ?? qualification.qualified}
          matchQuality={result?.matchQuality}
        />
      ) : null}
      {phase !== 'outcome' ? <ProgressBar value={percent} /> : null}
      {matching ? (
        <Matching
          onDone={() => {
            setMatching(false)
            go('outcome')
          }}
        />
      ) : null}
    </>
  )
}
