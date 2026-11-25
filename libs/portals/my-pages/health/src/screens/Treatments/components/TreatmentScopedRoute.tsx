import { CardLoader } from '@island.is/portals/my-pages/core'
import { useFeatureFlag } from '@island.is/react/feature-flags'
import { Fragment, ReactNode } from 'react'
import { Navigate, generatePath, useParams } from 'react-router-dom'
import { HealthPaths } from '../../../lib/paths'

interface Props {
  flag: string
  children: ReactNode
}

// The key remounts the screen when moving between treatments, so form and
// filter state never carries over from another treatment
export const TreatmentScopedRoute = ({ flag, children }: Props) => {
  const { treatmentId } = useParams() as { treatmentId: string }
  const { value: enabled, loading } = useFeatureFlag(flag, false)

  if (loading) {
    return <CardLoader />
  }

  if (!enabled) {
    return (
      <Navigate
        to={generatePath(HealthPaths.HealthTreatment, { treatmentId })}
        replace
      />
    )
  }

  return <Fragment key={treatmentId}>{children}</Fragment>
}

export default TreatmentScopedRoute
