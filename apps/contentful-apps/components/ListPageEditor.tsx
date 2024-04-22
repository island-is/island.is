import { useMemo, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { CollectionProp, EntryProps, KeyValueMap } from 'contentful-management'
import { EditorExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  EntryCard,
  Spinner,
  Stack,
  Text,
  TextInput,
  Pagination,
  FormControl,
} from '@contentful/f36-components'
import { PlusIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { Field, FieldWrapper } from '@contentful/default-field-editors'

const SEARCH_DEBOUNCE_TIME_IN_MS = 300
const LIST_ITEM_CONTENT_TYPE_ID = 'listItem'
const LIST_ITEMS_PER_PAGE = 4

const getFieldApiForLocale = (locale: string, sdk: EditorExtensionSDK) => {
  return {
    ...sdk,
    field:
      sdk.entry.fields['listItemThumbnailContentTemplate'].getForLocale(locale),
  }
}

const ListPageEditor = () => {
  const sdk = useSDK<EditorExtensionSDK>()

  const cma = useCMA()

  const searchValueRef = useRef('')
  const [searchValue, setSearchValue] = useState('')
  const [listItemResponse, setListItemResponse] =
    useState<CollectionProp<EntryProps<KeyValueMap>>>()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const pageRef = useRef(0)

  /** Counter that's simply used to refresh the list when an item gets created */
  const [counter, setCounter] = useState(0)

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
    [page, searchValue, counter],
  )

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
            [sdk.locales.default]: {
              sys: {
                id: sdk.entry.getSys().id,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
          thumbnailContent: {
            // TODO: make this dynamic for all locales
            [sdk.locales.default]:
              sdk.entry.fields.listItemThumbnailContentTemplate.getValue(
                sdk.locales.default,
              ),
            ['en']:
              sdk.entry.fields.listItemThumbnailContentTemplate.getValue('en'),
          },
        },
      },
    )
    sdk.navigator.openEntry(listItem.sys.id, {
      slideIn: true,
    })
    setCounter((counter) => counter + 1)
  }

  const availableLocales = useMemo(() => {
    const locales = [...sdk.locales.available]

    // Make sure that the default locale is at the top
    if (locales[0] !== sdk.locales.default) {
      const index = locales.findIndex(
        (locale) => locale === sdk.locales.default,
      )
      if (index >= 0) {
        locales.splice(index, 1)
        locales.unshift(sdk.locales.default)
      }
    }

    return locales
  }, [])

  // TODO: fix left and right padding on all elements

  return (
    <Box
      paddingLeft="spacingL"
      paddingRight="spacingL"
      paddingTop="spacingL"
      paddingBottom="spacingL"
      style={{ display: 'flex', flexFlow: 'column nowrap', gap: '32px' }}
    >
      <Box>
        {availableLocales.map((locale) => (
          <FieldWrapper
            key={locale}
            sdk={getFieldApiForLocale(locale, sdk)}
            name="listItemThumbnailContentTemplate"
            renderHeading={() => (
              <FormControl.Label>
                Intro template | {sdk.locales.names[locale]}
              </FormControl.Label>
            )}
          >
            <Field
              sdk={getFieldApiForLocale(locale, sdk)}
              widgetId="richTextEditor"
            />
          </FieldWrapper>
        ))}
      </Box>

      <Box>
        <FormControl.Label>Items</FormControl.Label>
        <Box
          onClick={createListItem}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button startIcon={<PlusIcon />}>Add item</Button>
        </Box>
      </Box>

      <Box style={{ display: 'flex', flexFlow: 'column nowrap', gap: '24px' }}>
        <TextInput
          placeholder="Search for a list item"
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
                    contentType="List Item"
                    title={
                      item.fields.title?.[sdk.locales.default] ?? 'Untitled'
                    }
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

export default ListPageEditor
