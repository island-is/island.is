import { useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { useQueryState } from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  GridContainer,
  Input,
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

interface GenericListProps {
  id: string
  firstPageItemResponse?: GenericListItemResponse
}

export const GenericList = ({
  id,
  firstPageItemResponse,
}: GenericListProps) => {
  const [searchValue, setSearchValue] = useQueryState('q')
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
            size: 10,
            lang: activeLocale,
            page: 1,
            queryString: searchValue,
          },
        },
      })
    },
    DEBOUNCE_TIME_IN_MS,
    [searchValue],
  )

  return (
    <Box paddingBottom={3}>
      <GridContainer>
        <Stack space={5}>
          <Input
            name="list-search" // TODO: think of a good name
            label="Leit" // TODO: read label and placeholder from listpage content type data
            value={searchValue || ''}
            onChange={(ev) => {
              setSearchValue(ev.target.value || null)
            }}
            loading={loading}
          />

          {typeof itemsResponse?.items?.length === 'number' &&
            itemsResponse.items.length > 0 && (
              <Stack space={2}>
                {itemsResponse.items.map((item) => (
                  <Box
                    key={item.id}
                    padding={[2, 2, 3]}
                    border="standard"
                    borderRadius="large"
                  >
                    <Stack space={2}>
                      {item.date && (
                        <Text variant="eyebrow" color="purple400">
                          {format(new Date(item.date), 'do.MMM.YYYY')}
                        </Text>
                      )}
                      <Text variant="h4" as="span" color="dark400">
                        {item.title}
                      </Text>
                      {item.cardIntro?.length > 0 && (
                        <Box>{webRichText(item.cardIntro ?? [])}</Box>
                      )}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
        </Stack>
      </GridContainer>
    </Box>
  )
}
