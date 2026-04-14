import { Suspense } from 'react'
import { fetchScreen } from '../../../../lib/graphql'
import { ApplicationShell } from '../../../../components/ApplicationShell'
import { ShellSkeleton } from '../../../../components/ShellSkeleton'

interface ApplicationPageProps {
  params: { slug: string; id: string }
  searchParams: { step?: string }
}

export default async function ApplicationPage({
  params,
  searchParams,
}: ApplicationPageProps) {
  return (
    <Suspense fallback={<ShellSkeleton />}>
      <ApplicationContent
        id={params.id}
        step={searchParams.step ? parseInt(searchParams.step, 10) : undefined}
      />
    </Suspense>
  )
}

async function ApplicationContent({
  id,
  step,
}: {
  id: string
  step?: number
}) {
  const screen = await fetchScreen(id, step)
  return <ApplicationShell applicationId={id} initialScreen={screen} />
}
