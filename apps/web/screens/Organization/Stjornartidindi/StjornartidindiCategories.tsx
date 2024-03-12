import { useCallback, useEffect, useMemo, useState } from 'react'
import { Locale } from 'locale'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Divider,
  Inline,
  Input,
  Link,
  Select,
  Stack,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { debounceTime } from '@island.is/shared/constants'
import { sortAlpha } from '@island.is/shared/utils'
import { getThemeConfig } from '@island.is/web/components'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  baseUrl,
  categoriesUrl,
  deildOptions,
  emptyOption,
  findValueOption,
  malaflokkurOptions,
  removeEmptyFromObject,
  searchUrl,
  splitArrayIntoGroups,
  StjornartidindiWrapper,
  yfirflokkurOptions,
} from '../../../components/Stjornartidindi'
import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'

type MalaflokkarType = Array<{
  letter: string
  categories: typeof malaflokkurOptions
}>

const initialState = {
  q: '',
  stafur: '',
  deild: '',
  yfirflokkur: '',
}

const sortCategories = (cats: typeof malaflokkurOptions) => {
  // Sort pages by importance (which defaults to 0).
  // If both pages being compared have the same importance we sort by comparing their titles.
  return cats.sort((a, b) => {
    return sortAlpha('label')(a, b)
  })
}

