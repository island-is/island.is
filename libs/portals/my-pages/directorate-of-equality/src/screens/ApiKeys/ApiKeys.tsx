import { Box, Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { ContentColumn } from '../../components/ContentColumn/ContentColumn'
import { NAMESPACE } from '../../lib/constants'
import { messages } from '../../lib/messages'
import { useDirectorateOfEqualityCompanyQuery } from '../../lib/company.generated'
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
      <ContentColumn>
        {error && !loading && <Problem error={error} noBorder={false} />}
        {loading && <CardLoader />}
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
      </ContentColumn>
    </IntroWrapper>
  )
}

export default ApiKeys
