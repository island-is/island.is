import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  placeholder: {
    id: 'judicial.system.core:prosecutor_selection.placeholder_v2',
    defaultMessage:
      'Veldu {isIndictmentCase, select, true {ákæranda} other {sækjanda}}',
    description:
      'Notaður sem skýritexti í "Veldu sækjanda/ákæranda" textaboxi á óskir um fyrirtöku skrefi í öllum málstegundum.',
  },
  label: {
    id: 'judicial.system.core:prosecutor_selection.label_v2',
    defaultMessage:
      'Veldu {isIndictmentCase, select, true {ákæranda} other {sækjanda}}',
    description:
      'Notaður sem titill í "Veldu sækjanda/ákæranda" textaboxi á óskir um fyrirtöku skrefi í öllum málstegundum.',
  },
})
