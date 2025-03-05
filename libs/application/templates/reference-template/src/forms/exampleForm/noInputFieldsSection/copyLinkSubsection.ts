import {
  buildCopyLinkField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'

export const copyLinkSubsection = buildSubSection({
  id: 'copyLinkSubsection',
  title: 'Copy link',
  children: [
    buildMultiField({
      id: 'copyLinkMultiField',
      title: 'Copy link',
      children: [
        buildCopyLinkField({
          id: 'copyLinkField',
          title: 'Copy link',
          description: 'Copy link description',
          link: 'https://www.google.com',
          marginTop: 2,
          marginBottom: 4,
        }),
        buildCopyLinkField({
          id: 'copyLinkField2',
          title: 'Copy link, with your location',
          link: document.location.origin,
        }),
      ],
    }),
  ],
})
