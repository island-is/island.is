import { Navigate } from 'react-router-dom'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { EducationPaths } from '../../lib/paths'

export const EducationRootRedirect = () => {
  const { value: overviewEnabled, loading } = useFeatureFlag(
    Features.isServicePortalPrimarySchoolKeyInfoEnabled,
    false,
  )

  if (loading) return null

  return (
    <Navigate
      to={
        overviewEnabled
          ? EducationPaths.EducationOverview
          : EducationPaths.EducationPrimarySchool
      }
      replace
    />
  )
}
