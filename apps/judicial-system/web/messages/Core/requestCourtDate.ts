import { defineMessage, defineMessages } from 'react-intl'

export const requestCourtDate = {
  heading: defineMessage({
    id: 'judicial.system.core:requested_court_date.heading',
    defaultMessage: 'Ósk um fyrirtökudag og tíma',
    description:
      'Notaður sem titill fyrir "ósk um fyrirtökudag og tíma" hlutann á sakbornings skrefi í gæsluvarðhalds-, farbannsmálum og í rannsóknarheimildum.',
  }),
  tooltip: defineMessage({
    id: 'judicial.system.core:requested_court_date.tooltip',
    defaultMessage:
      'Dómstóll hefur þennan tíma til hliðsjónar þegar fyrirtökutíma er úthlutað og mun leitast við að taka málið fyrir í tæka tíð en ekki fyrir þennan tíma.',
    description:
      'Notaður sem upplýsingatexti í upplýsingasvæði við "ósk um fyrirtökudag og tíma" fyrirsögnina á sakbornings skrefi í gæsluvarðhalds-, farbannsmálum og í rannsóknarheimildum.',
  }),
  dateInput: defineMessages({
    timeLabel: {
      id: 'judicial.system.core:requested_court_date.date_input.time_label',
      defaultMessage: 'Ósk um tíma (kk:mm)',
      description:
        'Notaður sem titill í textaboxi fyrir "Ósk um tíma" á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
  }),
  courtDate: defineMessage({
    id: 'judicial.system.core:requested_court_date.court_date',
    defaultMessage: 'Fyrirtökudegi og tíma hefur verið úthlutað',
    description:
      'Skýritexti sem útskýrir fyrir saksóknurum að búið sé að útluta fyrirtökudegi og tíma af dómara.',
  }),
}
