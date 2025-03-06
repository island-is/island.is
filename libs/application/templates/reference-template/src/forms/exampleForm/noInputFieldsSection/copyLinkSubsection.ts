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
          link: (_application) => {
            // build link based on answers or external data
            return document.location.origin
          },
          marginBottom: 4,
        }),
        buildCopyLinkField({
          id: 'copyLinkField3',
          title: 'Custom button title and semibold text',
          link: 'https://www.google.com',
          semiBoldLink: true,
          buttonTitle: 'Custom button title',
        }),
      ],
    }),
  ],
})
