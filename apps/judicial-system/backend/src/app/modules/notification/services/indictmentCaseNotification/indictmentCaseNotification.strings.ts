import { defineMessages } from '@formatjs/intl'

export const strings = {
  indictmentCompletedWithRuling: defineMessages({
    subject: {
      id: 'judicial.system.backend:indictment_case_notifications.verdict_service.subject',
      defaultMessage: 'Máli lokið {courtCaseNumber}',
      description:
        'Notað sem titill í tilkynningu um stöðu birtingar dóms í lokinni ákæru',
    },
    body: {
      id: 'judicial.system.backend:indictment_case_notifications.verdict_service.body',
      defaultMessage:
        'Máli {courtCaseNumber} hjá {courtName} hefur verið lokið.\n\nNiðurstaða: Dómur\n\n{serviceRequirement, select, REQUIRED {Birta skal dómfellda dóminn} NOT_REQUIRED {Birting dóms ekki þörf} NOT_APPLICABLE {Dómfelldi var viðstaddur dómsuppkvaðningu} other {}}\n\n{caseOrigin, select, LOKE {Dómur er aðgengilegur í LÖKE.} other {}}',
      description:
        'Notað sem body í tilkynningu um stöðu birtingar dóms í lokinni ákæru',
    },
  }),
}
