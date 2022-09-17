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
import { linkResolver, useNamespace } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'
import { Screen } from '@island.is/web/types'
import { Locale } from 'locale'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { AflamarkCalculator } from './components/AflamarkCalculator'
import { DeilistofnaCalculator } from './components/DeilistofnaCalculator'

const TAB_OPTIONS = [
  { label: 'Reiknivél aflamarks', value: 'aflamark' },
  { label: 'Reiknivél deilistofna', value: 'deilistofn' },
] as const

interface ShipDetailsProps {
  locale: Locale
  namespace: Record<string, string>
}

const ShipDetails: Screen<ShipDetailsProps> = ({ locale, namespace }) => {
  const router = useRouter()

  const n = useNamespace(namespace)
  const [selectedTab, setSelectedTab] = useState<typeof TAB_OPTIONS[number]>(
    TAB_OPTIONS[0],
  )

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

  const shipNumber = useMemo(() => {
    const nr = router?.query?.nr
    if (nr && typeof nr === 'string' && !isNaN(Number(nr))) {
      return Number(nr)
    }
    return null
  }, [])

  return (
    <>
      <GridContainer>
        <Breadcrumbs items={breadcrumbItems} />
        <Box marginTop={3} marginBottom={3}>
          <Inline alignY="center" space={5}>
            {TAB_OPTIONS.map((tab) => {
              const isSelected = selectedTab.value === tab.value
              return (
                <Box
                  cursor="pointer"
                  onClick={() => setSelectedTab(tab)}
                  key={tab.value}
                >
                  <Text
                    fontWeight={isSelected ? 'semiBold' : undefined}
                    color={isSelected ? 'blue400' : undefined}
                  >
                    {n(tab.value, tab.label)}
                  </Text>
                </Box>
              )
            })}
          </Inline>
        </Box>
      </GridContainer>

      {selectedTab.value === 'aflamark' && shipNumber && (
        <AflamarkCalculator namespace={namespace} />
      )}
      {selectedTab.value === 'deilistofn' && shipNumber && (
        <DeilistofnaCalculator shipNumber={shipNumber} namespace={namespace} />
      )}
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
