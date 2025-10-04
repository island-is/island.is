/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  LinkContext,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  OrganizationWrapper,
  SyslumennListCsvExport,
  Webreader,
} from '@island.is/web/components'
import {
  ContentLanguage,
  Query,
  QueryGetHomestaysArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationSubpageArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'
import { safelyExtractPathnameFromUrl } from '@island.is/web/utils/safelyExtractPathnameFromUrl'

import { Screen } from '../../../types'
import {
  GET_HOMESTAYS_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
} from '../../queries'

const PAGE_SIZE = 10
const CSV_COLUMN_SEPARATOR = ','
const CSV_ROW_SEPARATOR = '\n'

const csvColumnSeparatorSafeValue = (value: string): string => {
  /**
   * Note:
   *    This handles the case if the value it self contains the CSV column separator character.
   *    E.g. in many cases, the address field contains ','.
   */
  return value?.includes(CSV_COLUMN_SEPARATOR) ? `"${value}"` : value
}

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
  useContentfulId(organizationPage?.id, subpage?.id)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const Router = useRouter()

  const pageUrl = Router.pathname

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const navList: NavigationItem[] = organizationPage?.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active:
        primaryLink?.url === pageUrl ||
        childrenLinks.some((link) => link.url === pageUrl),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url === pageUrl,
      })),
    }),
  )

  const [showCount, setShowCount] = useState(PAGE_SIZE)
  const [query, _setQuery] = useState(' ')

  const setQuery = (query: string) => _setQuery(query.toLowerCase())

  const csvStringProvider = () => {
    return new Promise<string>((resolve, reject) => {
      if (homestays) {
        // CSV Header row
        const headerRow = [
          'Skráningarnúmer',
          'Heiti heimagistingar',
          'Heimilisfang',
          'Íbúðanúmer',
          'Sveitarfélag',
          'Fastanúmer',
          'Ábyrgðarmaður',
          'Umsóknarár',
          'Fjöldi gesta',
          'Fjöldi herbergja',
        ].join(CSV_COLUMN_SEPARATOR)
        const rows = [headerRow]

        // CSV Value rows
        for (const homestay of homestays) {
          const columnValues = [
            homestay.registrationNumber,
            homestay.name,
            homestay.address,
            homestay.apartmentId,
            homestay.city,
            homestay.propertyId,
            homestay.manager,
            homestay.year?.toString(),
            homestay.guests?.toString(),
            homestay.rooms?.toString(),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
          ].map((x) => csvColumnSeparatorSafeValue(x))
          rows.push(columnValues.join(CSV_COLUMN_SEPARATOR))
        }

        return resolve(rows.join(CSV_ROW_SEPARATOR))
      }
      reject('Homestay data has not been loaded.')
    })
  }

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
      pageTitle={subpage?.title ?? ''}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organizationPage={organizationPage}
      showReadSpeaker={false}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      pageFeaturedImage={
        subpage?.featuredImage ?? organizationPage?.featuredImage
      }
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage?.title || '',
          href: linkResolver('organizationpage', [organizationPage?.slug ?? ''])
            .href,
        },
      ]}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <Box paddingBottom={0}>
        <Text variant="h1" as="h2">
          {subpage?.title}
        </Text>
        <Webreader
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          readId={null}
          readClass="rs_read"
        />
      </Box>
      {webRichText(subpage?.description as SliceType[])}
      <Box marginTop={4} marginBottom={6}>
        <Input
          name="homestaySearchInput"
          placeholder={n('homestayFilterSearch', 'Leita')}
          backgroundColor={['blue', 'blue', 'white']}
          size="sm"
          icon={{ name: 'search', type: 'outline' }}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Box textAlign="right" marginRight={1} marginTop={1}>
          <SyslumennListCsvExport
            defaultLabel={n(
              'homestayCSVButtonLabelDefault',
              'Sækja allar skráningar (CSV)',
            )}
            loadingLabel={n(
              'homestayCSVButtonLabelLoading',
              'Sæki allar skráningar...',
            )}
            errorLabel={n(
              'homestayCSVButtonLabelError',
              'Ekki tókst að sækja skráningar, reyndu aftur',
            )}
            csvFilenamePrefix={n(
              'homestayCSVFileTitlePrefix',
              'Heimagistingar',
            )}
            csvStringProvider={csvStringProvider}
          />
        </Box>
      </Box>
      {filteredItems.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">
            {n('homestayNoSearchResults', 'Engar heimagistingar fundust.')}
          </Text>
        </Box>
      )}
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
                <LinkContext.Provider
                  value={{
                    linkRenderer: (href, children) => (
                      <a
                        style={{
                          color: theme.color.blue400,
                        }}
                        href={href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  <Text>
                    {n('homestayRealEstateNumberPrefix', 'Fasteign nr.')}{' '}
                    {homestay.propertyId}
                  </Text>
                </LinkContext.Provider>
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
          <Button onClick={() => setShowCount(showCount + PAGE_SIZE)}>
            {n('seeMore', 'Sjá meira')} ({filteredItems.length - showCount})
          </Button>
        )}
      </Box>
    </OrganizationWrapper>
  )
}

Homestay.getProps = async ({ apolloClient, locale, req }) => {
  const pathname = safelyExtractPathnameFromUrl(req.url)
  const path = pathname?.split('/') ?? []
  const slug = path?.[path.length - 2] ?? 'syslumenn'
  const subSlug = path.pop() ?? 'heimagisting'

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
          slug: slug,
          lang: locale as ContentLanguage,
          subpageSlugs: [subSlug],
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug: slug,
          slug: subSlug,
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
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationSubpage) {
    throw new CustomNextError(404, 'Organization subpage not found')
  }

  const usingDefaultHeader: boolean = namespace['usingDefaultHeader'] ?? false

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    homestays: getHomestays,
    namespace,
    showSearchInHeader: false,
    themeConfig: !usingDefaultHeader
      ? {
          headerButtonColorScheme: 'negative',
          headerColorScheme: 'white',
        }
      : {},
  }
}

export default withMainLayout(Homestay, {
  footerVersion: 'organization',
})
