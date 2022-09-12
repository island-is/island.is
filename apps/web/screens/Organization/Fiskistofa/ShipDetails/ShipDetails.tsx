import {
  Box,
  Breadcrumbs,
  Button,
  GridContainer,
  Inline,
} from '@island.is/island-ui/core'
import {
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'
import { Screen } from '@island.is/web/types'
import { Locale } from 'locale'
import { useState } from 'react'
import { AflamarkCalculator } from './components/AflamarkCalculator'
import { Dashboard } from './components/Dashboard'
import { DeilistofnaCalculator } from './components/DeilistofnaCalculator'

const tabs = [
  {
    label: 'Mælaborð',
    content: <Dashboard />,
    id: 'dashboard',
  },
  {
    label: 'Reiknivél aflamarks',
    content: <AflamarkCalculator />,
    id: 'aflamark',
  },
  {
    label: 'Reiknivél deilistofna',
    content: <DeilistofnaCalculator />,
    id: 'deilistofn',
  },
]

interface ShipDetailsProps {
  locale: Locale
  namespace: Record<string, string>
}

const ShipDetails: Screen<ShipDetailsProps> = ({ locale, namespace }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0])

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: 'Fiskistofa',
      href: linkResolver('organizationpage', ['fiskistofa'], locale).href,
    },
  ]

  return (
    <>
      <GridContainer>
        <Breadcrumbs items={breadcrumbItems} />
        <Box marginTop={3} marginBottom={3}>
          <Inline alignY="center" space={3}>
            {tabs.map((tab) => (
              <Button
                onClick={() => setSelectedTab(tab)}
                type=""
                variant="text"
                key={tab.id}
              >
                {tab.label}
              </Button>
            ))}
          </Inline>
        </Box>
      </GridContainer>
      {selectedTab.content}
    </>
  )
}

ShipDetails.getInitialProps = async ({ locale, apolloClient }) => {
  const response = await apolloClient.query<
    GetNamespaceQuery,
    QueryGetNamespaceArgs
  >({
    query: GET_NAMESPACE_QUERY,
    variables: {
      input: {
        lang: locale,
        namespace: 'Fiskistofa - Ship details',
      },
    },
  })

  const namespaceString = response?.data?.getNamespace?.fields || '{}'
  const namespace = JSON.parse(namespaceString)

  return {
    locale: locale as Locale,
    namespace,
  }
}

export default withMainLayout(ShipDetails)
