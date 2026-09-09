import { Footer, Header } from '../components/Chrome'

export function Terms() {
  return (
    <div className="min-h-screen bg-[#f5f4f1]">
      <Header />
      <main className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="mb-4 text-3xl font-extrabold">Terms</h1>
        <p className="mb-3 text-[#444]">
          This site is a take-home demonstration of a qualification funnel, lead capture pipeline, and Meta conversion
          tracking stack. It is not a real benefits application and does not provide legal advice.
        </p>
        <p className="text-[#444]">Do not submit real personal information unless you are evaluating the system in a controlled test.</p>
      </main>
      <Footer />
    </div>
  )
}

export function Privacy() {
  return (
    <div className="min-h-screen bg-[#f5f4f1]">
      <Header />
      <main className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="mb-4 text-3xl font-extrabold">Privacy policy</h1>
        <p className="mb-3 text-[#444]">
          Test leads are stored in a local SQLite database (or Turso/libSQL if configured) so failed Meta and n8n
          deliveries can be retried. Email, phone, name, and ZIP are hashed with SHA-256 before they are sent to Meta
          CAPI. Pixel cookies (_fbp, _fbc) are forwarded unhashed because Meta requires them as match keys.
        </p>
        <p className="text-[#444]">
          California ZIP codes are flagged as restricted and are not routed to partner webhooks in this demo.
        </p>
      </main>
      <Footer />
    </div>
  )
}
