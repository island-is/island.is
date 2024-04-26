import { useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  FilterInput,
  GridContainer,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
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

interface GenericListProps {
  id: string
  firstPageItemResponse?: GenericListItemResponse
  searchInputPlaceholder?: string | null
}

export const GenericList = ({
  id,
  firstPageItemResponse,

  searchInputPlaceholder,
}: GenericListProps) => {
  // TODO: what should be persisted in the url?
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(1)
  const [itemsResponse, setItemsResponse] = useState(firstPageItemResponse)
  const firstRender = useRef(true)
  const { format } = useDateUtils()

  const { activeLocale } = useI18n()

  const [fetchListItems, { loading }] = useLazyQuery<
    Query,
    GetGenericListItemsQueryVariables
  >(GET_GENERIC_LIST_ITEMS_QUERY, {
    onCompleted(data) {
      // TODO: req res matching
      if (!data.getGenericListItems) {
        // TODO: handle undefined by showing a toaster?
        return
      }
      setItemsResponse(data.getGenericListItems)
    },
    onError(error) {
      // TODO: handle error
    },
  })

  // TODO: make sure this does not run on initial render
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

  return (
    <Box paddingBottom={3}>
      <GridContainer>
        <Stack space={5}>
          <FilterInput
            name="list-search"
            onChange={(value) => {
              setSearchValue(value || null)
              setPage(1)
            }}
            value={searchValue || ''}
            loading={loading}
            placeholder={searchInputPlaceholder ?? undefined}
            backgroundColor="white"
          />
          {items.length > 0 && (
            <Stack space={3}>
              {items.map((item) => (
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
