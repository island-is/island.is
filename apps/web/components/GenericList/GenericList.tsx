import { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { Locale } from 'locale'
import flatten from 'lodash/flatten'
import { useRouter } from 'next/router'
import { parseAsInteger, parseAsJson, useQueryState } from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Filter,
  FilterInput,
  FilterMultiChoice,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Pagination,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  GenericListItem,
  GenericListItemResponse,
  GenericTag,
  GetGenericListItemsQueryVariables,
  Query,
} from '@island.is/web/graphql/schema'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import {
  extractFilterTags,
  getFilterCategories,
  getGenericTagGroupHierarchy,
} from '@island.is/web/screens/Organization/PublishedMaterial/utils'
import { GET_GENERIC_LIST_ITEMS_QUERY } from '@island.is/web/screens/queries/GenericList'
import { webRichText } from '@island.is/web/utils/richText'

import { FilterTag } from '../FilterTag'

const DEBOUNCE_TIME_IN_MS = 300
const ITEMS_PER_PAGE = 10

const getResultsFoundText = (totalItems: number, locale: Locale) => {
  const singular = locale === 'is' ? 'niðurstaða fannst' : 'result found'
  const plural = locale === 'is' ? 'niðurstöður fundust' : 'results found'

  if (locale !== 'is') {
    if (totalItems === 1) {
      return singular
    }
    return plural
  }

  // Handle Icelandic locale specifically
  if (totalItems % 10 === 1 && totalItems % 100 !== 11) {
    return singular
  }

  return plural
}

interface ItemProps {
  item: GenericListItem
}

const NonClickableItem = ({ item }: ItemProps) => {
  const { format } = useDateUtils()

  return (
    <Box
      padding={[2, 2, 3]}
      border="standard"
      borderRadius="large"
      height="full"
    >
      <Stack space={3}>
        <Stack space={0}>
          <Stack space={0}>
            <Text variant="eyebrow" color="purple400">
              {item.date && format(new Date(item.date), 'dd.MM.yyyy')}
            </Text>
            <Text variant="h3" as="span" color="dark400">
              {item.title}
            </Text>
          </Stack>
          {item.cardIntro?.length > 0 && (
            <Box>{webRichText(item.cardIntro ?? [])}</Box>
          )}
        </Stack>
        <Inline space={1}>
          {item.filterTags?.map((tag) => (
            <Tag disabled={true} variant="purple" outlined={true} key={tag.id}>
              {tag.title}
            </Tag>
          ))}
        </Inline>
      </Stack>
    </Box>
  )
}

const ClickableItem = ({ item }: ItemProps) => {
  const { format } = useDateUtils()
  const router = useRouter()

  const pathname = new URL(router.asPath, 'https://island.is').pathname

  return (
    <FocusableBox
      padding={[2, 2, 3]}
      border="standard"
      borderRadius="large"
      href={item.slug ? `${pathname}/${item.slug}` : undefined}
      height="full"
    >
      <Stack space={3}>
        <Stack space={0}>
          <Stack space={0}>
            <Text variant="eyebrow" color="purple400">
              {item.date && format(new Date(item.date), 'dd.MM.yyyy')}
            </Text>
            <Text variant="h3" as="span" color="blue400">
              {item.title}
            </Text>
          </Stack>
          {item.cardIntro?.length > 0 && (
            <Box>{webRichText(item.cardIntro ?? [])}</Box>
          )}
        </Stack>
        <Inline space={1}>
          {item.filterTags?.map((tag) => (
            <Tag disabled={true} variant="purple" outlined={true} key={tag.id}>
              {tag.title}
            </Tag>
          ))}
        </Inline>
      </Stack>
    </FocusableBox>
  )
}

interface GenericListProps {
  id: string
  searchInputPlaceholder?: string | null
  itemType?: string | null
  filterTags?: GenericTag[] | null
}

