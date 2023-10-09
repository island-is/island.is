import { defineMessages } from 'react-intl'

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
    id: 'judicial.system.core:police_case_number.placeholder.v1',
    defaultMessage: '{prefix}-{year}-X',
    description:
      'Notaður sem skýritexti í "LÖKE málsnúmer" textaboxi á sakbornings skrefi í öllum málstegundum.',
  },
  buttonText: {
    id: 'judicial.system.core:police_case_number.button_text',
    defaultMessage: 'Bæta við númeri',
    description:
      'Notaður sem texti á "Bæta við númeri" takkann á sakbornings skrefi í öllum málstegundum.',
  },
  noPoliceCaseNumbersAssignedMessage: {
    id: 'judicial.system.core:police_case_number.no_police_case_numbers_assigned_message',
    defaultMessage: 'Ekkert LÖKE-málsnúmer hefur verið skráð',
    description: 'Notaður sem texti þegar ekkert LÖKE-málsnúmer er skráð.',
  },
})
