import {
  buildActionCardListField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const actionCardSection = buildSection({
  id: 'actionCardSection',
  title: 'Action card',
  children: [
    buildMultiField({
      id: 'actionCardMultiField',
      title: 'BuildMultiField',
      children: [
        buildActionCardListField({
          id: 'actionCardList',
          title: 'Action cards with buttons',
          items: (_application, _lang) => {
            return [
              {
                eyebrow: 'Card eyebrow',
                heading: 'Card heading, all the options',
                headingVariant: 'h3',
                text: 'Card text, lorem ipsum dolor sit amet dolor sit amet lorem ipsum dolor sit amet',
                cta: {
                  label: 'Card cta',
                  variant: 'primary',
                  external: true,
                  to: 'https://www.google.com',
                },
                tag: {
                  label: 'Outlined label',
                  outlined: true,
                  variant: 'blue',
                },
              },
              {
                heading: 'Card heading',
                headingVariant: 'h4',
                tag: {
                  label: 'Not outlined label',
                  outlined: false,
                  variant: 'blue',
                },
                cta: {
                  label: 'Card cta',
                  variant: 'primary',
                  external: true,
                  to: 'https://www.google.com',
                },
                unavailable: {
                  label: 'Unavailable label',
                  message: 'Unavailable message',
                },
              },
              {
                heading: 'Card heading',
                headingVariant: 'h4',
                tag: {
                  label: 'White label',
                  outlined: true,
                  variant: 'white',
                },
              },
            ]
          },
        }),
      ],
    }),
  ],
})
