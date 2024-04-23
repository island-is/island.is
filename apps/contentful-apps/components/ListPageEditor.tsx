import { useMemo, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { CollectionProp, EntryProps, KeyValueMap } from 'contentful-management'
import { EditorExtensionSDK } from '@contentful/app-sdk'
import { Field, FieldWrapper } from '@contentful/default-field-editors'
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

const SEARCH_DEBOUNCE_TIME_IN_MS = 300
const LIST_ITEM_CONTENT_TYPE_ID = 'listItem'
const LIST_ITEMS_PER_PAGE = 4

const getFieldApiForLocale = (
  locale: string,
  sdk: EditorExtensionSDK,
  fieldName: keyof typeof sdk.entry.fields,
) => {
  return {
    ...sdk,
    field: sdk.entry.fields[fieldName].getForLocale(locale),
  }
}

const mapLocalesToFieldApis = (
  locales: string[],
  sdk: EditorExtensionSDK,
  fieldName: string,
) => {
  const mapping = new Map<string, ReturnType<typeof getFieldApiForLocale>>()

  for (const locale of locales) {
    mapping.set(locale, getFieldApiForLocale(locale, sdk, fieldName))
  }

  return Object.fromEntries(mapping)
}

const createLocaleToFieldMapping = (sdk: EditorExtensionSDK) => {
  return {
    internalTitle: mapLocalesToFieldApis(
      [sdk.locales.default],
      sdk,
      'internalTitle',
    ),
    title: mapLocalesToFieldApis(sdk.locales.available, sdk, 'title'),
    relativeUrl: mapLocalesToFieldApis(
      sdk.locales.available,
      sdk,
      'relativeUrl',
    ),
    listItemThumbnailContentTemplate: mapLocalesToFieldApis(
      sdk.locales.available,
      sdk,
      'listItemThumbnailContentTemplate',
    ),
  }
}

const ContentfulField = (props: {
  sdk: EditorExtensionSDK
  localeToFieldMapping: ReturnType<typeof createLocaleToFieldMapping>
  fieldID: keyof typeof props.localeToFieldMapping
  displayName: string
  widgetId?: string
}) => {
  const availableLocales = useMemo(() => {
    const validLocales = props.sdk.locales.available.filter(
      (locale) => props.localeToFieldMapping[props.fieldID]?.[locale],
    )

    // Make sure that the default locale is at the top
    if (validLocales[0] !== props.sdk.locales.default) {
      const index = validLocales.findIndex(
        (locale) => locale === props.sdk.locales.default,
      )
      if (index >= 0) {
        validLocales.splice(index, 1)
        validLocales.unshift(props.sdk.locales.default)
      }
    }

    return validLocales
  }, [
    props.fieldID,
    props.localeToFieldMapping,
    props.sdk.locales.available,
    props.sdk.locales.default,
  ])

  return availableLocales.map((locale) => {
    return (
      <FieldWrapper
        key={locale}
        sdk={props.localeToFieldMapping[props.fieldID][locale]}
        name={props.displayName}
        showFocusBar={false}
        renderHeading={
          availableLocales.length > 1
            ? () => {
                return (
                  <Box
                    style={{
                      display: 'flex',
                      flexFlow: 'row nowrap',
                      gap: '6px',
                    }}
                  >
                    <FormControl.Label>{props.displayName}</FormControl.Label>
                    <Text fontColor="gray500">|</Text>
                    <Text fontColor="gray500">
                      {props.sdk.locales.names[locale]}
                    </Text>
                  </Box>
                )
              }
            : undefined
        }
      >
        <Field
          sdk={props.localeToFieldMapping[props.fieldID][locale]}
          widgetId={props.widgetId}
        />
      </FieldWrapper>
    )
  })
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
    const thumbnailContent = {}

    for (const locale of sdk.locales.available) {
      thumbnailContent[locale] =
        sdk.entry.fields.listItemThumbnailContentTemplate.getValue(locale)
    }

    const listItem = await cma.entry.create(
      {
        contentTypeId: LIST_ITEM_CONTENT_TYPE_ID,
        environmentId: sdk.ids.environment,
        spaceId: sdk.ids.space,
      },
      {
        fields: {
          listPage: {
            [defaultLocale]: {
              sys: {
                id: sdk.entry.getSys().id,
                linkType: 'Entry',
                type: 'Link',
              },
            },
          },
          thumbnailContent,
        },
      },
    )
    sdk.navigator.openEntry(listItem.sys.id, {
      slideIn: true,
    })
    setCounter((counter) => counter + 1)
  }

  const fields = useMemo(() => {
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
        gap: '16px',
        margin: '0 auto',
        maxWidth: '768px',
      }}
    >
      <ContentfulField
        fieldID="internalTitle"
        displayName="Internal Title"
        localeToFieldMapping={fields}
        sdk={sdk}
      />

      <ContentfulField
        fieldID="title"
        displayName="Displayed Title"
        localeToFieldMapping={fields}
        sdk={sdk}
      />

      <ContentfulField
        fieldID="relativeUrl"
        displayName="Relative URL"
        localeToFieldMapping={fields}
        sdk={sdk}
      />

      <ContentfulField
        fieldID="listItemThumbnailContentTemplate"
        displayName="Intro Template"
        localeToFieldMapping={fields}
        sdk={sdk}
      />

      {/* 
      <Box>
        {availableLocales.map((locale) => (
          <FormControl key={locale}>
            <Box
              style={{ display: 'flex', flexFlow: 'row nowrap', gap: '6px' }}
            >
              <FormControl.Label>Intro template</FormControl.Label>
              <Text fontColor="gray600">|</Text>
              <Text fontColor="gray600">{sdk.locales.names[locale]}</Text>
            </Box>
            <Field
              sdk={getFieldApiForLocale(
                locale,
                sdk,
                'listItemThumbnailContentTemplate',
              )}
              widgetId="richTextEditor"
            />
            <FormControl.HelpText>
              When creating a new list item this text will be copied over to the
              card intro field for that list item
            </FormControl.HelpText>
          </FormControl>
        ))}
      </Box> */}
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
                    title={item.fields.title?.[defaultLocale] ?? 'Untitled'}
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
