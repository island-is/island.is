/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import {
  Box,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  NavigationItem,
  Option,
  Select,
  Tag,
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
import { useRouter } from 'next/router'

const { publicRuntimeConfig } = getConfig()

interface AuctionsProps {
  organizationPage: Query['getOrganizationPage']
  namespace: Query['getNamespace']
}

const Auctions: Screen<AuctionsProps> = ({ organizationPage, namespace }) => {
  const { disableSyslumennPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { format } = useDateUtils()
  const Router = useRouter()

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

  const organizations = [
    {
      label: 'Öll embætti',
      value: '',
    },
    {
      label: 'Austurland',
      value: 'syslumadurinn-a-austurlandi',
    },
    {
      label: 'Norðurland eystra',
      value: 'syslumadurinn-a-nordurlandi-eystra',
    },
    {
      label: 'Norðurland vestra',
      value: 'syslumadurinn-a-nordurlandi-vestra',
    },
    {
      label: 'Vesturland',
      value: 'syslumadurinn-a-vesturlandi',
    },
    {
      label: 'Vestfirðir',
      value: 'syslumadurinn-a-vestfjordum',
    },
    {
      label: 'Vestmannaeyjar',
      value: 'syslumadurinn-i-vestmannaeyjum',
    },
    {
      label: 'Suðurland',
      value: 'syslumadurinn-a-sudurlandi',
    },
    {
      label: 'Suðurnes',
      value: 'syslumadurinn-a-sudurnesjum',
    },
    {
      label: 'Höfuðborgarsvæðið',
      value: 'syslumadurinn-a-hoefudborgarsvaedinu',
    },
  ]
  const months = []

  const date = new Date()

  const [organization, setOrganization] = useState<string>(
    organizations[0].value,
  )

  const [month, setMonth] = useState<string>(
    `${date.getFullYear()}-${date.getMonth()}`,
  )

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

  useEffect(() => {
    const hashString = window.location.hash.replace('#', '')
    setOrganization(hashString ?? organizations[0].value)
  }, [Router])

  return (
    <OrganizationWrapper
      pageTitle={n('auction', 'Uppboð')}
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
          {n('auction', 'Uppboð')}
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
              label={n('office', 'Embætti')}
              name="officeSelect"
              options={organizations}
              value={organizations.find((x) => x.value === organization)}
              onChange={({ value }: Option) => {
                setOrganization(String(value))
                Router.replace(
                  window.location.protocol +
                    '//' +
                    window.location.host +
                    window.location.pathname +
                    `#${value}`,
                )
              }}
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
              label={n('period', 'Tímabil')}
              name="periodSelect"
              options={months}
              value={months.find((x) => x.value === month)}
              onChange={({ value }: Option) => setMonth(String(value))}
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
          <Text>{n('noAuctionsFound', 'Engin uppboð fundust')}</Text>
        )}
        {data?.getAuctions.map((auction) => {
          const date = new Date(auction.date)
          const updatedAt = new Date(auction.updatedAt)

          return (
            <FocusableBox
              href={`/stofnanir/syslumenn/uppbod/${auction.id}`}
              borderWidth="standard"
              borderColor="standard"
              borderRadius="standard"
              paddingX={4}
              paddingY={3}
              marginBottom={4}
            >
              <Box>
                <Text variant="eyebrow" color="purple400">
                  {n('auctionType-' + auction.type)}
                </Text>
                <Text variant="h3">
                  {format(date, 'd. MMMM yyyy')} | {auction.title}
                </Text>

                <Text paddingTop={1}>
                  Uppfært {format(updatedAt, 'd. MMMM')} kl.{' '}
                  {format(updatedAt, 'H:m')}
                </Text>
              </Box>
              <Box
                alignItems="flexEnd"
                display="flex"
                flexDirection="column"
                justifyContent="spaceBetween"
                marginLeft="auto"
              >
                <Tag>{auction.organization.title}</Tag>
                <Text variant="small">{format(date, 'dd.MM.yyyy')}</Text>
              </Box>
            </FocusableBox>
          )
        })}
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
