import { useMemo } from 'react'
import { EditorExtensionSDK } from '@contentful/app-sdk'
import { Box } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

import { ContentfulField } from '../ContentfulField'
import { mapLocalesToFieldApis } from '../utils'

const createLocaleToFieldMapping = (sdk: EditorExtensionSDK) => {
  return {
    listPage: mapLocalesToFieldApis([sdk.locales.default], sdk, 'listPage'),
    internalTitle: mapLocalesToFieldApis(
      [sdk.locales.default],
      sdk,
      'internalTitle',
    ),
    title: mapLocalesToFieldApis(sdk.locales.available, sdk, 'title'),
    thumbnailContent: mapLocalesToFieldApis(
      sdk.locales.available,
      sdk,
      'thumbnailContent',
    ),
  }
}

const ListItemEditor = () => {
  const sdk = useSDK<EditorExtensionSDK>()

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
        gap: '16px',
        margin: '0 auto',
        maxWidth: '768px',
      }}
    >
      <ContentfulField
        displayName="List Page"
        fieldID="listPage"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
        widgetId="entryCardEditor"
      />
      <ContentfulField
        displayName="Internal Title"
        fieldID="internalTitle"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
      />
      <ContentfulField
        displayName="Title"
        fieldID="title"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
      />
      <ContentfulField
        displayName="Thumbnail Content"
        fieldID="thumbnailContent"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
        widgetId="richTextEditor"
      />
    </Box>
  )
}

export default ListItemEditor
