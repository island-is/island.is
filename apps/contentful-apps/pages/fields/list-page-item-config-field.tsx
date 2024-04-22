import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { CollectionProp, EntryProps, KeyValueMap } from 'contentful-management'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  EntryCard,
  Spinner,
  Stack,
  Text,
  TextInput,
  Pagination,
} from '@contentful/f36-components'
import { PlusIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { RichTextEditor } from '@contentful/field-editor-rich-text'

import { DEFAULT_LOCALE } from '../../constants'
import { BLOCKS } from '@contentful/rich-text-types'

const SEARCH_DEBOUNCE_TIME_IN_MS = 300
const LIST_ITEM_CONTENT_TYPE_ID = 'listItem'
const LIST_ITEMS_PER_PAGE = 4

const ListPageItemConfigField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const searchValueRef = useRef('')
  const [searchValue, setSearchValue] = useState('')
  const [listItemResponse, setListItemResponse] =
    useState<CollectionProp<EntryProps<KeyValueMap>>>()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const pageRef = useRef(0)

  const skip = LIST_ITEMS_PER_PAGE * page

  useDebounce(
    async () => {
      setLoading(true)
      try {
        const response = await cma.entry.getMany({
          environmentId: sdk.ids.environment,
          spaceId: sdk.ids.space,
          query: {
            content_type: LIST_ITEM_CONTENT_TYPE_ID,
            limit: LIST_ITEMS_PER_PAGE,
            skip,
            'fields.title[match]': searchValue,
            'fields.listPage.sys.id': sdk.entry.getSys().id,
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
    [page, searchValue],
  )

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  const createListItem = async () => {
    const listItem = await cma.entry.create(
      {
        contentTypeId: LIST_ITEM_CONTENT_TYPE_ID,
        environmentId: sdk.ids.environment,
        spaceId: sdk.ids.space,
      },
      {
        fields: {
          listPage: {
            [DEFAULT_LOCALE]: {
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
    sdk.navigator.openEntry(listItem.sys.id, {
      slideIn: true,
    })
  }

  return (
    <Box style={{ display: 'flex', flexFlow: 'column nowrap', gap: '32px' }}>
      {JSON.stringify(sdk.field.getValue())}
      <RichTextEditor
        value={{
          nodeType: BLOCKS.DOCUMENT,
          data: {},
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: 'setting value here',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        }}
        sdk={
          {
            ...sdk,
            field: {
              getIsDisabled() {
                return false
              },
              getSchemaErrors() {
                return []
              },
              getValue() {
                return {
                  nodeType: 'document',
                  data: {},
                  content: [
                    {
                      nodeType: 'paragraph',
                      data: {},
                      content: [
                        {
                          nodeType: 'text',
                          value: 'setting value here',
                          marks: [],
                          data: {},
                        },
                      ],
                    },
                  ],
                }
              },
              id: 'tst',
              locale: sdk.field.locale,
              name: 'tst',
              onIsDisabledChanged() {
                return () => {}
              },
              onSchemaErrorsChanged() {
                return () => {}
              },
              onValueChanged(callback) {
                callback((value) => {
                  console.log('CHANGE', value)
                })
                return () => {}
              },
              async removeValue() {},
              required: false,
              setInvalid() {},
              async setValue(value) {
                console.log('Set value', value)
                sdk.field.setValue({
                  template: value,
                })
                return value as any
              },
              type: 'RichText',
              validations: [
                {
                  enabledMarks: [],
                  message: 'Marks are not allowed',
                },
                {
                  enabledNodeTypes: [],
                  message: 'Nodes are not allowed',
                },
              ],
            },
          } as any
        }
        isInitiallyDisabled={false}
      />

      <Box
        onClick={createListItem}
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Button startIcon={<PlusIcon />}>Add item</Button>
      </Box>

      <Box style={{ display: 'flex', flexFlow: 'column nowrap', gap: '24px' }}>
        <TextInput
          placeholder="Search for a list item"
          value={searchValue}
          onChange={(ev) => {
            searchValueRef.current = ev.target.value
            setSearchValue(ev.target.value)
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
                    contentType="List Item"
                    title={item.fields.title?.[DEFAULT_LOCALE] ?? 'Untitled'}
                    onClick={() => {
                      sdk.navigator.openEntry(item.sys.id, { slideIn: true })
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
    </Box>
  )
}

export default ListPageItemConfigField
