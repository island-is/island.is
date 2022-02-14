import { defineMessages } from 'react-intl'

export const ruling = defineMessages({
  label: {
    id: 'judicial.system.core:ruling.label',
    defaultMessage: 'Efni úrskurðar',
    description:
      'Notaður sem titill í úrskurðar textaboxi á úrskurðar skrefi í öllum málstegundum.',
  },
  placeholder: {
    id: 'judicial.system.core:ruling.placeholder',
    defaultMessage: 'Hver er niðurstaðan að mati dómara?',
    description:
      'Notaður sem skýritexti í úrskurðar textaboxi á úrskurðar skrefi í öllum málstegundum.',
  },
  autofill: {
    id: 'judicial.system.core:ruling.autofill',
    defaultMessage: '{judgeName} héraðsdómari kveður upp úrskurð þennan.',
    description:
      'Notaður sem sjálfgefinn texti í úrskurðar textaboxi á úrskurðar skrefi í öllum málstegundum.',
  },
})
