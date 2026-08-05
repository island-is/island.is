import { useMemo, useState } from 'react'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  ColorSchemeContext,
  FilterInput,
  GridColumn,
  GridContainer,
  GridRow,
  Pagination,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { helperStyles } from '@island.is/island-ui/theme'
import { sortAlpha } from '@island.is/shared/utils'
import { HeadWithSocialSharing } from '@island.is/web/components'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationsArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { getOrganizationLink } from '@island.is/web/utils/organization'

import { CustomNextError } from '../../units/errors'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATIONS_QUERY } from '../queries'
import { OrganizationCard } from './OrganizationCard'
import * as styles from './Organizations.css'

const CARDS_PER_PAGE = 18

const ALPHABET_RANGES: ReadonlyArray<{
  label: string
  chars: ReadonlyArray<string> | null
}> = [
  { label: 'Allt', chars: null },
  { label: 'A - C', chars: ['A', 'Á', 'B', 'C'] },
  { label: 'D - F', chars: ['D', 'Ð', 'E', 'É', 'F'] },
  { label: 'G - I', chars: ['G', 'H', 'I', 'Í'] },
  { label: 'J - L', chars: ['J', 'K', 'L'] },
  { label: 'M - O', chars: ['M', 'N', 'O', 'Ó'] },
  { label: 'P - S', chars: ['P', 'Q', 'R', 'S'] },
  { label: 'T - V', chars: ['T', 'U', 'Ú', 'V'] },
  { label: 'X - Þ', chars: ['W', 'X', 'Y', 'Ý', 'Z', 'Þ'] },
  { label: 'Æ - Ö', chars: ['Æ', 'Ö'] },
]

interface OrganizationProps {
  organizations: Query['getOrganizations']
  namespace: Query['getNamespace']
}

