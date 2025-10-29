import { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
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
  Hyphen,
  Icon,
  type IconProps,
  Inline,
  Pagination,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'
import { NewsCard } from '@island.is/web/components'
import {
  GenericListItem,
  GenericListItemResponse,
  GenericTag,
  GetGenericListItemsInputOrderBy,
  GetGenericListItemsQueryVariables,
  Image as ImageSchema,
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
import * as styles from './GenericList.css'

const DEBOUNCE_TIME_IN_MS = 300
const ITEMS_PER_PAGE = 10

interface ItemProps {
  item: GenericListItem
}

export const NonClickableItem = ({ item }: ItemProps) => {
  const { format } = useDateUtils()
  const filterTags = item.filterTags ?? []
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
            {item.date && (
              <Text variant="eyebrow" color="purple400">
                {format(new Date(item.date), 'do MMMM yyyy')}
              </Text>
            )}
            <Text variant="h3" as="span" color="dark400">
              {item.title}
            </Text>
          </Stack>
          {item.cardIntro?.length > 0 && (
            <Box>{webRichText(item.cardIntro ?? [])}</Box>
          )}
        </Stack>
        {filterTags.length > 0 && (
          <Inline space={1}>
            {filterTags.map((tag) => (
              <Tag
                disabled={true}
                variant="purple"
                outlined={true}
                key={tag.id}
              >
                {tag.title}
              </Tag>
            ))}
          </Inline>
        )}
      </Stack>
    </Box>
  )
}

interface ClickableItemProps {
  item: ItemProps['item']
  baseUrl?: string
}

export const ClickableItem = ({ item, baseUrl }: ClickableItemProps) => {
  const { format } = useDateUtils()
  const router = useRouter()

  const pathname = new URL(baseUrl || router.asPath, 'https://island.is')
    .pathname

  let icon: IconProps['icon'] | null = null

  let href = item.slug ? `${pathname}/${item.slug}` : undefined
  if (item.assetUrl) {
    href = item.assetUrl
    icon = 'document'
  } else if (item.externalUrl) {
    href = item.externalUrl
    const isInternalLink = !shouldLinkOpenInNewWindow(href)
    if (!isInternalLink) icon = 'open'
  }

  const filterTags = item.filterTags ?? []

  if (item.image) {
    return (
      <NewsCard
        title={item.title}
        introduction={
          item.cardIntro?.length > 0 && (
            <Box>{webRichText(item.cardIntro ?? [])}</Box>
          )
        }
        href={href ?? ''}
        image={item.image as ImageSchema}
        readMoreText=""
        titleAs="h3"
        titleVariant="h3"
        titleTextColor="blue400"
        date={item.date ?? ''}
        dateTextColor="purple400"
      />
    )
  }

  return (
    <FocusableBox
      padding={[2, 2, 3]}
      border="standard"
      borderRadius="large"
      href={href}
      height="full"
      width="full"
    >
      <Box width="full">
        <Stack space={3}>
          <Box width="full">
            <Box width="full">
              {item.date && (
                <Box className={styles.clickableItemTopRowContainer}>
                  <Inline space={2} justifyContent="spaceBetween">
                    <Text variant="eyebrow" color="purple400">
                      {format(new Date(item.date), 'do MMMM yyyy')}
                    </Text>
                    {icon && (
                      <Icon
                        size="medium"
                        type="outline"
                        color="blue400"
                        icon={icon}
                      />
                    )}
                  </Inline>
                </Box>
              )}
              <GridRow>
                <GridColumn
                  span={
                    !item.date && icon
                      ? ['10/12', '10/12', '10/12', '10/12', '11/12']
                      : '1/1'
                  }
                >
                  <Text variant="h3" as="span" color="blue400">
                    <Hyphen>{item.title}</Hyphen>
                  </Text>
                </GridColumn>
                {!item.date && icon && (
                  <GridColumn span={['2/12', '2/12', '2/12', '2/12', '1/12']}>
                    <Box display="flex" justifyContent="flexEnd">
                      <Icon
                        size="medium"
                        type="outline"
                        color="blue400"
                        icon={icon}
                      />
                    </Box>
                  </GridColumn>
                )}
              </GridRow>
            </Box>
            {item.cardIntro?.length > 0 && (
              <Box>{webRichText(item.cardIntro ?? [])}</Box>
            )}
          </Box>
          {filterTags.length > 0 && (
            <Inline space={1}>
              {filterTags.map((tag) => (
                <Tag
                  disabled={true}
                  variant="purple"
                  outlined={true}
                  key={tag.id}
                >
                  {tag.title}
                </Tag>
              ))}
            </Inline>
          )}
        </Stack>
      </Box>
    </FocusableBox>
  )
}

interface GenericListProps {
  searchInputPlaceholder?: string | null
  filterTags?: GenericTag[] | null
  searchQueryId: string
  pageQueryId: string
  tagQueryId: string
  fetchListItems: (props: {
    page: number
    searchValue: string
    tags: string[]
    tagGroups: Record<string, string[]>
  }) => void
  loading: boolean
  totalItems: number
  displayError: boolean
  showSearchInput?: boolean
}

export const GenericList = ({
  searchInputPlaceholder,
  filterTags,
  searchQueryId,
  pageQueryId,
  tagQueryId,
  fetchListItems,
  totalItems,
  loading,
  displayError,
  children,
  showSearchInput = true,
}: React.PropsWithChildren<GenericListProps>) => {
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

  const ref = useRef<HTMLElement | null>(null)

  const { activeLocale } = useI18n()

  useDebounce(
    () => {
      const selectedCategories: string[] = []
      filterCategories.forEach((c) =>
        c.selected.forEach((t) => selectedCategories.push(t)),
      )
      fetchListItems({
        page: page ?? 1,
        searchValue: searchValue || '',
        tags: selectedCategories,
        tagGroups: getGenericTagGroupHierarchy(filterCategories),
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

  const noResultsFoundText =
    activeLocale === 'is' ? 'Engar niðurstöður fundust' : 'No results found'

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

  const selectedFiltersComponent = (
    <Box className={styles.filterTagsContainer}>
      <Inline space={1} alignY="top">
        {selectedFilters.length > 0 && (
          <Text>{activeLocale === 'is' ? 'Síað eftir:' : 'Filtered by:'}</Text>
        )}
        <Inline space={1}>
          {selectedFilters.map(({ value, label, category }) => (
            <FilterTag
              key={value}
              active={true}
              onClick={() => {
                setPage(null)
                setParameters((prevParameters) => {
                  const updatedParameters = {
                    ...prevParameters,
                    [category]: (prevParameters?.[category] ?? []).filter(
                      (prevValue) => prevValue !== value,
                    ),
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
      </Inline>
    </Box>
  )

  return (
    <Box paddingBottom={3}>
      <GridContainer>
        <Stack space={4}>
          {showSearchInput && (
            <Box ref={ref}>
              {filterCategories.length > 1 && (
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
                        setPage(null)
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
                          setPage(null)
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
                          setPage(null)
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
                  {selectedFiltersComponent}
                </Stack>
              )}

              {filterCategories.length <= 1 && (
                <Stack space={4}>
                  <Stack space={3}>
                    {filterInputComponent}
                    {selectedFilters.length > 0 && selectedFiltersComponent}
                  </Stack>
                  <Inline space={1}>
                    {filterCategories[0]?.filters
                      ?.filter((tag) => {
                        const isActive = Boolean(
                          selectedFilters.find(
                            (filter) => filter.value === tag.value,
                          ),
                        )
                        return !isActive
                      })
                      .map((tag) => {
                        const category = filterCategories[0]?.id
                        const value = tag.value
                        const label = tag.label
                        return (
                          <Tag
                            key={tag.value}
                            onClick={() => {
                              if (!category) {
                                return
                              }
                              setPage(null)
                              setParameters((prevParameters) => ({
                                ...prevParameters,
                                [category]: (
                                  prevParameters?.[category] ?? []
                                ).concat(value),
                              }))
                            }}
                          >
                            {label}
                          </Tag>
                        )
                      })}
                  </Inline>
                </Stack>
              )}
            </Box>
          )}

          {displayError && (
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
          {totalItems === 0 && !displayError && !loading && (
            <Text>{noResultsFoundText}</Text>
          )}
          {totalItems > 0 && children}
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

interface GenericListWrapperProps {
  id: string
  searchInputPlaceholder?: string | null
  itemType?: string | null
  filterTags?: GenericTag[] | null
  defaultOrder?: GetGenericListItemsInputOrderBy | null
  textSearchOrder?: 'Default' | 'Score'
  showSearchInput?: boolean
}

export const GenericListWrapper = ({
  id,
  filterTags,
  itemType,
  searchInputPlaceholder,
  defaultOrder,
  textSearchOrder,
  showSearchInput,
}: GenericListWrapperProps) => {
  const searchQueryId = `${id}q`
  const pageQueryId = `${id}page`
  const tagQueryId = `${id}tag`

  const { activeLocale } = useI18n()

  const [itemsResponse, setItemsResponse] =
    useState<GenericListItemResponse | null>(null)
  const [errorOccurred, setErrorOccurred] = useState(false)

  const [fetchListItems, { loading, called }] = useLazyQuery<
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

  const totalItems = itemsResponse?.total ?? 0
  const items = itemsResponse?.items ?? []

  const itemsAreClickable = itemType === 'Clickable'

  return (
    <GenericList
      filterTags={filterTags}
      searchInputPlaceholder={searchInputPlaceholder}
      displayError={errorOccurred}
      fetchListItems={({ page, searchValue, tags, tagGroups }) => {
        let orderBy = defaultOrder
        if (searchValue.trim().length > 0 && textSearchOrder === 'Score') {
          orderBy = GetGenericListItemsInputOrderBy.Score
        }
        fetchListItems({
          variables: {
            input: {
              genericListId: id,
              size: ITEMS_PER_PAGE,
              lang: activeLocale,
              page: page,
              queryString: searchValue,
              tags,
              tagGroups,
              orderBy,
            },
          },
        })
      }}
      totalItems={totalItems}
      loading={loading || !called}
      pageQueryId={pageQueryId}
      searchQueryId={searchQueryId}
      tagQueryId={tagQueryId}
      showSearchInput={showSearchInput}
    >
      <GridContainer>
        <GridRow rowGap={3}>
          {!itemsAreClickable &&
            items.map((item) => (
              <GridColumn key={item.id} span="1/1">
                <NonClickableItem item={item} />
              </GridColumn>
            ))}
          {itemsAreClickable &&
            items.map((item) => (
              <GridColumn key={item.id} span="1/1">
                <ClickableItem item={item} />
              </GridColumn>
            ))}
        </GridRow>
      </GridContainer>
    </GenericList>
  )
}
