import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { EditorExtensionSDK } from '@contentful/app-sdk'
import { Box, Button, FormControl } from '@contentful/f36-components'
import { PlusIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { EntryListSearch } from '../../../../components/EntryListSearch'
import { mapLocalesToFieldApis } from '../../utils'

const LIST_ITEM_CONTENT_TYPE_ID = 'genericListItem'

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

  /** Counter that's simply used to refresh the list when an item gets created */
  const [_, setCounter] = useState(0)

  const defaultLocale = sdk.locales.default

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
      <EntryListSearch
        contentTypeId={LIST_ITEM_CONTENT_TYPE_ID}
        contentTypeLabel="List Item"
        contentTypeTitleField="internalTitle"
        query={{
          'fields.genericList.sys.id': sdk.ids.entry,
        }}
      />
    </Box>
  )
}
