import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { Locale } from 'locale'
import { useRouter } from 'next/router'
import { parseAsInteger, useQueryState } from 'next-usequerystate'
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
import { getFilterCategories } from '@island.is/web/screens/Organization/PublishedMaterial/utils'
import { GET_GENERIC_LIST_ITEMS_QUERY } from '@island.is/web/screens/queries/GenericList'
import { webRichText } from '@island.is/web/utils/richText'

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
    </FocusableBox>
  )
}

interface GenericListProps {
  id: string
  firstPageItemResponse?: GenericListItemResponse
  searchInputPlaceholder?: string | null
  itemType?: string | null
  filterTags?: GenericTag[] | null
}

export const GenericList = ({
  id,
  firstPageItemResponse,
  searchInputPlaceholder,
  itemType,
  filterTags,
}: GenericListProps) => {
  const searchQueryId = `${id}q`
  const pageQueryId = `${id}page`

  // TODO: add query params for filter tag search
  // TODO: ignore initial response if there are query params set and fetch according to the query params
  // TODO: perhaps add referrer decorator to graphql resolver so we can read query params

  const [searchValue, setSearchValue] = useQueryState(searchQueryId)
  const [page, setPage] = useQueryState(pageQueryId, parseAsInteger)

  const initialFilterCategories = getFilterCategories(filterTags ?? [])

  const pageRef = useRef(page)
  const searchValueRef = useRef(searchValue)
  const [itemsResponse, setItemsResponse] = useState(firstPageItemResponse)
  const firstRender = useRef(true)
  const [errorOccurred, setErrorOccurred] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  const { activeLocale } = useI18n()

  const [fetchListItems, { loading }] = useLazyQuery<
    Query,
    GetGenericListItemsQueryVariables
  >(GET_GENERIC_LIST_ITEMS_QUERY, {
    onCompleted(data) {
      if (
        // Make sure the response matches the request input
        searchValueRef.current ===
          data?.getGenericListItems?.input?.queryString &&
        pageRef.current === data?.getGenericListItems?.input?.page
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
      // Only fetch initial items in case we don't have them
      if (firstRender.current) {
        firstRender.current = false
        if (firstPageItemResponse) {
          return
        }
      }
      fetchListItems({
        variables: {
          input: {
            genericListId: id,
            size: ITEMS_PER_PAGE,
            lang: activeLocale,
            page: page ?? 1,
            queryString: searchValue || '',
            tags: [],
            tagGroups: {},
          },
        },
      })
    },
    DEBOUNCE_TIME_IN_MS,
    [searchValue, page],
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
        searchValueRef.current = value
        setPage(null)
        pageRef.current = 1
      }}
      value={searchValue ?? ''}
      loading={loading}
      placeholder={searchInputPlaceholder ?? undefined}
      backgroundColor="white"
    />
  )

  return (
    <Box paddingBottom={3}>
      <GridContainer>
        <Stack space={5}>
          <Box ref={ref}>
            {initialFilterCategories.length > 0 && (
              <Filter
                resultCount={totalItems}
                labelClear={'Hreinsa síu'}
                labelClearAll={'Hreinsa allar síur'}
                labelOpen={'Opna síu'}
                labelClose={'Loka síu'}
                labelResult={'Skoða niðurstöður'}
                labelTitle={'Sía niðurstöður'}
                variant={isMobile ? 'dialog' : 'popover'}
                onFilterClear={() => {
                  //
                }}
                filterInput={filterInputComponent}
              >
                <FilterMultiChoice
                  labelClear={'Hreinsa val'}
                  onChange={({ categoryId, selected }) => {
                    // setIsTyping(true)
                    // setParameters((prevParameters) => ({
                    //   ...prevParameters,
                    //   [categoryId]: selected,
                    // }))
                  }}
                  onClear={(categoryId) => {
                    // setIsTyping(true)
                    // setParameters((prevParameters) => ({
                    //   ...prevParameters,
                    //   [categoryId]: [],
                    // }))
                  }}
                  categories={initialFilterCategories}
                />
              </Filter>
            )}
            {initialFilterCategories.length === 0 && filterInputComponent}
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
          {items.length === 0 && <Text>{noResultsFoundText}</Text>}
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
                    pageRef.current = page

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
