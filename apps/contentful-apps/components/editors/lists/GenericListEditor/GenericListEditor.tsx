import { useMemo, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { CollectionProp, EntryProps, KeyValueMap } from 'contentful-management'
import dynamic from 'next/dynamic'
import { EditorExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  EntryCard,
  FormControl,
  Pagination,
  Spinner,
  Stack,
  Text,
  TextInput,
} from '@contentful/f36-components'
import { PlusIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { mapLocalesToFieldApis } from '../../utils'

const SEARCH_DEBOUNCE_TIME_IN_MS = 300
const LIST_ITEM_CONTENT_TYPE_ID = 'genericListItem'
const LIST_ITEMS_PER_PAGE = 4

const createLocaleToFieldMapping = (sdk: EditorExtensionSDK) => {
  return {
    internalTitle: mapLocalesToFieldApis(
      [sdk.locales.default],
      sdk,
      'internalTitle',
    ),
    searchInputPlaceholder: mapLocalesToFieldApis(
      sdk.locales.available,
      sdk,
      'searchInputPlaceholder',
    ),
    cardIntroTemplate: mapLocalesToFieldApis(
      sdk.locales.available,
      sdk,
      'cardIntroTemplate',
    ),
  }
}

const ContentfulField = dynamic(
  () =>
    // Dynamically import via client side rendering since the @contentful/default-field-editors package accesses the window and navigator global objects
    import('../../ContentfulField').then(
      ({ ContentfulField }) => ContentfulField,
    ),
  {
    ssr: false,
  },
)

export const GenericListEditor = () => {
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

  const defaultLocale = sdk.locales.default

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
            'fields.internalTitle[match]': searchValue,
            'fields.genericList.sys.id': sdk.entry.getSys().id,
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
        setLoading(false)
      }
    },
    SEARCH_DEBOUNCE_TIME_IN_MS,
    [page, searchValue, counter],
  )

  const createListItem = async () => {
    const cardIntro = {}

    for (const locale of sdk.locales.available) {
      cardIntro[locale] = sdk.entry.fields.cardIntroTemplate.getValue(locale)
    }

    const listItem = await cma.entry.create(
      {
        contentTypeId: LIST_ITEM_CONTENT_TYPE_ID,
        environmentId: sdk.ids.environment,
        spaceId: sdk.ids.space,
      },
      {
        fields: {
          genericList: {
            [defaultLocale]: {
              sys: {
                id: sdk.entry.getSys().id,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
          cardIntro,
        },
      },
    )
    sdk.navigator
      .openEntry(listItem.sys.id, {
        slideIn: { waitForClose: true },
      })
      .then(() => {
        setCounter((c) => c + 1)
      })
  }

  const localeToFieldMapping = useMemo(() => {
    return createLocaleToFieldMapping(sdk)
  }, [sdk])

  return (
    <Box
      paddingLeft="spacingS"
      paddingRight="spacingS"
      paddingTop="spacingL"
      paddingBottom="spacingL"
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        gap: '24px',
        margin: '0 auto',
        maxWidth: '768px',
      }}
    >
      <ContentfulField
        fieldID="internalTitle"
        displayName="Internal Title"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
      />

      <ContentfulField
        fieldID="searchInputPlaceholder"
        displayName="Search Input Placeholder"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
      />

      <ContentfulField
        fieldID="cardIntroTemplate"
        displayName="Card Intro Template"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
        helpText="This text will be copied to the Card Intro field of a newly created List Item"
      />

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
                      item.fields.internalTitle?.[defaultLocale] ?? 'Untitled'
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
    </Box>
  )
}
