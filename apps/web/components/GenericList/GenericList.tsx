import { useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { Locale } from 'locale'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  FilterInput,
  FocusableBox,
  GridContainer,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  GenericListItem,
  GenericListItemResponse,
  GetGenericListItemsQueryVariables,
  Query,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
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
      key={item.id}
      padding={[2, 2, 3]}
      border="standard"
      borderRadius="large"
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
      key={item.id}
      padding={[2, 2, 3]}
      border="standard"
      borderRadius="large"
      href={item.slug ? `${pathname}/${item.slug}` : undefined}
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
}

export const GenericList = ({
  id,
  firstPageItemResponse,
  searchInputPlaceholder,
  itemType,
}: GenericListProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(1)
  const pageRef = useRef(page)
  const searchValueRef = useRef(searchValue)
  const [itemsResponse, setItemsResponse] = useState(firstPageItemResponse)
  const firstRender = useRef(true)
  const [errorOccurred, setErrorOccurred] = useState(false)

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
            page,
            queryString: searchValue,
          },
        },
      })
    },
    DEBOUNCE_TIME_IN_MS,
    [searchValue, page],
  )

  const totalItems = itemsResponse?.total ?? 0
  const items = itemsResponse?.items ?? []

  const noResultsFoundText =
    activeLocale === 'is' ? 'Engar niðurstöður fundust' : 'No results found'

  const resultsFoundText = getResultsFoundText(totalItems, activeLocale)

  const itemsAreClickable = itemType === 'Clickable'

  return (
    <Box paddingBottom={3}>
      <GridContainer>
        <Stack space={5}>
          <FilterInput
            name="list-search"
            onChange={(value) => {
              setSearchValue(value)
              searchValueRef.current = value
              setPage(1)
              pageRef.current = 1
            }}
            value={searchValue}
            loading={loading}
            placeholder={searchInputPlaceholder ?? undefined}
            backgroundColor="white"
          />
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
              <Text>
                {totalItems} {resultsFoundText}
              </Text>
              {!itemsAreClickable &&
                items.map((item) => (
                  <NonClickableItem key={item.id} item={item} />
                ))}
              {itemsAreClickable &&
                items.map((item) => (
                  <ClickableItem key={item.id} item={item} />
                ))}
            </Stack>
          )}

          {totalItems > ITEMS_PER_PAGE && (
            <Pagination
              page={page}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={totalItems}
              renderLink={(page, className, children) => (
                <button
                  onClick={() => {
                    setPage(page)
                    pageRef.current = page
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
