import { useQuery } from '@apollo/client'
import { Navigate } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import {
  IntroWrapper,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { SkeletonLoader } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { UnemploymentBenefitsPaths } from '../../lib/paths'
import { GET_VMST_APPLICATIONS_OVERVIEW_QUERY } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../lib/messages/unemployment'

export const UnemploymentBenefitsRoot = () => {
  const { formatMessage } = useLocale()
  const { data, loading, error } = useQuery(
    GET_VMST_APPLICATIONS_OVERVIEW_QUERY,
  )

  const hasApplication =
    data?.vmstApplicationsOverview?.unemploymentApplication?.isVisible

  if (loading) {
    return (
      <IntroWrapper title={formatMessage(um.unemploymentBenefits)}>
        <SkeletonLoader height={300} borderRadius="large" />
      </IntroWrapper>
    )
  }

  if (error) {
    return (
      <IntroWrapper title={formatMessage(um.unemploymentBenefits)}>
        <Problem error={error} noBorder={false} />
      </IntroWrapper>
    )
  }

  if (hasApplication) {
    return <Navigate to={UnemploymentBenefitsPaths.Status} replace />
  }

  return (
    <IntroWrapper title={formatMessage(um.unemploymentBenefits)}>
      <Problem
        type="no_data"
        noBorder={false}
        title={formatMessage(coreMessages.noData)}
        message={formatMessage(coreMessages.noDataFoundDetail)}
        imgSrc="./assets/images/sofa.svg"
      />
    </IntroWrapper>
  )
}