export const GenericList = ({
  id,
  searchInputPlaceholder,
  itemType,
  filterTags,
}: GenericListProps) => {
  const searchQueryId = `${id}q`
  const pageQueryId = `${id}page`
  const tagQueryId = `${id}tag`

  const [searchValue, setSearchValue] = useQueryState(searchQueryId)
  const [page, setPage] = useQueryState(pageQueryId, parseAsInteger)
  const [parameters, setParameters] = useQueryState<Record<string, string[]>>(
    tagQueryId,
    parseAsJson(),
  )

  const filterCategories = useMemo(() => {
    const categories = getFilterCategories(filterTags ?? [])
    if (parameters !== null) {
      for (const category of categories) {
        if (category.id in parameters) {
          category.selected = parameters[category.id]
          if (!Array.isArray(category.selected)) {
            category.selected = []
          }
        }
      }
    }
    return categories
  }, [filterTags, parameters])

  const [itemsResponse, setItemsResponse] =
    useState<GenericListItemResponse | null>(null)
  const [errorOccurred, setErrorOccurred] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  const { activeLocale } = useI18n()

  const [fetchListItems, { loading }] = useLazyQuery<
    Query,
    GetGenericListItemsQueryVariables
  >(GET_GENERIC_LIST_ITEMS_QUERY, {
    onCompleted(data) {
      const searchParams = new URLSearchParams(window.location.search)

      const queryString = searchParams.get(searchQueryId) || ''
      const pageQuery = searchParams.get(pageQueryId) || '1'
      const tagQuery = searchParams.get(tagQueryId) || '{}'

      const tags: string[] = flatten(Object.values(JSON.parse(tagQuery)))

      if (
        // Make sure the response matches the request input
        queryString === data?.getGenericListItems?.input?.queryString &&
        pageQuery === data?.getGenericListItems?.input?.page?.toString() &&
        tags.every((tag) =>
          (data?.getGenericListItems?.input?.tags ?? []).includes(tag),
        )
      ) {
        setItemsResponse(data.getGenericListItems)
        setErrorOccurred(false)
      }
    },
    onError(_) {
      setErrorOccurred(true)
    },
  })

  useDebounce(
    () => {
      const selectedCategories: string[] = []
      filterCategories.forEach((c) =>
        c.selected.forEach((t) => selectedCategories.push(t)),
      )

      fetchListItems({
        variables: {
          input: {
            genericListId: id,
            size: ITEMS_PER_PAGE,
            lang: activeLocale,
            page: page ?? 1,
            queryString: searchValue || '',
            tags: selectedCategories,
            tagGroups: getGenericTagGroupHierarchy(filterCategories),
          },
        },
      })
    },
    DEBOUNCE_TIME_IN_MS,
    [searchValue, page, filterCategories],
  )

  const { width } = useWindowSize()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.md)
  }, [width])

  const totalItems = itemsResponse?.total ?? 0
  const items = itemsResponse?.items ?? []

  const noResultsFoundText =
    activeLocale === 'is' ? 'Engar niðurstöður fundust' : 'No results found'

  const resultsFoundText = getResultsFoundText(totalItems, activeLocale)

  const itemsAreClickable = itemType === 'Clickable'

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  const filterInputComponent = (
    <FilterInput
      name="list-search"
      onChange={(value) => {
        setSearchValue(value || null)
        setPage(null)
      }}
      value={searchValue ?? ''}
      loading={loading}
      placeholder={searchInputPlaceholder ?? undefined}
      backgroundColor="white"
    />
  )

  const selectedFilters = extractFilterTags(filterCategories)

  return (
    <Box paddingBottom={3}>
      <GridContainer>
        <Stack space={5}>
          <Box ref={ref}>
            {filterCategories.length > 0 && (
              <Stack space={4}>
                <Stack space={3}>
                  {isMobile && filterInputComponent}
                  <Filter
                    resultCount={totalItems}
                    labelClear={
                      activeLocale === 'is' ? 'Hreinsa síu' : 'Clear filter'
                    }
                    labelClearAll={
                      activeLocale === 'is'
                        ? 'Hreinsa allar síur'
                        : 'Clear all filters'
                    }
                    labelOpen={
                      activeLocale === 'is'
                        ? 'Sía niðurstöður'
                        : 'Filter results'
                    }
                    labelClose={
                      activeLocale === 'is' ? 'Loka síu' : 'Close filter menu'
                    }
                    labelResult={
                      activeLocale === 'is'
                        ? 'Skoða niðurstöður'
                        : 'See results'
                    }
                    labelTitle={
                      activeLocale === 'is'
                        ? 'Sía niðurstöður'
                        : 'Filter results'
                    }
                    variant={isMobile ? 'dialog' : 'popover'}
                    onFilterClear={() => {
                      setParameters(null)
                    }}
                    filterInput={filterInputComponent}
                  >
                    <FilterMultiChoice
                      labelClear={
                        activeLocale === 'is'
                          ? 'Hreinsa val'
                          : 'Clear selection'
                      }
                      onChange={({ categoryId, selected }) => {
                        setParameters((prevParameters) => {
                          // Make sure we clear out the query params from the url when there is nothing selected
                          if (
                            selected.length === 0 &&
                            prevParameters !== null &&
                            Object.values(prevParameters).every(
                              (s) => !s || s.length === 0,
                            )
                          ) {
                            return null
                          }

                          return {
                            ...prevParameters,
                            [categoryId]: selected,
                          }
                        })
                      }}
                      onClear={(categoryId) => {
                        setParameters((prevParameters) => {
                          const updatedParameters = {
                            ...prevParameters,
                            [categoryId]: [],
                          }

                          // Make sure we clear out the query params from the url when there is nothing selected
                          if (
                            Object.values(updatedParameters).every(
                              (s) => !s || s.length === 0,
                            )
                          ) {
                            return null
                          }

                          return updatedParameters
                        })
                      }}
                      categories={filterCategories}
                    />
                  </Filter>
                </Stack>

                <Inline space={1}>
                  {selectedFilters.map(({ value, label, category }) => (
                    <FilterTag
                      key={value}
                      onClick={() => {
                        setParameters((prevParameters) => {
                          const updatedParameters = {
                            ...prevParameters,
                            [category]: (
                              prevParameters?.[category] ?? []
                            ).filter((prevValue) => prevValue !== value),
                          }

                          // Make sure we clear out the query params from the url when there is nothing selected
                          if (
                            Object.values(updatedParameters).every(
                              (s) => !s || s.length === 0,
                            )
                          ) {
                            return null
                          }

                          return updatedParameters
                        })
                      }}
                    >
                      {label}
                    </FilterTag>
                  ))}
                </Inline>
              </Stack>
            )}
            {filterCategories.length === 0 && filterInputComponent}
          </Box>
          {errorOccurred && (
            <AlertMessage
              type="warning"
              title={activeLocale === 'is' ? 'Villa kom upp' : 'Error occurred'}
              message={
                activeLocale === 'is'
                  ? 'Ekki tókst að sækja gögn frá þjónustuaðila'
                  : 'Could not fetch results from service provider'
              }
            />
          )}
          {itemsResponse && items.length === 0 && (
            <Text>{noResultsFoundText}</Text>
          )}
          {items.length > 0 && (
            <Stack space={3}>
              <Inline space={2} justifyContent="spaceBetween" alignY="center">
                <Text>
                  {totalItems} {resultsFoundText}
                </Text>
                {totalPages > 1 && (
                  <Text>
                    {activeLocale === 'is' ? 'Síða' : 'Page'} {page ?? 1}{' '}
                    {activeLocale === 'is' ? 'af' : 'of'} {totalPages}
                  </Text>
                )}
              </Inline>
              <GridContainer>
                <GridRow rowGap={3}>
                  {!itemsAreClickable &&
                    items.map((item) => (
                      <GridColumn
                        key={item.id}
                        span={['1/1', '1/1', '1/1', '1/1', '1/2']}
                      >
                        <NonClickableItem item={item} />
                      </GridColumn>
                    ))}
                  {itemsAreClickable &&
                    items.map((item) => (
                      <GridColumn
                        key={item.id}
                        span={['1/1', '1/1', '1/1', '1/1', '1/2']}
                      >
                        <ClickableItem item={item} />
                      </GridColumn>
                    ))}
                </GridRow>
              </GridContainer>
            </Stack>
          )}

          {totalItems > ITEMS_PER_PAGE && (
            <Pagination
              page={page ?? 1}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={totalItems}
              renderLink={(page, className, children) => (
                <button
                  onClick={() => {
                    setPage(page === 1 ? null : page)

                    // Scroll to top of the list on page change
                    const position = ref.current?.getBoundingClientRect()
                    if (position) {
                      window.scroll({
                        behavior: 'smooth',
                        left: position.left,
                        top: position.top + window.scrollY - 20,
                      })
                    }
                  }}
                >
                  <span className={className}>{children}</span>
                </button>
              )}
            />
          )}
        </Stack>
      </GridContainer>
    </Box>
  )
}
