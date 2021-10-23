import { defineMessages } from 'react-intl'

export const selectProsecutor = defineMessages({
  heading: {
    id: 'judicial.system.core:select_prosecutor.heading',
    defaultMessage: 'Ákærandi',
    description:
      'Notaður sem titill fyrir "ákærandi" hlutann á óskir um fyrirtöku skrefi í öllum málstegundum.',
  },
  label: {
    id: 'judicial.system.core:select_prosecutor.label',
    defaultMessage: 'Veldu sækjanda',
    description:
      'Notaður sem titill í "Veldu sækjanda" textaboxi á óskir um fyrirtöku skrefi í öllum málstegundum.',
  },
  tooltip: {
    id: 'judicial.system.core:select_prosecutor.tooltip',
    defaultMessage:
      'Sá ákærandi sem valinn er hér er skráður fyrir kröfunni í öllum upplýsingaskeytum og skjölum sem tengjast kröfunni, og flytur málið fyrir dómstólum fyrir hönd síns embættis.',
    description:
      'Notaður sem skýritexti fyrir "ákærandi" hlutann á óskir um fyrirtöku skrefi í öllum málstegundum.',
  },
})
