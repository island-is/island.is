import { useLocale, useNamespaces } from '@island.is/localization'
import { useGetInsuranceOverviewQuery } from './HealthOverview.generated'
import { ErrorScreen, IntroHeader, m } from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { Box } from '@island.is/island-ui/core'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'

const HEALTH_CENTER_LOGO_PATH = 'Sjúkratryggingar'

export const HealthOverview = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()

  const { data, error, loading } = useGetInsuranceOverviewQuery()

  console.log(data)
  console.log(error)
  console.log(loading)

  if (error) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.overview).toLowerCase(),
        })}
      />
    )
  }

  return (
    <Box paddingY={4}>
      <IntroHeader
        title={formatMessage(messages.healthCenterTitle)}
        intro={formatMessage(messages.healthCenterDescription)}
      />
    </Box>
  )
}

export default HealthOverview
