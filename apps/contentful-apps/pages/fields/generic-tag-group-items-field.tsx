import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  EntryCard,
  Pagination,
  Spinner,
  Stack,
  Text,
  TextInput,
} from '@contentful/f36-components'
import { PlusIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

const LIST_ITEMS_PER_PAGE = 4
const SEARCH_DEBOUNCE_TIME_IN_MS = 300

const GenericTagGroupItemsField = () => {
  const [page, setPage] = useState(0)
  const pageRef = useRef(0)
  const [searchValue, setSearchValue] = useState('')
  const searchValueRef = useRef('')
  const [listItemResponse, setListItemResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [counter, setCounter] = useState(0)

  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const skip = LIST_ITEMS_PER_PAGE * page

  const createGenericTag = async () => {
    const tag = await cma.entry.create(
      {
        contentTypeId: 'genericTag',
        environmentId: sdk.ids.environment,
        spaceId: sdk.ids.space,
      },
      {
        fields: {
          genericTagGroup: {
            [sdk.locales.default]: {
              sys: {
                id: sdk.entry.getSys().id,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
        },
      },
    )
    sdk.navigator
      .openEntry(tag.sys.id, {
        slideIn: { waitForClose: true },
      })
      .then(() => {
        setCounter((c) => c + 1)
      })
  }

  useDebounce(
    async () => {
      setIsLoading(true)
      try {
        const response = await cma.entry.getMany({
          query: {
            content_type: 'genericTag',
            limit: LIST_ITEMS_PER_PAGE,
            skip,
            'fields.internalTitle[match]': searchValue,
            'fields.genericTagGroup.sys.id': sdk.entry.getSys().id,
            'sys.archivedAt[exists]': false,
          },
        })

        if (
          searchValueRef.current === searchValue &&
          pageRef.current === page
        ) {
          setListItemResponse(response)
        }
      } finally {
        setIsLoading(false)
      }
    },
    SEARCH_DEBOUNCE_TIME_IN_MS,
    [page, searchValue, counter],
  )

  useEffect(() => {
    sdk.window.startAutoResizer()
    return () => {
      sdk.window.stopAutoResizer()
    }
  }, [sdk.window])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Box>
        <Box
          onClick={createGenericTag}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button startIcon={<PlusIcon />}>Create tag</Button>
        </Box>
      </Box>
      <Box style={{ display: 'flex', flexFlow: 'column nowrap', gap: '24px' }}>
        <TextInput
          placeholder="Search for a generic tag"
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
            visibility: isLoading ? 'visible' : 'hidden',
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
                    contentType="Generic Tag"
                    title={
                      item.fields.internalTitle?.[sdk.locales.default] ??
                      'Untitled'
                    }
                    onClick={() => {
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
              itemsPerPage={LIST_ITEMS_PER_PAGE}
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
            <Text>No item was found</Text>
          </Box>
        )}
      </Box>
    </div>
  )
}

export default GenericTagGroupItemsField
