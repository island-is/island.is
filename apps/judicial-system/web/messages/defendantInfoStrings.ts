import { defineMessages } from 'react-intl'

// Strings for Prosecutor restriction request defendantForm
export const defendantInfoStrings = {
  gender: defineMessages({
    label: {
      id: 'judicial.system:component.defendant.gender.label',
      defaultMessage: 'Kyn',
      description: 'Defendant component gender field: Label',
    },
    male: {
      id: 'judicial.system:component.defendant.gender.male',
      defaultMessage: 'Karl',
      description: 'Defendant component gender field: Male',
    },
    female: {
      id: 'judicial.system:component.defendant.gender.female',
      defaultMessage: 'Kona',
      description: 'Defendant component gender field: Female',
    },
    other: {
      id: 'judicial.system:component.defendant.gender.other',
      defaultMessage: 'Kynsegin/Annað',
      description: 'Defendant component gender field: Other',
    },
  }),
  nationalId: defineMessages({
    label: {
      id: 'judicial.system:component.defendant.nationalId.label',
      defaultMessage: 'Kennitala',
      description: 'Defendant component nationalId field: Label',
    },
    placeholder: {
      id: 'judicial.system:component.defendant.nationalId.placeholder',
      defaultMessage: 'Kennitala',
      description: 'Defendant component nationalId field: Placeholder',
    },
  }),
  name: defineMessages({
    label: {
      id: 'judicial.system:component.defendant.name.label',
      defaultMessage: 'Fullt nafn',
      description: 'Defendant component name field: Label',
    },
    placeholder: {
      id: 'judicial.system:component.defendant.name.placeholder',
      defaultMessage: 'Fullt nafn',
      description: 'Defendant component name field: Placeholder',
    },
  }),
  address: defineMessages({
    label: {
      id: 'judicial.system:component.defendant.address.label',
      defaultMessage: 'Fullt nafn',
      description: 'Defendant component address field: Label',
    },
    placeholder: {
      id: 'judicial.system:component.defendant.address.placeholder',
      defaultMessage: 'Fullt nafn',
      description: 'Defendant component address field: Placeholder',
    },
  }),
}
