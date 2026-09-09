# Assumptions, trade-offs, extras

**Assumptions.** The live funnel is a paid-social lead gen form: keep people moving, capture contact, then a call CTA. I treated “similar” as the same qualification graph and conversion moment, not a pixel-perfect clone. BenefitPath is a demo brand so this is not impersonating Disability Path. Meta and n8n credentials are optional; without them the system still stores leads and queues events so reviewers can inspect quality and failure handling.

**Meta.** The thing that actually moves ROAS is Event Match Quality plus honest counts. I send Pixel + CAPI with one `event_id` per action, hash PII the way Events Manager expects, and forward `fbp`/`fbc`/IP/UA unhashed. ZIP is collected on purpose — geo is a cheap match key the original form skips. I do **not** CAPI every question click; that inflates event volume and muddies the conversion. `Lead` at email and `CompleteRegistration` at phone/ZIP are the two events I would optimize. Dedup is enforced twice: Meta’s 48-hour window, and our outbox unique `(channel, event_id)` so retries cannot double-fire.

**Routing.** n8n → Airtable is the production shape (import `n8n/lead-to-airtable.json`). Upsert is by `leadId`, not email, because people mistype emails and we still want one row as PII arrives in two posts. California ZIPs are stored and flagged Restricted rather than dropped — dropping looks like “lost lead” in ads reporting.

**Resilience.** Write-ahead outbox, exponential backoff, dead letter, `/ops` retry. If CAPI or n8n is down, the user still sees a result; ops sees `degraded`/`dead`. That is the right failure mode for a funnel: never block the thank-you screen on a partner timeout.

**Trade-offs.** Local/default storage is libSQL file (Turso-ready). Vercel without Turso uses `/tmp`, which is not durable — I would not ship that to production, but it keeps the take-home runnable. No TrustedForm/Jornaya cert in this repo; I recorded TCPA text, version, and timestamp instead, which is enough to prove consent lineage. Estimated match quality is a proxy, not Meta’s EMQ.

**Extras.** Lead grading (A/B/C), attorney-firm disqualification, session resume, back button, matching interstitial, CA restriction, ops dashboard, Docker Compose for n8n, and sample Airtable CSV.
