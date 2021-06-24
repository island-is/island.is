import { defineMessages, defineMessage } from 'react-intl'

// Strings for select prosecutor component
export const selectProsecutor = {
  heading: defineMessage({
    id: 'judicial.system:component.selectProsecutor.heading',
    defaultMessage: 'Ákærandi',
    description: 'Select prosecutor component: Heading',
  }),
  tooltip: defineMessage({
    id: 'judicial.system:component.selectProsecutor.tooltip',
    defaultMessage:
      'Sá saksóknari sem valinn er hér er skráður fyrir kröfunni í öllum upplýsingaskeytum og skjölum sem tengjast kröfunni, og flytur málið fyrir dómstólum fyrir hönd síns embættis.',
    description: 'Select prosecutor component: Tooltip',
  }),
  select: defineMessages({
    label: {
      id: 'judicial.system:component.selectProsecutor.select.label',
      defaultMessage: 'Veldu saksóknara',
      description: 'Select prosecutor component select: Label',
    },
  }),
}
