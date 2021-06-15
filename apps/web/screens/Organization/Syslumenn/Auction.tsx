/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Box, NavigationItem, Tag, Text } from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetAuctionArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { Screen } from '../../../types'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { OrganizationWrapper } from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import getConfig from 'next/config'
import { GET_AUCTION_QUERY } from '@island.is/web/screens/queries/Auction'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { useRouter } from 'next/router'
import { richText, SliceType } from '@island.is/island-ui/contentful'

const { publicRuntimeConfig } = getConfig()

interface AuctionProps {
  organizationPage: Query['getOrganizationPage']
  auction: Query['getAuction']
  namespace: Query['getNamespace']
}

const Auction: Screen<AuctionProps> = ({
  organizationPage,
  auction,
  namespace,
}) => {
  const { disableSyslumennPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { format } = useDateUtils()
  const Router = useRouter()

  const pageUrl = Router.pathname

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active: pageUrl.includes(primaryLink.url),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )
  const date = new Date(auction.date)
  const updatedAt = new Date(auction.updatedAt)

  return (
    <OrganizationWrapper
      pageTitle={`${auction.title} ${format(date, 'd. MMMM yyyy')}`}
      organizationPage={organizationPage}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
        },
        {
          title: n('auctions', 'Uppboð'),
          href: linkResolver('auctions').href,
        },
      ]}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <Box marginBottom={6}>
        <Text variant="eyebrow" color="purple400" marginBottom={1}>
          {n('auctionType-' + auction.type)}
        </Text>
        <Text variant="h1" as="h2" marginBottom={1}>
          {auction.title}
        </Text>
        <Text variant="h3" as="h3" marginBottom={2}>
          {format(date, 'd. MMMM yyyy')}
        </Text>
        <Box marginBottom={4}>
          <Tag disabled>{auction.organization.title}</Tag>
        </Box>
        {richText(auction.content as SliceType[])}
        <Text paddingTop={4} variant="small">
          {n('updatedAt', 'Uppfært')} {format(updatedAt, 'd. MMMM HH:mm')}
        </Text>
      </Box>
    </OrganizationWrapper>
  )
}

Auction.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getAuction },
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
    apolloClient.query<Query, QueryGetAuctionArgs>({
      query: GET_AUCTION_QUERY,
      variables: {
        input: {
          id: query.slug as string,
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

  if (!getAuction) {
    throw new CustomNextError(404, 'Auction not found')
  }

  return {
    organizationPage: getOrganizationPage,
    auction: getAuction,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(Auction, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
