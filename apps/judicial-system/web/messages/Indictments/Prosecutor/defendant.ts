import { defineMessage } from 'react-intl'

export const indictmentsDefendant = {
  heading: defineMessage({
    id: 'judicial.system.indictments:defendant.heading',
    defaultMessage: 'Ákærði',
    description: 'Notaður sem titill á ákærða skrefi í ákærum.',
  }),
  sections: {
    indictmentType: {
      heading: defineMessage({
        id: 'judicial.system.indictments:defendant.indictment_type.heading',
        defaultMessage: 'Brot',
        description:
          'Notaður sem titill fyrir "Brot" hlutanum á ákærða skrefi í ákærum.',
      }),
      label: defineMessage({
        id: 'judicial.system.indictments:defendant.indictment_type.label',
        defaultMessage: 'Tegund brots',
        description:
          'Notaður sem titill í "Tegund brots" listanum á ákærða skrefi í ákærum.',
      }),
      placeholder: defineMessage({
        id: 'judicial.system.indictments:defendant.indictment_type.placeholder',
        defaultMessage: 'Veldu brot',
        description:
          'Notaður sem skýritexti í "Tegund brots" listanum á ákærða skrefi í ákærum.',
      }),
    },
  },
}
