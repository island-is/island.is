import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  scheduled: {
    id: 'judicial.system.core:info_card_case_scheduled.scheduled',
    defaultMessage: 'Á dagskrá',
    description: 'Notaður sem texti sem tilgreinir að málið sé á dagskrá',
  },
  courtRoom: {
    id: 'judicial.system.core:info_card_case_scheduled.court_room',
    defaultMessage:
      '{courtRoom, select, NONE {Dómsalur hefur ekki verið skráður} other {Dómsalur {courtRoom}}}',
    description: 'Notaður sem texti sem tilgreinir hvaða dómsalur er skráður',
  },
})
