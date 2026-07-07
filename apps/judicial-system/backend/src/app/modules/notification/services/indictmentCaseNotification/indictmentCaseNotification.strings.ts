import { defineMessages } from '@formatjs/intl'

export const strings = {
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
