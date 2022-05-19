import { defineMessages } from 'react-intl'

export const caseDates = defineMessages({
  restrictionExpired: {
    id: 'judicial.system.core:case_dates.restriction_expired',
    defaultMessage:
      '{caseType, select, ADMISSION_TO_FACILITY {Vistun} TRAVEL_BAN {Farbann} other {Gæsla}} rann út {date}',
    description: 'Texti sem tilgreinir hvenær gæsla/vistun/farbann rann út',
  },
  restrictionValidTo: {
    id: 'judicial.system.core:case_dates.restriction_valid_to',
    defaultMessage:
      '{caseType, select, ADMISSION_TO_FACILITY {Vistun} TRAVEL_BAN {Farbann} other {Gæsla}} til {date}',
    description: 'Texti sem tilgreinir hvenær gæsla/vistun/farbann rennur út',
  },
  isolationValidTo: {
    id: 'judicial.system.core:case_dates.isolation_valid_to',
    defaultMessage: 'Einangrun til {date}',
    description: 'Texti sem tilgreinir hvenær einangrun rennur út',
  },
})
