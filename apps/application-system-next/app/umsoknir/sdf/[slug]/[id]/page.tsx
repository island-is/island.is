import { Suspense } from 'react'
import { InitialScreenGate } from '../../../../../components/InitialScreenGate'
import { ShellSkeleton } from '../../../../../components/ShellSkeleton'

interface ApplicationPageProps {
  params: { slug: string; id: string }
  searchParams: { step?: string }
}

const ApplicationPage = async ({
  params,
  searchParams,
}: ApplicationPageProps) => {
  return (
    <Suspense fallback={<ShellSkeleton />}>
      <InitialScreenGate
        applicationId={params.id}
        step={searchParams.step ? parseInt(searchParams.step, 10) : undefined}
      />
    </Suspense>
  )
}

export default ApplicationPage
