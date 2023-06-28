import { defineMessages } from 'react-intl'

export const statement = defineMessages({
  title: {
    id: 'judicial.system.core:statement.title',
    defaultMessage: 'Greinargerð',
    description: 'Titill á greinargerðarskjá',
  },
  appealActorAndDate: {
    id: 'judicial.system.core:appeal_actor_and_date_v2',
    defaultMessage:
      'Kært af {appealedByProsecutor, select, true {sækjanda} other {verjanda}} {date}',
    description: 'Texti sem sýnir hver kærði og hvenær',
  },
  appealActorInCourt: {
    id: 'judicial.system.core:appeal_actor_in_court',
    defaultMessage:
      '{appealedByProsecutor, select, true {Sækjandi} other {Varnaraðili}} kærði í þinghaldi',
    description: 'Texti sem sýnir hver kærði í þinghaldi',
  },
  uploadStatementTitle: {
    id: 'judicial.system.core:upload_statement_title',
    defaultMessage: 'Greinargerð',
    description: 'Titill á Hlaða upp greinargerð á greinargerðarskjá',
  },
  uploadStatementCaseFilesTitle: {
    id: 'judicial.system.core:upload_statement_case_files_title',
    defaultMessage: 'Gögn',
    description: 'Titill á Hlaða upp gögnum á greinargerðarskjá',
  },
  uploadStatementCaseFilesSubtitle: {
    id: 'judicial.system.core:upload_statement_case_files_subtitle',
    defaultMessage:
      'Ef ný gögn eiga að fylgja greinargerðinni er hægt að hlaða þeim upp hér að neðan.',
    description: 'Lýsing á Hlaða upp gögnum á greinargerðarskjá',
  },
  nextButtonText: {
    id: 'judicial.system.core:statement.next_button_text',
    defaultMessage: 'Senda greinargerð',
    description: 'Texti á áfram takka á greinargerðar skjá',
  },
  statementSentModalTitle: {
    id: 'judicial.system.core:statement_sent_title',
    defaultMessage: 'Greinargerð hefur verið send Landsrétti',
    description:
      'Titill í Greinargerð hefur verið send Landsrétti héraðsdómstól modal',
  },
  statementSentModalText: {
    id: 'judicial.system.core:statement_sent_text_v2',
    defaultMessage:
      'Tilkynning um greinargerð hefur verið send Landsrétti og {isDefender, select, true {sækjanda} other {verjanda}}.',
    description:
      'Texti í Greinargerð hefur verið send Landsrétti héraðsdómstól modal',
  },
})
