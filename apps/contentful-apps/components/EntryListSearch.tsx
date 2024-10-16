import { useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import {
  CollectionProp,
  EntryProps,
  KeyValueMap,
  QueryOptions,
} from 'contentful-management'
import {
  Box,
  EntryCard,
  Pagination,
  Spinner,
  Stack,
  Text,
  TextInput,
} from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { DEFAULT_LOCALE } from '../constants'

const SEARCH_DEBOUNCE_TIME_IN_MS = 300

interface EntryListSearchProps {
  contentTypeId: string
  contentTypeLabel: string
  contentTypeTitleField: string
  itemsPerPage?: number
  onEntryClick?: (entry: EntryProps) => void
  query?: QueryOptions
}

export const EntryListSearch = ({
  itemsPerPage = 4,
  contentTypeId,
  contentTypeLabel,
  contentTypeTitleField,
  onEntryClick,
  query,
}: EntryListSearchProps) => {
  const sdk = useSDK()
  const cma = useCMA()

  const searchValueRef = useRef('')
  const [searchValue, setSearchValue] = useState('')
  const [listItemResponse, setListItemResponse] =
    useState<CollectionProp<EntryProps<KeyValueMap>>>()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const pageRef = useRef(0)
  const [counter, setCounter] = useState(0)

  const skip = itemsPerPage * page

  useDebounce(
    async () => {
      setLoading(true)
      try {
        const response = await cma.entry.getMany({
          query: {
            content_type: contentTypeId,
            limit: itemsPerPage,
            skip,
            [`fields.${contentTypeTitleField}[match]`]: searchValue,
            'sys.archivedAt[exists]': false,
            ...query,
          },
        })
        if (
          searchValueRef.current === searchValue &&
          pageRef.current === page
        ) {
          setListItemResponse(response)
        }
      } finally {
        setLoading(false)
      }
    },
    SEARCH_DEBOUNCE_TIME_IN_MS,
    [page, searchValue, counter],
  )

  return (
    <Box style={{ display: 'flex', flexFlow: 'column nowrap', gap: '24px' }}>
      <TextInput
        placeholder="Search for an entry"
        value={searchValue}
        onChange={(ev) => {
          searchValueRef.current = ev.target.value
          setSearchValue(ev.target.value)
          setPage(0)
          pageRef.current = 0
        }}
      />

      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          visibility: loading ? 'visible' : 'hidden',
        }}
      >
        <Spinner />
      </Box>

      {listItemResponse?.items?.length > 0 && (
        <>
          <Box style={{ minHeight: '440px' }}>
            <Stack flexDirection="column" spacing="spacingL">
              {listItemResponse.items.map((item) => (
                <EntryCard
                  key={item.sys.id}
                  contentType={contentTypeLabel}
                  title={
                    item.fields[contentTypeTitleField]?.[DEFAULT_LOCALE] ||
                    'Untitled'
                  }
                  onClick={() => {
                    if (onEntryClick) {
                      onEntryClick(item)
                      return
                    }

                    sdk.navigator
                      .openEntry(item.sys.id, {
                        slideIn: { waitForClose: true },
                      })
                      .then(() => {
                        setCounter((c) => c + 1)
                      })
                  }}
                />
              ))}
            </Stack>
          </Box>
          <Pagination
            activePage={page}
            itemsPerPage={itemsPerPage}
            totalItems={listItemResponse.total}
            onPageChange={(newPage) => {
              pageRef.current = newPage
              setPage(newPage)
            }}
          />
        </>
      )}

      {listItemResponse?.items?.length === 0 && (
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <Text>No entry was found</Text>
        </Box>
      )}
    </Box>
  )
}
