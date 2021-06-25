import { defineMessage } from 'react-intl'

// Strings for select court component
export const requestCourtDate = {
  heading: defineMessage({
    id: 'judicial.system:component.requestCourtDate.heading',
    defaultMessage: 'Ósk um fyrirtökudag og tíma',
    description: 'Request court date component: Heading',
  }),
  tooltip: defineMessage({
    id: 'judicial.system:component.requestCourtDate.tooltip',
    defaultMessage:
      'Dómstóll hefur þennan tíma til hliðsjónar þegar fyrirtökutíma er úthlutað og mun leitast við að taka málið fyrir í tæka tíð en ekki fyrir þennan tíma.',
    description: 'Request court date component: Tooltip',
  }),
  dateInput: defineMessage({
    timeLabel: {
      id: 'judicial.system:component.selectCourt.select.timeLabel',
      defaultMessage: 'Ósk um tíma (kk:mm)',
      description: 'Request court date component date input: Time Label',
    },
  }),
  courtDate: defineMessage({
    id: 'judicial.system:component.selectCourt.select.timeLabel',
    defaultMessage: 'Fyrirtökudegi og tíma hefur verið úthlutað',
    description: 'Request court date component set court date: Text',
  }),
}
