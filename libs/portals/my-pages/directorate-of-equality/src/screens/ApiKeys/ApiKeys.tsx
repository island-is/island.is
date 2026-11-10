import { Box, SkeletonLoader, Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { NAMESPACE } from '../../lib/constants'
import { messages } from '../../lib/messages'
import { useDirectorateOfEqualityCompanyQuery } from '../../mocks/hooks'
import { ApiKeysTab } from './components/ApiKeysTab'
import { ServiceProvidersTab } from './components/ServiceProvidersTab'

const ApiKeys = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage } = useLocale()
  const { data, loading, error } = useDirectorateOfEqualityCompanyQuery()
  const company = data?.directorateOfEqualityCompany

  const tabs = [
    {
      id: 'service-providers',
      label: formatMessage(messages.tabServiceProviders),
      content: <ServiceProvidersTab />,
    },
    {
      id: 'company-keys',
      label: formatMessage(messages.tabCompanyKeys),
      content: (
        <ApiKeysTab
          serviceProviderApprovedAt={company?.serviceProviderApprovedAt ?? null}
        />
      ),
    },
  ]

  return (
    <IntroWrapper
      title={formatMessage(coreMessages.equalityApiKeys)}
      intro={formatMessage(messages.apiKeysIntro)}
      serviceProvider={{
        slug: JAFNRETTISSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.equalityTooltip),
      }}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {loading && <SkeletonLoader height={48} repeat={3} space={2} />}
      {!loading && !error && (
        <Box marginTop={2}>
          <Tabs
            label={formatMessage(coreMessages.equalityApiKeys)}
            selected="service-providers"
            contentBackground="transparent"
            onlyRenderSelectedTab
            tabs={tabs}
          />
        </Box>
      )}
    </IntroWrapper>
  )
}

export default ApiKeys
