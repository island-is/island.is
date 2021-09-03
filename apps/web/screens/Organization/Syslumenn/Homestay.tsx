/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Link,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetHomestaysArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationSubpageArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_HOMESTAYS_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
} from '../../queries'
import { Screen } from '../../../types'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { OrganizationWrapper } from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import getConfig from 'next/config'
import { richText, SliceType } from '@island.is/island-ui/contentful'

const { publicRuntimeConfig } = getConfig()

interface HomestayProps {
  organizationPage: Query['getOrganizationPage']
  subpage: Query['getOrganizationSubpage']
  homestays: Query['getHomestays']
  namespace: Query['getNamespace']
}

const Homestay: Screen<HomestayProps> = ({
  organizationPage,
  subpage,
  homestays,
  namespace,
}) => {
  const { disableSyslumennPage: disablePage } = publicRuntimeConfig
  /*
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }
  */

  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const pageUrl = `/s/syslumenn/heimagisting`

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
        active: url === pageUrl,
      })),
    }),
  )

  const [showCount, setShowCount] = useState(10)
  const [query, _setQuery] = useState(' ')

  const setQuery = (query: string) => _setQuery(query.toLowerCase())

  useEffect(() => {
    setQuery('')
  }, [])

  const filteredItems = homestays.filter(
    (homestay) =>
      homestay.address?.toLowerCase().includes(query) ||
      homestay.city?.toLowerCase().includes(query) ||
      homestay.manager?.toLowerCase().includes(query) ||
      homestay.name?.toLowerCase().includes(query) ||
      homestay.registrationNumber?.toLowerCase().includes(query),
  )

  return (
    <OrganizationWrapper
      pageTitle={subpage.title}
      organizationPage={organizationPage}
      pageFeaturedImage={subpage.featuredImage}
      minimal={disablePage === 'true'}
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
          value={query}
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
              {homestay.address}
            </Text>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <Text>{homestay.registrationNumber}</Text>
                <Text>{homestay.name}</Text>
                <Text>{homestay.city}</Text>
                <Text>{homestay.manager}</Text>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <Text>
                  Fasteignanúmer:{' '}
                  <Link
                    href={`https://leyfi.island.is/Home/OpenSkraFastNR?fastnr=${homestay.propertyId}`}
                  >
                    {homestay.propertyId}
                  </Link>
                </Text>
                <Text>
                  {n('homestayApartmentNo', 'Íbúð')}: {homestay.apartmentId}
                </Text>
                <Text>
                  {n('homestayGuests', 'Gestir')}: {homestay.guests}
                </Text>
                <Text>
                  {n('homestayRooms', 'Herbergi')}: {homestay.rooms}
                </Text>
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

Homestay.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationSubpage },
    },
    {
      data: { getHomestays },
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
          slug: 'heimagisting',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetHomestaysArgs>({
      query: GET_HOMESTAYS_QUERY,
      variables: {
        input: {},
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
    homestays: getHomestays,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(Homestay, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