const OrganizationPage: Screen<OrganizationProps> = ({
  organizations,
  namespace,
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const [page, setPage] = useState<number>(1)
  const { linkResolver } = useLinkResolver()
  const { activeLocale } = useI18n()

  const [searchInput, setSearchInput] = useState('')
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(0)

  const sortedItems = useMemo(
    () => [...organizations.items].sort(sortAlpha('title')),
    [organizations],
  )

  const filteredItems = useMemo(() => {
    let items = sortedItems

    const { chars } = ALPHABET_RANGES[selectedRangeIndex]
    if (chars) {
      items = items.filter((x) =>
        chars.includes(x.title.charAt(0).toUpperCase()),
      )
    }

    if (searchInput) {
      const query = searchInput.trim().toLowerCase()
      items = items.filter((x) => x.title.trim().toLowerCase().includes(query))
    }

    return items
  }, [sortedItems, selectedRangeIndex, searchInput])

  const count = filteredItems.length
  const totalPages = Math.max(1, Math.ceil(count / CARDS_PER_PAGE))
  const base = page === 1 ? 0 : (page - 1) * CARDS_PER_PAGE
  const visibleItems = filteredItems.slice(base, page * CARDS_PER_PAGE)

  const goToPage = (newPage = 1, scrollTop = true) => {
    setPage(newPage)
    if (scrollTop) {
      window.scrollTo(0, 0)
    }
  }

  const metaTitle = `${n(
    'stofnanirHeading',
    'Stofnanir Íslenska Ríkisins',
  )} | Ísland.is`

  const inputPlaceholder = n('filterBySearchQuery', 'Sía eftir leitarorði')

  return (
    <>
      <HeadWithSocialSharing title={metaTitle} />
      <Box paddingTop={[2, 2, 2, 8]} paddingBottom={[4, 4, 4, 8]}>
        <GridContainer className={styles.listContainer}>
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', '1/12']}
              span={['12/12', '12/12', '12/12', '10/12']}
            >
              <Stack space={2}>
                <Breadcrumbs
                  items={[
                    {
                      title: 'Ísland.is',
                      href: '/',
                    },
                    {
                      title: n('organizations', 'Stofnanir'),
                    },
                  ]}
                  renderLink={(link) => {
                    return (
                      <NextLink
                        {...linkResolver('homepage')}
                        passHref
                        legacyBehavior
                      >
                        {link}
                      </NextLink>
                    )
                  }}
                />
                <Text variant="h1" as="h1" className={styles.heading}>
                  {n('stofnanirHeading', 'Stofnanir Íslenska Ríkisins')}
                </Text>
                <Text variant="intro" className={styles.description}>
                  {n(
                    'stofnanirDescription',
                    'Listi yfir opinbera aðila og sveitarfélög ásamt tengiliðaupplýsingum og þjónustuyfirlit.',
                  )}
                </Text>
              </Stack>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>

      <Box background="blue100" display="inlineBlock" width="full">
        <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
          <GridContainer
            id="organizations-list"
            className={styles.listContainer}
          >
            <Box paddingTop={[4, 4, 8]} paddingBottom={[5, 5, 8]}>
              <Box className={styles.filterBar}>
                <Box className={styles.searchContainer}>
                  <FilterInput
                    name="filter-input"
                    placeholder={inputPlaceholder}
                    value={searchInput}
                    onChange={(value) => {
                      setSearchInput(value)
                      goToPage(1, false)
                    }}
                    backgroundColor="white"
                  />
                </Box>
                <Box className={styles.tagList}>
                  {ALPHABET_RANGES.map((range, index) => (
                    <Tag
                      key={range.label}
                      variant="blue"
                      active={selectedRangeIndex === index}
                      outlined
                      onClick={() => {
                        setSelectedRangeIndex(index)
                        goToPage(1, false)
                      }}
                    >
                      {index === 0
                        ? n('organizationsFilterAll', 'Allt')
                        : range.label}
                    </Tag>
                  ))}
                </Box>
              </Box>
            </Box>

            <GridRow>
              {visibleItems.map((organization) => {
                const tags =
                  organization?.tag &&
                  organization.tag.map((x) => ({
                    id: x.id,
                    label: x.title,
                  }))

                return (
                  <GridColumn
                    key={organization.slug}
                    span={['12/12', '6/12', '6/12', '4/12']}
                    paddingBottom={3}
                  >
                    <OrganizationCard
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore make web strict
                      href={getOrganizationLink(organization, activeLocale)}
                      heading={organization?.title}
                      {...(tags?.length && { tags })}
                      {...(organization?.logo?.url && {
                        src: organization.logo.url,
                        alt: organization.logo.title,
                      })}
                    />
                  </GridColumn>
                )
              })}
            </GridRow>
            <GridRow>
              <GridColumn span="12/12">
                <Box paddingBottom={8} paddingTop={5}>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    variant="blue"
                    renderLink={(page, className, children) => (
                      <button
                        onClick={() => {
                          goToPage(page)
                        }}
                      >
                        <span className={helperStyles.srOnly}>
                          {n('page', 'Síða')}
                        </span>
                        <span className={className}>{children}</span>
                      </button>
                    )}
                  />
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </ColorSchemeContext.Provider>
      </Box>
    </>
  )
}

OrganizationPage.getProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getOrganizations },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationsArgs>({
      query: GET_ORGANIZATIONS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Vidspyrna',
            lang: locale,
          },
        },
      })
      .then((content) =>
        content.data.getNamespace?.fields
          ? JSON.parse(content.data.getNamespace.fields)
          : {},
      ),
  ])

  // we assume 404 if no Organization is found
  if (!getOrganizations) {
    throw new CustomNextError(404, 'Þessi síða fannst ekki!')
  }

  return {
    organizations: {
      __typename: getOrganizations.__typename,
      items: getOrganizations.items.filter(
        (o) => o.showsUpOnTheOrganizationsPage,
      ),
    },
    namespace,
  }
}

export default withMainLayout(OrganizationPage, {
  showFooterIllustration: true,
})
