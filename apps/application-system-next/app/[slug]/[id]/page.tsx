import { Suspense } from 'react'
import { InitialScreenGate } from '../../../components/InitialScreenGate'
import { ShellSkeleton } from '../../../components/ShellSkeleton'

interface ApplicationPageProps {
  params: Promise<{ slug: string; id: string }>
  searchParams: Promise<{ screen?: string }>
}

const ApplicationPage = async ({
  params,
  searchParams,
}: ApplicationPageProps) => {
  const [{ id }, { screen }] = await Promise.all([params, searchParams])

  return (
    <Suspense fallback={<ShellSkeleton />}>
      <InitialScreenGate applicationId={id} screen={screen} />
    </Suspense>
  )
}

export default ApplicationPage
