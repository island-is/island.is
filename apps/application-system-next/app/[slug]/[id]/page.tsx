import { Suspense } from 'react'
import { InitialScreenGate } from '../../../components/InitialScreenGate'
import { ShellSkeleton } from '../../../components/ShellSkeleton'

interface ApplicationPageProps {
  params: Promise<{ slug: string; id: string }>
  searchParams: Promise<{ step?: string }>
}

const ApplicationPage = async ({
  params,
  searchParams,
}: ApplicationPageProps) => {
  const [{ id }, { step }] = await Promise.all([params, searchParams])

  return (
    <Suspense fallback={<ShellSkeleton />}>
      <InitialScreenGate
        applicationId={id}
        step={step ? parseInt(step, 10) : undefined}
      />
    </Suspense>
  )
}

export default ApplicationPage
