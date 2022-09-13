import {
  Box,
  Breadcrumbs,
  Text,
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
import { useMemo, useState } from 'react'
import { AflamarkCalculator } from './components/AflamarkCalculator'
import { DeilistofnaCalculator } from './components/DeilistofnaCalculator'

interface ShipDetailsProps {
  locale: Locale
  namespace: Record<string, string>
}

const ShipDetails: Screen<ShipDetailsProps> = ({ locale, namespace }) => {
  const tabs = useMemo(
    () => [
      {
        label: 'Reiknivél aflamarks',
        content: <AflamarkCalculator namespace={namespace} />,
        id: 'aflamark',
      },
      {
        label: 'Reiknivél deilistofna',
        content: <DeilistofnaCalculator namespace={namespace} />,
        id: 'deilistofn',
      },
    ],
    [],
  )

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
          <Inline alignY="center" space={5}>
            {tabs.map((tab) => {
              const isSelected = selectedTab.id === tab.id
              return (
                <Box
                  cursor="pointer"
                  onClick={() => setSelectedTab(tab)}
                  key={tab.id}
                >
                  <Text
                    fontWeight={isSelected ? 'semiBold' : undefined}
                    color={isSelected ? 'blue400' : undefined}
                  >
                    {tab.label}
                  </Text>
                </Box>
              )
            })}
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
