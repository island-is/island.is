import type { WrappedLoaderFn } from '@island.is/portals/core'
import { redirect } from 'react-router-dom'
import { Features } from '@island.is/react/feature-flags'
import { EducationPaths } from '../../../lib/paths'

export const primarySchoolGateLoader: WrappedLoaderFn =
  ({ featureFlagClient }) =>
  async () => {
    const enabled = await featureFlagClient
      .getValue(Features.isServicePortalPrimarySchoolPageEnabled, false)
      .catch(() => false)

    console.log('am i under the flag?')

    if (!enabled) {
      return redirect(EducationPaths.EducationAssessment)
    }

    return null
  }
