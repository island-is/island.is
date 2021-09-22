/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetOperatingLicensesArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationSubpageArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
  GET_OPERATING_LICENSES_QUERY,
} from '../../queries'
import { Screen } from '../../../types'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { OrganizationWrapper } from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { useRouter } from 'next/router'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

interface OperatingLicensesProps {
  organizationPage: Query['getOrganizationPage']
  subpage: Query['getOrganizationSubpage']
  operatingLicenses: Query['getOperatingLicenses']
  namespace: Query['getNamespace']
}

const PAGE_SIZE = 30

const OperatingLicenses: Screen<OperatingLicensesProps> = ({
  organizationPage,
  subpage,
  operatingLicenses,
  namespace,
}) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const Router = useRouter()
  const { format } = useDateUtils()

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

  const [showCount, setShowCount] = useState(10)
  const [query, _setQuery] = useState(' ')

  useEffect(() => {
    setQuery('')
  }, [])

  const setQuery = (query: string) => _setQuery(query.toLowerCase())

  const filteredItems = operatingLicenses.results
    .filter(
      (homestay) =>
        homestay.name?.toLowerCase().includes(query) ||
        homestay.location?.toLowerCase().includes(query) ||
        homestay.licenseHolder?.toLowerCase().includes(query) ||
        homestay.licenseNumber?.toLowerCase().includes(query),
    )
    .sort((a, b) => a.name?.localeCompare(b.name))

  return (
    <OrganizationWrapper
      pageTitle={subpage.title}
      organizationPage={organizationPage}
      pageFeaturedImage={subpage.featuredImage}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
        },
      ]}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <Box paddingBottom={4}>
        <Text variant="h1" as="h2">
          {subpage.title}
        </Text>
      </Box>
      {richText(subpage.description as SliceType[])}
      <Box
        background="blue100"
        borderRadius="large"
        paddingX={4}
        paddingY={3}
        marginTop={4}
        marginBottom={4}
      >
        <Input
          name="homestaySearchInput"
          placeholder={n('filterSearch', 'Leita')}
          backgroundColor={['blue', 'blue', 'white']}
          size="sm"
          icon="search"
          iconType="outline"
          onChange={(event) => setQuery(event.target.value)}
        />
      </Box>
      {filteredItems.slice(0, showCount).map((homestay, index) => {
        return (
          <Box
            key={index}
            border="standard"
            borderRadius="large"
            marginY={2}
            paddingY={3}
            paddingX={4}
          >
            <Text variant="h4" color="blue400" marginBottom={1}>
              {homestay.name ? homestay.name : homestay.location}
            </Text>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12']}>
                <Text>Leyfisnúmer: {homestay.licenseNumber}</Text>
                <Text>Staður: {homestay.location}</Text>
                <Text>Gata: {homestay.street}</Text>
                {homestay.postalCode && (
                  <Text>Póstnúmer: {homestay.postalCode}</Text>
                )}
                {homestay.validUntil && (
                  <Text>
                    Gildir til{' '}
                    {format(new Date(homestay.validUntil), 'd. MMMM yyyy')}
                  </Text>
                )}
                <Text>{homestay.type}</Text>
                <Text>{homestay.category}</Text>
                <Text>Útgefandi: {homestay.issuedBy}</Text>
                <Text>Leyfishafi: {homestay.licenseHolder}</Text>
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box
        display="flex"
        justifyContent="center"
        marginY={3}
        textAlign="center"
      >
        {showCount < filteredItems.length && (
          <Button onClick={() => setShowCount(showCount + 10)}>
            {n('seeMore', 'Sjá meira')} ({filteredItems.length - showCount})
          </Button>
        )}
      </Box>
    </OrganizationWrapper>
  )
}

OperatingLicenses.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationSubpage },
    },
    {
      data: { getOperatingLicenses },
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
    apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug: 'syslumenn',
          slug: 'rekstrarleyfi',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOperatingLicensesArgs>({
      query: GET_OPERATING_LICENSES_QUERY,
      variables: {
        input: {
          pageNumber: 1,
          pageSize: PAGE_SIZE,
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

  if (!getOrganizationSubpage) {
    throw new CustomNextError(404, 'Organization subpage not found')
  }

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    operatingLicenses: getOperatingLicenses,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(OperatingLicenses, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
