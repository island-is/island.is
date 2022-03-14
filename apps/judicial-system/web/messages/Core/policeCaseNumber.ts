import { defineMessages } from 'react-intl'

// Strings for the lokeCaseNumber component
export const policeCaseNumber = defineMessages({
  heading: {
    id: 'judicial.system.core:police_case_number.heading',
    defaultMessage: 'Málsnúmer lögreglu',
    description:
      'Notaður sem titill fyrir "málsnúmer lögreglu" hlutann á sakbornings skrefi í öllum málstegundum.',
  },
  label: {
    id: 'judicial.system.core:police_case_number.label',
    defaultMessage: 'Slá inn LÖKE málsnúmer',
    description:
      'Notaður sem titill í "LÖKE málsnúmer" textaboxi á sakbornings skrefi í öllum málstegundum.',
  },
  placeholder: {
    id: 'judicial.system.core:police_case_number.placeholder',
    defaultMessage: '007-{year}-X',
    description:
      'Notaður sem skýritexti í "LÖKE málsnúmer" textaboxi á sakbornings skrefi í öllum málstegundum.',
  },
})
