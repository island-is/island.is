import { defineMessages } from 'react-intl'

export const defenderInput = defineMessages({
  nameLabel: {
    id: 'judicial.system.core:defender_input.name_label',
    defaultMessage:
      'Nafn {sessionArrangements, select, ALL_PRESENT_SPOKESPERSON {talsmanns} other {verjanda}}',
    description: 'Notaður sem titill á inputi fyrir skipaðan verjanda.',
  },
  namePlaceholder: {
    id: 'judicial.system.core:defender_input.name_placeholder',
    defaultMessage: 'Fult nafn',
    description: 'Notaður sem hálpartexti á inputi fyrir skipaðan verjanda.',
  },
  emailLabel: {
    id: 'judicial.system.core:defender_input.email_label',
    defaultMessage:
      'Netfang {sessionArrangements, select, ALL_PRESENT_SPOKESPERSON {talsmanns} other {verjanda}}',
    description:
      'Notaður sem titill á inputi fyrir netfang skipaðans verjanda.',
  },
  emailPlaceholder: {
    id: 'judicial.system.core:defender_input.email_placeholder',
    defaultMessage: 'Netfang',
    description:
      'Notaður sem hálpartexti á inputi fyrir netfang skipaðans verjanda.',
  },
  phoneNumberLabel: {
    id: 'judicial.system.core:defender_input.phone_number_label',
    defaultMessage:
      'Símanúmer {sessionArrangements, select, ALL_PRESENT_SPOKESPERSON {talsmanns} other {verjanda}}',
    description:
      'Notaður sem titill á inputi fyrir símanúmer skipaðans verjanda.',
  },
  phoneNumberPlaceholder: {
    id: 'judicial.system.core:defender_input.phone_number_placeholder',
    defaultMessage: 'Símanúmer',
    description:
      'Notaður sem hálpartexti á inputi fyrir símanúmer skipaðans verjanda.',
  },
})
