import { Suspense } from 'react'
import { InitialScreenGate } from '../../../../components/InitialScreenGate'
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
  return <InitialScreenGate applicationId={id} step={step} />
}
