import { defineMessages } from 'react-intl'

export const closedCourt = defineMessages({
  text: {
    id: 'judicial.system.core:closed_court.text',
    defaultMessage:
      'Þinghaldið er háð fyrir luktum dyrum sbr. f-lið 10. gr. laga um meðferð sakamála nr. 88/2008.',
    description:
      'Notaður sem texti fyrir þinghald fyrir luktum dyrum í öllum málstegundum.',
  },
  tooltip: {
    id: 'judicial.system.core:closed_court.tooltip',
    defaultMessage:
      'Með því að fela forbókun um þinghald fyrir luktum dyrum birtist hún ekki í Þingbók málsins.',
    description:
      'Notaður sem upplýsingatexti í upplýsingasvæði við þinghald fyrir luktum dyrum í öllum málstegundum.',
  },
})
