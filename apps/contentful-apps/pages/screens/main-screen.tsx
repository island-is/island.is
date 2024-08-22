import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import {
  type CollectionProp,
  ContentTypeProps,
  type EntryProps,
  type KeyValueMap,
} from 'contentful-management'
import {
  Box,
  EntryCard,
  Pagination,
  Select,
  Spinner,
  Stack,
  Text,
  TextInput,
} from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { sortAlpha } from '@island.is/shared/utils'

import { RequestBody } from '../api/entry-search'

const ENTRIES_PER_PAGE = 40
const SEARCH_DEBOUNCE_TIME_IN_MS = 300

const CONTENT_TYPES = ['article', 'news', 'organizationPage']

const MainScreen = () => {
  const sdk = useSDK()
  const cma = useCMA()

  const [entriesResponse, setEntriesResponse] =
    useState<CollectionProp<EntryProps<KeyValueMap>>>()

  const [counter, setCounter] = useState(0)

  const [page, setPage] = useState(0)
  const pageRef = useRef(0)

  const searchValueRef = useRef('')
  const [searchValue, setSearchValue] = useState('')

  const [loading, setLoading] = useState(false)
  const [contentTypeId, setContentTypeId] = useState<string>()

  const [contentTypes, setContentTypes] = useState<ContentTypeProps[]>([])

  const [organizations, setOrganizations] = useState<EntryProps<KeyValueMap>[]>(
    [],
  )
  const [organizationId, setOrganizationId] = useState<string>()

  useEffect(() => {
    const fetchAllOrganizations = async () => {
      const response = await cma.entry.getMany({
        query: {
          limit: 1000,
          content_type: 'organization',
        },
      })
      response.items.sort(sortAlpha('name'))

      setOrganizations(response.items.filter((o) => o.fields.title))
    }
    fetchAllOrganizations()
  }, [cma.entry])

  useEffect(() => {
    const fetchAllContentTypes = async () => {
      const response = await cma.contentType.getMany({
        query: {
          limit: 200,
        },
      })
      response.items.sort(sortAlpha('name'))

      setContentTypes(response.items)
    }
    fetchAllContentTypes()
  }, [cma.contentType])

  useDebounce(
    async () => {
      if (contentTypes.length === 0) {
        return
      }
      setLoading(true)
      try {
        const response = await fetch('/api/entry-search', {
          body: JSON.stringify({
            searchValue,
            limit: ENTRIES_PER_PAGE,
            skip: ENTRIES_PER_PAGE * page,
            contentTypeId,
            organizationId,
          } as RequestBody),
          method: 'POST', // TODO: GET would be better
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const json = await response.json()

        if (
          searchValueRef.current === searchValue &&
          pageRef.current === page
        ) {
          setEntriesResponse(json)
        }
      } finally {
        setLoading(false)
      }
    },
    SEARCH_DEBOUNCE_TIME_IN_MS,
    [
      page,
      searchValue,
      counter,
      contentTypes.length,
      contentTypeId,
      organizationId,
    ],
  )

  return (
    <Box padding="spacingL">
      <Stack flexDirection="column">
        {contentTypeId && (
          <Select
            onChange={(ev) => {
              setOrganizationId(ev.target.value)
              setPage(0)
              pageRef.current = 0
            }}
          >
            <Select.Option value="">Any</Select.Option>
            {organizations.map((o) => (
              <Select.Option key={o.sys.id} value={o.sys.id}>
                {o.fields.title[sdk.locales.default]}
              </Select.Option>
            ))}
          </Select>
        )}
        <Select
          onChange={(ev) => {
            setContentTypeId(ev.target.value)
            setPage(0)
            pageRef.current = 0
          }}
        >
          <Select.Option value="">Any</Select.Option>
          {contentTypes
            .filter((ct) => CONTENT_TYPES.includes(ct.sys.id))
            .map((ct) => (
              <Select.Option key={ct.sys.id} value={ct.sys.id}>
                {ct.name}
              </Select.Option>
            ))}
        </Select>
        <TextInput
          placeholder="Type to search for entries"
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
        {entriesResponse?.items?.length > 0 && (
          <>
            <Box style={{ minHeight: '440px' }}>
              <Stack flexDirection="column" spacing="spacingL">
                {entriesResponse.items.map((item) => {
                  const contentType = contentTypes.find(
                    (ct) => ct.sys.id === item.sys.contentType.sys.id,
                  )
                  return (
                    <EntryCard
                      key={item.sys.id}
                      contentType={
                        contentType?.name ?? item.sys.contentType.sys.id
                      }
                      title={
                        item.fields[contentType?.displayField] || 'Untitled'
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
                  )
                })}
              </Stack>
            </Box>
            <Pagination
              activePage={page}
              itemsPerPage={ENTRIES_PER_PAGE}
              totalItems={entriesResponse.total}
              onPageChange={(newPage) => {
                pageRef.current = newPage
                setPage(newPage)
                window.scrollTo({
                  top: 0,
                  behavior: 'instant',
                })
              }}
            />
          </>
        )}

        {entriesResponse?.items?.length === 0 && (
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <Text>No entry was found</Text>
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default MainScreen
