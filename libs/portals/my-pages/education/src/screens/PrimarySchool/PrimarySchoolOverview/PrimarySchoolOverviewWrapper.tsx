import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import { IntroWrapperV2, MMS_SLUG } from '@island.is/portals/my-pages/core'
import { useNamespaces } from '@island.is/localization'
import { EducationPaths } from '../../../lib/paths'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import PrimarySchool from '../PrimarySchool/PrimarySchool'

export const PrimarySchoolOverviewWrapper = () => {
  useNamespaces('sp.education-primary-school')
  const featureFlagClient = useFeatureFlagClient()
  const [enabled, setEnabled] = useState<boolean>()

  useEffect(() => {
    featureFlagClient
      .getValue(Features.isServicePortalPrimarySchoolPageEnabled, false)
      .then(setEnabled)
  }, [featureFlagClient])

  if (enabled === undefined)
    return (
      <IntroWrapperV2
        title={psm.studentListTitle}
        loading
        serviceProvider={{ slug: MMS_SLUG }}
      />
    )
  if (enabled === true) return <PrimarySchool />
  return <Navigate to={EducationPaths.EducationAssessment} replace />
}

export default PrimarySchoolOverviewWrapper
