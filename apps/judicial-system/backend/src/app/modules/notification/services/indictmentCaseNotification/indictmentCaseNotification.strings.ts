import { defineMessages } from '@formatjs/intl'

export const strings = {
  indictmentCompletedWithRuling: defineMessages({
    subject: {
      id: 'judicial.system.backend:indictment_case_notifications.verdict_service.subject_v2',
      defaultMessage:
        '{isCorrection, select, true {Mál leiðrétt} other {Máli lokið}} {courtCaseNumber}',
      description:
        'Notað sem titill í tilkynningu um stöðu birtingar dóms í lokinni ákæru',
    },
    body: {
      id: 'judicial.system.backend:indictment_case_notifications.verdict_service.body_v3',
      defaultMessage:
        '{isCorrection, select, true {Mál {courtCaseNumber} hjá {courtName} hefur verið leiðrétt.} other {Máli {courtCaseNumber} hjá {courtName} hefur verið lokið.}}<br ><br >Niðurstaða: Dómur<br ><br >{serviceRequirement, select, REQUIRED {Birta skal dómfellda dóminn} NOT_REQUIRED {Birting dóms ekki þörf} NOT_APPLICABLE {Dómfelldi var viðstaddur dómsuppkvaðningu} other {}}<br ><br >{caseOrigin, select, LOKE {Dómur er aðgengilegur í LÖKE ({policeCaseNumber}).} other {}}',
      description:
        'Notað sem body í tilkynningu um stöðu birtingar dóms í lokinni ákæru',
    },
  }),
  criminalRecordFilesUploadedEmail: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.criminal_record_files_uploaded_email.subject',
      defaultMessage: 'Tilkynning til sakaskrár í máli {courtCaseNumber}',
      description:
        'Fyrirsögn í pósti til ritara sakaskrá þegar skjal fyrir tilkynningu til skakaskrár er hlaðið upp',
    },
    body: {
      id: 'judicial.system.backend:notifications.criminal_record_files_uploaded_email.body',
      defaultMessage:
        'Máli {courtCaseNumber} hjá {courtName} hefur verið lokið. Skjöl málsins eru aðgengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}',
      description:
        'Texti í pósti til ritara sakaskrá þegar skjal fyrir tilkynningu til skakaskrár er hlaðið upp',
    },
  }),
}
