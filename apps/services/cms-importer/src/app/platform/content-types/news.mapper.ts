import { Document } from '@contentful/rich-text-types'
import { EntryCreationDto, Localized } from '../cms.types'
import { makeTagMetadata, mapLocalizedValue } from '../localization'

interface NewsEntryProps {
  organizationId: string
  title: Localized<string>
  slug: Localized<string>
  date: Localized<string>
  intro: Localized<string>
  content: Localized<Document>
  imageAssetId: string
}

export const generateNewsEntry = ({
  ownerTags,
  properties,
}: {
  ownerTags: string[]
  properties: NewsEntryProps
}): EntryCreationDto => ({
  metadata: makeTagMetadata(...ownerTags),
  fields: {
    organization: mapLocalizedValue<unknown>({
      sys: { id: properties.organizationId, linkType: 'Entry' },
    }),
    title: properties.title,
    slug: properties.slug,
    date: properties.date,
    intro: properties.intro,
    content: properties.content,
    image: mapLocalizedValue<unknown>({
      sys: { id: properties.imageAssetId, linkType: 'Asset' },
    }),
  },
})
