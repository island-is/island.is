import { useEffect, useMemo, useState } from 'react'
import type { EntryProps, KeyValueMap } from 'contentful-management'
import dynamic from 'next/dynamic'
import type { EditorExtensionSDK } from '@contentful/app-sdk'
import { Box } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

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
    mynd: createField('mynd', sdk),
    imageOnSelect: createField('imageOnSelect', sdk),
    filterTags: createField('filterTags', sdk),
    email: createField('email', sdk),
    phone: createField('phone', sdk),
    intro: createField('intro', sdk),
  }
}

export const TeamMemberEditor = () => {
  const sdk = useSDK<EditorExtensionSDK>()
  const cma = useCMA()

  const localeToFieldMapping = useMemo(() => {
    return createLocaleToFieldMapping(sdk)
  }, [sdk])

  const [teamList, setTeamList] = useState<EntryProps<KeyValueMap>>()

  useEffect(() => {
    const fetchTeamList = async () => {
      const teamLists = await cma.entry.getMany({
        query: {
          content_type: 'teamList',
          links_to_entry: sdk.entry.getSys().id,
        },
      })
      if (teamLists.items.length > 0) setTeamList(teamLists.items[0])
    }

    fetchTeamList()
  }, [cma.entry, sdk.entry])

  const teamListIsAccordionVariant =
    teamList?.fields?.variant?.[sdk.locales.default] === 'accordion'

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
        displayName="Image on hover"
        fieldID="imageOnSelect"
        localeToFieldMapping={localeToFieldMapping}
        sdk={sdk}
        widgetId="assetLinkEditor"
        helpText="Leave empty unless there is a .gif that displays the person pronouncing their name in sign language"
      />
      {teamListIsAccordionVariant && (
        <Box>
          <ContentfulField
            displayName="Email"
            fieldID="email"
            localeToFieldMapping={localeToFieldMapping}
            sdk={sdk}
          />
          <ContentfulField
            displayName="Phone"
            fieldID="phone"
            localeToFieldMapping={localeToFieldMapping}
            sdk={sdk}
          />
          <ContentfulField
            displayName="Free text"
            fieldID="intro"
            localeToFieldMapping={localeToFieldMapping}
            sdk={sdk}
            widgetId="richTextEditor"
          />
        </Box>
      )}
      <TeamMemberFilterTagsField sdk={sdk} />
    </Box>
  )
}
