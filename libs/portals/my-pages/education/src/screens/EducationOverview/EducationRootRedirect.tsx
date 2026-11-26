import { Navigate } from 'react-router-dom'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { EducationPaths } from '../../lib/paths'

export const EducationRootRedirect = ({ isActor }: { isActor: boolean }) => {
  const { value: flagEnabled, loading } = useFeatureFlag(
    Features.isServicePortalPrimarySchoolKeyInfoEnabled,
    false,
  )

  if (loading) return null

  return (
    <Navigate
      to={
        flagEnabled && !isActor
          ? EducationPaths.EducationOverview
          : EducationPaths.EducationPrimarySchool
      }
      replace
    />
  )
}
