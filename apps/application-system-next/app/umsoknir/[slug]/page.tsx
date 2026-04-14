import { redirect } from 'next/navigation'

/**
 * Handles the slug-only route: /umsoknir/<slug>
 * In the SDF flow the user must have an applicationId to fetch a screen.
 * This page would either create a new application or redirect to an existing
 * draft. For the POC, it redirects to a placeholder that explains the flow.
 */
export default function ApplicationSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  // In production this would call the backend to create or resume an application
  // and then redirect to /umsoknir/<slug>/<applicationId>
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Application: {params.slug}</h1>
      <p>
        To start a new application, the system needs to create an application
        record first. Redirect to{' '}
        <code>/umsoknir/{params.slug}/&lt;applicationId&gt;</code> with a valid
        ID.
      </p>
    </main>
  )
}
