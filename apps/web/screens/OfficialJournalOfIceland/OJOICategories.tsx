import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Divider,
  Inline,
  Input,
  LinkV2,
  Select,
  Stack,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { debounceTime } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  OfficialJournalOfIcelandAdvertCategory,
  OfficialJournalOfIcelandAdvertEntity,
  OfficialJournalOfIcelandAdvertMainCategory,
  Query,
  QueryGetOrganizationArgs,
  QueryOfficialJournalOfIcelandCategoriesArgs,
  QueryOfficialJournalOfIcelandDepartmentsArgs,
  QueryOfficialJournalOfIcelandMainCategoriesArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  emptyOption,
  EntityOption,
  findValueOption,
  mapEntityToOptions,
  OJOIWrapper,
  removeEmptyFromObject,
  sortCategories,
  splitArrayIntoGroups,
} from '../../components/OfficialJournalOfIceland'
import {
  CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { GET_ORGANIZATION_QUERY } from '../queries'
import {
  CATEGORIES_QUERY,
  DEPARTMENTS_QUERY,
  MAIN_CATEGORIES_QUERY,
} from '../queries/OfficialJournalOfIceland'
import { m } from './messages'
type MalaflokkarType = Array<{
  letter: string
  categories: EntityOption[]
}>

const initialState = {
  q: '',
  stafur: '',
  deild: '',
  yfirflokkur: '',
}

const OJOICategoriesPage: CustomScreen<OJOICategoriesProps> = ({
  mainCategories,
  categories,
  departments,
  organization,
  locale,
}) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { linkResolver } = useLinkResolver()

  const baseUrl = linkResolver('ojoihome', [], locale).href
  const searchUrl = linkResolver('ojoisearch', [], locale).href
  const categoriesUrl = linkResolver('ojoicategories', [], locale).href

  const [searchState, setSearchState] = useState(initialState)

  const categoriesOptions = mapEntityToOptions(categories)

  const sortedCategories = useMemo(() => {
    return sortCategories(categoriesOptions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesOptions])

  const filterCategories = useCallback(
    (initial?: boolean) => {
      const filtered: MalaflokkarType = []
      sortedCategories.forEach((cat) => {
        const letter = cat.label.slice(0, 1).toUpperCase()

        const qMatch =
          !initial && searchState.q
            ? cat.label.toLowerCase().includes(searchState.q.toLowerCase())
            : true
        const letterMatch =
          !initial && searchState.stafur
            ? searchState.stafur.split('').includes(letter)
            : true
        const deildMatch =
          !initial && searchState.deild
            ? cat.department?.slug === searchState.deild
            : true
        const flokkurMatch =
          !initial && searchState.yfirflokkur
            ? cat.mainCategory?.slug === searchState.yfirflokkur
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

  const [activeCategories, setCategories] = useState(initialCategories)

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
      title: formatMessage(m.breadcrumb.frontpage),
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: organization?.title ?? '',
      href: baseUrl,
    },
    {
      title: formatMessage(m.categories.breadcrumbTitle),
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

  const departmentsOptions = mapEntityToOptions(departments)
  const mainCategoriesOptions = mapEntityToOptions(mainCategories)

  return (
    <OJOIWrapper
      pageTitle={formatMessage(m.categories.title)}
      pageDescription={formatMessage(m.categories.description)}
      organization={organization ?? undefined}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
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
            <Text variant="h4">{formatMessage(m.categories.searchTitle)}</Text>

            <Input
              name="q"
              placeholder={formatMessage(m.categories.searchPlaceholder)}
              size="xs"
              value={searchState.q}
              onChange={(e) => updateSearchState('q', e.target.value)}
            />

            <Divider weight={'blueberry200'} />

            <Box display="flex" justifyContent={'spaceBetween'}>
              <Text variant="h4">
                {formatMessage(m.categories.filterTitle)}
              </Text>
              <Button
                type="button"
                as="button"
                variant="text"
                onClick={resetFilter}
                size="small"
              >
                {formatMessage(m.categories.clearFilter)}
              </Button>
            </Box>

            <Select
              name="deild"
              label={formatMessage(m.categories.departmentLabel)}
              size="xs"
              placeholder={formatMessage(m.categories.departmentPlaceholder)}
              options={[
                { ...emptyOption(formatMessage(m.categories.departmentAll)) },
                ...departmentsOptions,
              ]}
              isClearable
              value={findValueOption(departmentsOptions, searchState.deild)}
              onChange={(v) => updateSearchState('deild', v?.value ?? '')}
            />

            <Select
              name="yfirflokkur"
              label={formatMessage(m.categories.mainCategoryLabel)}
              size="xs"
              placeholder={formatMessage(m.categories.mainCategoryPlaceholder)}
              options={[
                { ...emptyOption(formatMessage(m.categories.mainCategoryAll)) },
                ...mainCategoriesOptions,
              ]}
              isClearable
              value={findValueOption(
                mainCategoriesOptions,
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
                  : !activeCategories.find((cat) => cat.letter === c.letter)
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
        {activeCategories.length === 0 ? (
          <p>{formatMessage(m.categories.notFoundMessage)}</p>
        ) : (
          activeCategories.map((c) => {
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
                          <LinkV2
                            color="blue400"
                            underline={'normal'}
                            underlineVisibility="always"
                            href={`${searchUrl}?malaflokkur=${cat.value}`}
                          >
                            {cat.label}
                          </LinkV2>
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
    </OJOIWrapper>
  )
}

interface OJOICategoriesProps {
  mainCategories?: OfficialJournalOfIcelandAdvertMainCategory[]
  categories?: Array<OfficialJournalOfIcelandAdvertCategory>
  departments?: Array<OfficialJournalOfIcelandAdvertEntity>
  organization?: Query['getOrganization']
  locale: Locale
}

const OJOICategories: CustomScreen<OJOICategoriesProps> = ({
  mainCategories,
  departments,
  categories,
  organization,
  customPageData,
  locale,
}) => {
  return (
    <OJOICategoriesPage
      mainCategories={mainCategories}
      categories={categories}
      departments={departments}
      organization={organization}
      locale={locale}
      customPageData={customPageData}
    />
  )
}

OJOICategories.getProps = async ({ apolloClient, locale }) => {
  const organizationSlug = 'stjornartidindi'

  const [
    {
      data: { officialJournalOfIcelandMainCategories },
    },
    {
      data: { officialJournalOfIcelandCategories },
    },
    {
      data: { officialJournalOfIcelandDepartments },
    },
    {
      data: { getOrganization },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryOfficialJournalOfIcelandMainCategoriesArgs>({
      query: MAIN_CATEGORIES_QUERY,
      variables: {
        params: {},
      },
    }),
    apolloClient.query<Query, QueryOfficialJournalOfIcelandCategoriesArgs>({
      query: CATEGORIES_QUERY,
      variables: {
        params: {},
      },
    }),
    apolloClient.query<Query, QueryOfficialJournalOfIcelandDepartmentsArgs>({
      query: DEPARTMENTS_QUERY,
      variables: {
        params: {},
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getOrganization?.hasALandingPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    mainCategories: officialJournalOfIcelandMainCategories?.mainCategories,
    categories: officialJournalOfIcelandCategories?.categories,
    departments: officialJournalOfIcelandDepartments?.departments,
    organization: getOrganization,
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OfficialJournalOfIceland,
    OJOICategories,
  ),
)
