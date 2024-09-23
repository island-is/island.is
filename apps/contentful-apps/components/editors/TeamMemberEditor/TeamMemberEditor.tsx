import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import type { EditorExtensionSDK } from '@contentful/app-sdk'
import { Box } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

import { mapLocalesToFieldApis } from '../utils'
import { TeamMemberFilterTagsField } from './TeamMemberFilterTagsField'

const ContentfulField = dynamic(
  () =>
    // Dynamically import via client side rendering since the @contentful/default-field-editors package accesses the window and navigator global objects
    import('../ContentfulField').then(({ ContentfulField }) => ContentfulField),
  {
    ssr: false,
  },
)

const createField = (name: string, sdk: EditorExtensionSDK) => {
  return mapLocalesToFieldApis(sdk.entry.fields[name].locales, sdk, name)
}

const createLocaleToFieldMapping = (sdk: EditorExtensionSDK) => {
  return {
    name: createField('name', sdk),
    title: createField('title', sdk),
    image: createField('mynd', sdk),
    imageOnSelect: createField('imageOnSelect', sdk),
    filterTags: createField('filterTags', sdk),
    email: createField('email', sdk),
    phone: createField('phone', sdk),
    intro: createField('intro', sdk),
  }
}

export const TeamMemberEditor = () => {
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
        displayName="Name"
        fieldID="name"
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
        displayName="Image"
        fieldID="mynd"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
        widgetId="assetLinkEditor"
      />
      <ContentfulField
        displayName="Image on select"
        fieldID="imageOnSelect"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
        widgetId="assetLinkEditor"
      />
      <TeamMemberFilterTagsField sdk={sdk} />
    </Box>
  )
}
