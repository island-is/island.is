import { defineMessage, defineMessages } from 'react-intl'

export const indictment = {
  heading: defineMessage({
    id: 'judicial.system.core:indictments_indictment.heading',
    defaultMessage: 'Ákæra',
    description: 'Notaður sem titill á ákæra skrefi í ákærum.',
  }),

  sections: {
    introduction: defineMessages({
      label: {
        id:
          'judicial.system.core:indictments_indictment.sections.introduction_label',
        defaultMessage: 'Inngangur',
        description:
          'Notaður sem titill á Inngangur textasvæði á ákæra skrefi í ákærum.',
      },
      placeholder: {
        id:
          'judicial.system.core:indictments_indictment.sections.introduction_placeholder',
        defaultMessage: 'Hver höfðar sakamál á hendur hverjum?',
        description:
          'Notaður sem skýritexti á Inngangur textasvæði á ákæra skrefi í ákærum.',
      },
    }),
    indictmentCount: defineMessages({
      heading: {
        id:
          'judicial.system.core:indictments_indictment.sections.indictment_count',
        defaultMessage: 'Ákæruliður {count}',
        description: 'Notaður sem titill á ákærulið.',
      },
      addCount: {
        id: 'judicial.system.core:indictments_indictment.sections.add_count',
        defaultMessage: 'Bæta við ákærulið',
        description: 'Notaður sem texti á "Bæta við ákærulið" hnappi.',
      },
    }),
  },
}
