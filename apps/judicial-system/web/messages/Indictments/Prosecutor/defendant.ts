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
    defendantInfo: {
      doesNotHaveIcelandicNationalId: defineMessage({
        id:
          'judicial.system.investigation_cases:defendant.defendant_info.does_not_have_icelandic_national_id_v2',
        defaultMessage: 'Ákærði er ekki með íslenska kennitölu',
        description:
          'Notaður sem texti í "Ákærði er ekki með íslenska kennitölu" hak í "upplýsingar um ákærða" hlutanum á ákærða skrefi í ákærum.',
      }),
      addDefendantButtonText: defineMessage({
        id:
          'judicial.system.indictments:defendant.defendant_info.add_defendant_button_text',
        defaultMessage: 'Bæta við ákærða',
        description:
          'Notaður sem text í "bæta við varnaraðila" takkann á varnaraðila skrefi í ákærum.',
      }),
    },
  },
}
