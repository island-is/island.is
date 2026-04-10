import { useQuery } from '@apollo/client'
import { Navigate } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import {
  IntroWrapperV2,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { SkeletonLoader } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { UnemploymentBenefitsPaths } from '../../lib/paths'
import { GET_VMST_APPLICATIONS_OVERVIEW_QUERY } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../lib/messages/unemployment'

export const UnemploymentBenefitsRoot = () => {
  const { formatMessage } = useLocale()
  const { data, loading } = useQuery(GET_VMST_APPLICATIONS_OVERVIEW_QUERY)

  const hasApplication =
    data?.vmstApplicationsOverview?.unemploymentApplication?.isVisible

  if (loading) {
    return (
      <IntroWrapperV2 title={formatMessage(um.unemploymentBenefits)}>
        <SkeletonLoader height={300} borderRadius="large" />
      </IntroWrapperV2>
    )
  }

  if (hasApplication) {
    return <Navigate to={UnemploymentBenefitsPaths.Status} replace />
  }

  return (
    <IntroWrapperV2 title={formatMessage(um.unemploymentBenefits)}>
      <Problem
        type="no_data"
        noBorder={false}
        title={formatMessage(coreMessages.noData)}
        message={formatMessage(coreMessages.noDataFoundDetail)}
        imgSrc="./assets/images/sofa.svg"
      />
    </IntroWrapperV2>
  )
}
