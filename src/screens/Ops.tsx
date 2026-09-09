import { useEffect, useMemo, useState } from 'react'

type OpsPayload = {
  ok: boolean
  error?: string
  config?: { meta: boolean; n8n: boolean }
  counts?: Record<string, number>
  leads?: Record<string, unknown>[]
  outbox?: Record<string, unknown>[]
}

export function Ops() {
  const key = useMemo(() => new URLSearchParams(window.location.search).get('key') || '', [])
  const [data, setData] = useState<OpsPayload | null>(null)
  const [error, setError] = useState('')

  async function load() {
    const response = await fetch(`/api/ops?key=${encodeURIComponent(key)}`)
    const json = (await response.json()) as OpsPayload
    if (!response.ok) {
      setError(json.error || 'Unable to load ops')
      return
    }
    setData(json)
  }

  useEffect(() => {
    void load()
  }, [key])

  async function retry(id?: string) {
    await fetch(`/api/ops?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'retry', id, key }),
    })
    await load()
  }

  if (!key) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Ops</h1>
        <p className="mt-2 text-[#555]">Add <code>?key=YOUR_OPS_KEY</code> to view pipeline health.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Ops</h1>
        <p className="mt-2 text-red-600">{error}</p>
      </div>
    )
  }

  if (!data) return <div className="p-6">Loading…</div>

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Lead pipeline</h1>
          <p className="text-sm text-[#666]">
            Meta CAPI {data.config?.meta ? 'configured' : 'demo'} · n8n {data.config?.n8n ? 'configured' : 'local store'}
          </p>
        </div>
        <button className="rounded-lg bg-[#6D29FF] px-4 py-2 text-sm font-bold text-white" onClick={() => retry()}>
          Retry failed jobs
        </button>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.entries(data.counts ?? {}).map(([name, value]) => (
          <div key={name} className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-[#888]">{name}</p>
            <p className="text-2xl font-extrabold">{String(value)}</p>
          </div>
        ))}
      </div>
      <h2 className="mb-2 text-lg font-bold">Outbox</h2>
      <div className="mb-8 overflow-x-auto rounded-xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f5f4f1] text-xs uppercase text-[#666]">
            <tr>
              <th className="p-3">Channel</th>
              <th className="p-3">Event</th>
              <th className="p-3">Status</th>
              <th className="p-3">Attempts</th>
              <th className="p-3">Error</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(data.outbox ?? []).map((row) => (
              <tr key={String(row.id)} className="border-t border-[#eee]">
                <td className="p-3">{String(row.channel)}</td>
                <td className="p-3">{String(row.event_name)}</td>
                <td className="p-3 font-semibold">{String(row.status)}</td>
                <td className="p-3">{String(row.attempts)}</td>
                <td className="p-3 text-xs text-red-600">{row.last_error ? String(row.last_error) : ''}</td>
                <td className="p-3">
                  {row.status === 'failed' || row.status === 'dead' ? (
                    <button className="text-[#6D29FF] underline" onClick={() => retry(String(row.id))}>
                      Retry
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mb-2 text-lg font-bold">Leads</h2>
      <div className="overflow-x-auto rounded-xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f5f4f1] text-xs uppercase text-[#666]">
            <tr>
              <th className="p-3">Created</th>
              <th className="p-3">Email</th>
              <th className="p-3">Grade</th>
              <th className="p-3">Match</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data.leads ?? []).map((row) => (
              <tr key={String(row.id)} className="border-t border-[#eee]">
                <td className="p-3 whitespace-nowrap">{String(row.created_at).slice(0, 19).replace('T', ' ')}</td>
                <td className="p-3">{String(row.email ?? '')}</td>
                <td className="p-3">{String(row.lead_grade ?? '')}</td>
                <td className="p-3">{String(row.match_quality ?? '')}</td>
                <td className="p-3 font-semibold">{String(row.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