const StjornartidindiCategoriesPage: Screen<StjornartidindiCategoriesProps> = ({
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  const router = useRouter()
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  useContentfulId(organizationPage?.id)

  const organizationNamespace = useMemo(() => {
    return JSON.parse(organization?.namespace?.fields || '{}')
  }, [organization?.namespace?.fields])

  const o = useNamespace(organizationNamespace)

  const [searchState, setSearchState] = useState(initialState)

  const sortedCategories = useMemo(() => {
    return sortCategories(malaflokkurOptions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [malaflokkurOptions])

  const filterCategories = useCallback(
    (initial?: boolean) => {
      const filtered: MalaflokkarType = []
      sortedCategories.forEach((cat) => {
        const letter = cat.label.slice(0, 1).toUpperCase()

        const qMatch =
          !initial && searchState.q
            ? cat.label.toLowerCase().includes(searchState.q.toLowerCase())
            : true
        console.log({ g: searchState.stafur.split('').includes(letter) })

        const letterMatch =
          !initial && searchState.stafur
            ? searchState.stafur.split('').includes(letter)
            : true
        const deildMatch =
          !initial && searchState.deild ? cat.deild === searchState.deild : true
        const flokkurMatch =
          !initial && searchState.yfirflokkur
            ? cat.yfirflokkur === searchState.yfirflokkur
            : true

        if (qMatch && letterMatch && deildMatch && flokkurMatch) {
          if (!filtered.find((f) => f.letter === letter)) {
            filtered.push({ letter, categories: [cat] })
          } else {
            filtered.find((f) => f.letter === letter)?.categories.push(cat)
          }
        }
      })

      return filtered
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [searchState, sortedCategories],
  )

  const initialCategories = useMemo(() => {
    return filterCategories(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedCategories])

  const [categories, setCategories] = useState(initialCategories)

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)
    setSearchState({
      q: searchParams.get('q') ?? '',
      stafur: searchParams.get('stafur') ?? '',
      deild: searchParams.get('deild') ?? '',
      yfirflokkur: searchParams.get('yfirflokkur') ?? '',
    })
  }, [])

  useEffect(() => {
    if (
      searchState.q ||
      searchState.stafur ||
      searchState.deild ||
      searchState.yfirflokkur
    ) {
      setCategories(filterCategories())
    } else {
      setCategories(initialCategories)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState])

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: organizationPage?.title ?? '',
      href: linkResolver(
        'organizationpage',
        [organizationPage?.slug ?? ''],
        locale,
      ).href,
    },
    {
      title: 'Málaflokkar',
    },
  ]

  const updateSearchParams = useMemo(() => {
    return debounce((state: Record<string, string>) => {
      router.replace(
        categoriesUrl,
        {
          query: removeEmptyFromObject(state),
        },
        { shallow: true },
      )
    }, debounceTime.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateSearchState = (key: string, value: string) => {
    const newState = {
      ...searchState,
      [key]: value,
    }
    setSearchState(newState)
    updateSearchParams(newState)
  }

  const toggleLetter = (letter: string) => {
    let letters = searchState.stafur.split('')
    if (letters.includes(letter)) {
      letters = letters.filter((l) => l !== letter)
    } else {
      letters.push(letter)
    }
    updateSearchState('stafur', letters.join(''))
  }

  const resetFilter = () => {
    setSearchState(initialState)
    updateSearchParams(initialState)
  }

  return (
    <StjornartidindiWrapper
      pageTitle={'Málaflokkar Stjórnartíðinda'}
      pageDescription={organizationPage?.description}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      organizationPage={organizationPage!}
      pageFeaturedImage={organizationPage?.featuredImage ?? undefined}
      goBackUrl={baseUrl}
      sidebarContent={
        <Box
          component="form"
          background="blue100"
          padding={[2, 2, 3]}
          borderRadius="large"
          action={categoriesUrl}
        >
          <Stack space={[1, 1, 2]}>
            <Text variant="h4">Leit</Text>

            <Input
              name="q"
              placeholder="Leit í flokkum"
              size="xs"
              value={searchState.q}
              onChange={(e) => updateSearchState('q', e.target.value)}
            />

            <Divider weight={'blueberry200'} />

            <Box display="flex" justifyContent={'spaceBetween'}>
              <Text variant="h4">Síun</Text>
              <Button
                type="button"
                as="button"
                variant="text"
                onClick={resetFilter}
                size="small"
              >
                Hreinsa síun
              </Button>
            </Box>

            <Select
              name="deild"
              label="Deild"
              size="xs"
              placeholder="Veldu deild"
              options={[{ ...emptyOption('Allar deildir') }, ...deildOptions]}
              isClearable
              value={findValueOption(deildOptions, searchState.deild)}
              onChange={(v) => updateSearchState('deild', v?.value ?? '')}
            />

            <Select
              name="yfirflokkur"
              label="Yfirflokkur"
              size="xs"
              placeholder="Veldu yfirflokk"
              options={[
                { ...emptyOption('Allir flokkar') },
                ...yfirflokkurOptions,
              ]}
              isClearable
              value={findValueOption(
                yfirflokkurOptions,
                searchState.yfirflokkur,
              )}
              onChange={(v) => updateSearchState('yfirflokkur', v?.value ?? '')}
            />
          </Stack>
        </Box>
      }
      breadcrumbItems={breadcrumbItems}
    >
      <Stack space={[3, 4, 6]}>
        <Inline space={1}>
          {initialCategories.map((c) => (
            <Tag
              key={c.letter}
              active={searchState.stafur.includes(c.letter)}
              onClick={() => {
                toggleLetter(c.letter)
              }}
              variant={
                searchState.stafur.includes(c.letter)
                  ? 'blue'
                  : !categories.find((cat) => cat.letter === c.letter)
                  ? 'disabled'
                  : 'white'
              }
              outlined={searchState.stafur.includes(c.letter) ? false : true}
            >
              {'\u00A0'}
              {c.letter}
              {'\u00A0'}
            </Tag>
          ))}
        </Inline>
        {categories.length === 0 ? (
          <p>Ekkert fannst fyrir þessi leitarskilyrði</p>
        ) : (
          categories.map((c) => {
            const groups = splitArrayIntoGroups(c.categories, 3)
            return (
              <T.Table key={c.letter}>
                <T.Head>
                  <T.Row>
                    <T.HeadData colSpan={3}>{c.letter}</T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {groups.map((group) => (
                    <T.Row key={group[0].label}>
                      {group.map((cat) => (
                        <T.Data key={cat.label}>
                          <Link
                            color="blue400"
                            underline={'normal'}
                            underlineVisibility="always"
                            href={`${searchUrl}?malaflokkur=${cat.value}`}
                          >
                            {cat.label}
                          </Link>
                        </T.Data>
                      ))}
                    </T.Row>
                  ))}
                </T.Body>
              </T.Table>
            )
          })
        )}
      </Stack>
    </StjornartidindiWrapper>
  )
}

interface StjornartidindiCategoriesProps {
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
  namespace: Record<string, string>
  locale: Locale
}

const StjornartidindiCategories: Screen<StjornartidindiCategoriesProps> = ({
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  return (
    <StjornartidindiCategoriesPage
      namespace={namespace}
      organizationPage={organizationPage}
      organization={organization}
      locale={locale}
    />
  )
}

StjornartidindiCategories.getProps = async ({ apolloClient, locale }) => {
  const organizationSlug = 'stjornartidindi'

  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganization },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OrganizationPages',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationPage && !getOrganization?.hasALandingPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    namespace,
    locale: locale as Locale,
    showSearchInHeader: false,
    ...getThemeConfig(
      getOrganizationPage?.theme ?? 'landing_page',
      getOrganization ?? getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(StjornartidindiCategories)
