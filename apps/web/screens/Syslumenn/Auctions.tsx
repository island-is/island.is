/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  NavigationItem,
  Option,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetAuctionsArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { OrganizationWrapper } from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import getConfig from 'next/config'
import { GET_AUCTIONS_QUERY } from '@island.is/web/screens/queries/Auction'
import { useQuery } from '@apollo/client'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

const { publicRuntimeConfig } = getConfig()

interface SubPageProps {
  organizationPage: Query['getOrganizationPage']
  namespace: Query['getNamespace']
}

const Auctions: Screen<SubPageProps> = ({ organizationPage, namespace }) => {
  const { disableSyslumennPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { format } = useDateUtils()

  const pageUrl = `/stofnanir/syslumenn/uppbod`

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active:
        primaryLink.url === pageUrl ||
        childrenLinks.some((link) => link.url === pageUrl),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  const date = new Date()

  const [organization, setOrganization] = useState(
    'syslumadurinn-a-hofudborgarsvaedinu',
  )
  const [month, setMonth] = useState(`${date.getFullYear()}-${date.getMonth()}`)

  const organizations = [
    {
      label: 'Höfuðborgarsvæðið',
      value: 'syslumadurinn-a-hofudborgarsvaedinu',
    },
    {
      label: 'Norðurland eystra',
      value: 'syslumadurinn-a-nordurlandi-eystra',
    },
  ]
  const months = []

  for (let i = 0; i <= 2; i++) {
    months.push({
      label: format(date, 'MMMM yyyy'),
      value: `${date.getFullYear()}-${date.getMonth()}`,
    })
    date.setMonth(date.getMonth() - 1)
  }

  const { loading, error, data, refetch } = useQuery<
    Query,
    QueryGetAuctionsArgs
  >(GET_AUCTIONS_QUERY, {
    variables: {
      input: {
        lang: 'is',
        organization,
        year: parseInt(month.split('-')[0]),
        month: parseInt(month.split('-')[1]),
      },
    },
  })

  useEffect(() => {
    refetch()
  }, [organization, month])

  return (
    <OrganizationWrapper
      pageTitle="Uppboð"
      organizationPage={organizationPage}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: n('organizations', 'Stofnanir'),
          href: linkResolver('organizations').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
        },
      ]}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
        titleLink: {
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
          active: false,
        },
      }}
    >
      <Box marginBottom={6}>
        <Text variant="h1" as="h2">
          Uppboð
        </Text>
      </Box>
      <GridContainer>
        <GridRow>
          <GridColumn
            paddingTop={[4, 4, 0]}
            paddingBottom={[4, 4, 6]}
            span={['12/12', '12/12', '12/12', '12/12', '6/12']}
          >
            <Select
              backgroundColor="white"
              icon="chevronDown"
              size="sm"
              isSearchable
              label="Embætti"
              name="select1"
              noOptionsMessage="Enginn valmöguleiki"
              options={organizations}
              value={organizations.find((x) => x.value === organization)}
              onChange={({ value }: Option) => setOrganization(value)}
              placeholder="Veldu embætti"
            />
          </GridColumn>
          <GridColumn
            paddingTop={[4, 4, 0]}
            paddingBottom={[4, 4, 6]}
            span={['12/12', '12/12', '12/12', '12/12', '6/12']}
          >
            <Select
              backgroundColor="white"
              icon="chevronDown"
              size="sm"
              isSearchable
              label="Tímabil"
              name="select1"
              noOptionsMessage="Enginn valmöguleiki"
              options={months}
              value={months.find((x) => x.value === month)}
              onChange={({ value }: Option) => setMonth(value)}
              placeholder="Veldu tímabil"
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
      <Box
        borderTopWidth="standard"
        borderColor="standard"
        paddingTop={[4, 4, 6]}
        paddingBottom={[4, 5, 10]}
      >
        {!data?.getAuctions.length && (
          <Text>Engin uppboð eru skráð fyrir þetta tímabil</Text>
        )}
        {data?.getAuctions.map((auction) => (
          <Box
            borderWidth="standard"
            borderColor="standard"
            borderRadius="standard"
            padding={6}
          >
            <Text>{auction.title}</Text>
            <Text>{auction.date}</Text>
            <Text>{auction.type}</Text>
          </Box>
        ))}
      </Box>
    </OrganizationWrapper>
  )
}

Auctions.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: 'syslumenn',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Syslumenn',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  return {
    organizationPage: getOrganizationPage,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(Auctions, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
