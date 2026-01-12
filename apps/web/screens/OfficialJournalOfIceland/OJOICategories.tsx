import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import debounce from 'lodash/debounce'
import flatMap from 'lodash/flatMap'
import uniqBy from 'lodash/uniqBy'
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
  getStringArrayFromQueryString,
  getStringFromQueryString,
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
import { ORGANIZATION_SLUG } from './constants'
import { m } from './messages'
type MalaflokkarType = Array<{
  letter: string
  categories: EntityOption[]
}>

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

  const [search, setSearch] = useState(getStringFromQueryString(router.query.q))
  const [queryLetters, setQueryLetters] = useState(
    getStringArrayFromQueryString(router.query.stafur),
  )
  const [queryDepartment, setQueryDepartment] = useState(
    getStringFromQueryString(router.query.deild),
  )
  const [queryMainCateogry, setQueryMainCategory] = useState(
    getStringFromQueryString(router.query.yfirflokkur),
  )

  const filteredData = useMemo(() => {
    let filtered = categories
    let filteredMain = mainCategories

    if (queryDepartment) {
      const found = departments?.find((c) => c.slug === queryDepartment)
      filteredMain = mainCategories?.filter(
        (category) => category.departmentId === found?.id,
      )
      const filteredMainCategories: OfficialJournalOfIcelandAdvertCategory[] =
        uniqBy(flatMap(filteredMain, 'categories'), 'id')

      if (filteredMainCategories.length) {
        filtered = filteredMainCategories
      }
    }

    if (queryMainCateogry) {
      const found = filteredMain?.find((c) => c.slug === queryMainCateogry)

      if (found) {
        const subCategorySlugs = found.categories?.map((c) => c.slug)
        filtered = filtered.filter((c) => subCategorySlugs?.includes(c.slug))
      }
    }

    if (search) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (queryLetters.length > 0) {
      filtered = filtered.filter((c) =>
        queryLetters.includes(c.title.charAt(0)),
      )
    }

    const letters = categories
      .map((c) => c.title.charAt(0))
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort()

    const groupedByLetter = letters.reduce((acc, letter) => {
      const letterCategories = filtered.filter(
        (c) => c.title.charAt(0) === letter,
      )
      acc.push({
        letter,
        categories: sortCategories(
          letterCategories.map((c) => ({ label: c.title, value: c.slug })),
        ),
      })
      return acc
    }, [] as MalaflokkarType)

    return {
      categories: filtered.map((c) => ({
        ...c,
        letter: c.title.charAt(0),
      })),
      mainCategories: filteredMain,
      group: groupedByLetter,
      letters: letters,
    }
  }, [
    categories,
    mainCategories,
    search,
    queryLetters,
    queryDepartment,
    queryMainCateogry,
  ])

  const onDepartmentChange = (value?: string) => {
    setQueryDepartment(value)
    router.replace(
      {
        pathname: categoriesUrl,
        query: removeEmptyFromObject({
          ...router.query,
          deild: value,
        }),
      },
      undefined,
      { shallow: true },
    )
  }

  const onMainCategoryChange = (value?: string) => {
    setQueryMainCategory(value)
    router.replace(
      {
        pathname: categoriesUrl,
        query: removeEmptyFromObject({
          ...router.query,
          yfirflokkur: value,
        }),
      },
      undefined,
      { shallow: true },
    )
  }

  const toggleLetter = (letter: string) => {
    const found = queryLetters.includes(letter)
    if (found) {
      setQueryLetters(queryLetters.filter((l) => l !== letter))
      router.replace(
        {
          pathname: categoriesUrl,
          query: removeEmptyFromObject({
            ...router.query,
            stafur: queryLetters.filter((l) => l !== letter).join(','),
          }),
        },
        undefined,
        { shallow: true },
      )
    } else {
      setQueryLetters([...queryLetters, letter])
      router.replace(
        {
          pathname: categoriesUrl,
          query: removeEmptyFromObject({
            ...router.query,
            stafur: [...queryLetters, letter].join(','),
          }),
        },
        undefined,
        { shallow: true },
      )
    }
  }

  const onDebouncedSearchChange = debounce((value: string) => {
    router.replace(
      {
        pathname: categoriesUrl,
        query: removeEmptyFromObject({
          ...router.query,
          q: value,
        }),
      },
      undefined,
      { shallow: true },
    )
  }, 300)

  const resetFilter = () => {
    setSearch('')
    setQueryLetters([])
    setQueryDepartment('')
    setQueryMainCategory('')

    router.replace(categoriesUrl, undefined, { shallow: true })
  }

  const departmentsOptions = mapEntityToOptions(departments)
  const mainCategoriesOptions = mapEntityToOptions(
    filteredData.mainCategories ?? mainCategories,
  )

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
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                onDebouncedSearchChange(e.target.value)
              }}
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
              value={findValueOption(departmentsOptions, queryDepartment)}
              onChange={(v) => onDepartmentChange(v?.value)}
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
              value={findValueOption(mainCategoriesOptions, queryMainCateogry)}
              onChange={(v) => onMainCategoryChange(v?.value)}
            />
          </Stack>
        </Box>
      }
      breadcrumbItems={breadcrumbItems}
    >
      <Stack space={[3, 4, 6]}>
        <Inline space={1}>
          {filteredData.letters.map((letter) => {
            const isActive = queryLetters.includes(letter)
            const isDisabled = !filteredData.categories.find(
              (cat) => cat.letter === letter,
            )
            return (
              <Tag
                key={letter}
                active={isActive}
                onClick={() => {
                  toggleLetter(letter)
                }}
                variant={isActive ? 'blue' : isDisabled ? 'disabled' : 'white'}
                outlined={!isActive}
              >
                {'\u00A0'}
                {letter.toUpperCase()}
                {'\u00A0'}
              </Tag>
            )
          })}
        </Inline>
        {filteredData.categories.length === 0 ? (
          <p>{formatMessage(m.categories.notFoundMessage)}</p>
        ) : (
          filteredData.group?.map((group) => {
            const groups = splitArrayIntoGroups(group.categories, 3)
            return (
              group.categories.length > 0 && (
                <T.Table key={group.letter}>
                  <T.Head>
                    <T.Row>
                      <T.HeadData colSpan={3}>{group.letter}</T.HeadData>
                    </T.Row>
                  </T.Head>
                  <T.Body>
                    {groups.map((grp, i) => (
                      <T.Row key={i}>
                        {grp.map((cat) => (
                          <T.Data key={`d-${cat.value}`}>
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
            )
          })
        )}
      </Stack>
    </OJOIWrapper>
  )
}

interface OJOICategoriesProps {
  mainCategories?: OfficialJournalOfIcelandAdvertMainCategory[]
  categories: Array<OfficialJournalOfIcelandAdvertCategory>
  departments: Array<OfficialJournalOfIcelandAdvertEntity>
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
        params: {
          pageSize: 1000,
          page: 1,
        },
      },
    }),
    apolloClient.query<Query, QueryOfficialJournalOfIcelandCategoriesArgs>({
      query: CATEGORIES_QUERY,
      variables: {
        params: {
          pageSize: 1000,
          page: 1,
        },
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
          slug: ORGANIZATION_SLUG,
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
