import { defineMessages } from 'react-intl'

// Strings on signed verdict overview screen
export const strings = defineMessages({
  rulingDate: {
    id: 'judicial.system.core:defender_case_overview.ruling_date_v2',
    defaultMessage: 'Úrskurðað {rulingDate}',
    description: 'Notaður fyrir tíma úrskurðar á yfirlitsskjá verjanda.',
  },
  modifiedDatesHeading: {
    id: 'judicial.system.core:defender_case_overview.modified_dates_heading',
    defaultMessage:
      'Lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæslu}} uppfærð',
    description:
      'Notaður sem titill í upplýsingaboxi um uppfærða lengd gæslu á yfirlitsskjá verjanda.',
  },
  documentHeading: {
    id: 'judicial.system.core:defender_case_overview.document_heading',
    defaultMessage: 'Skjöl málsins',
    description:
      'Notaður sem titill fyrir skjöl málsins á yfirlitsskjá verjanda.',
  },
  unsignedRuling: {
    id: 'judicial.system.core:defender_case_overview.unsigned_ruling',
    defaultMessage: 'Úrskurður ekki undirritaður',
    description:
      'Texti sem birtist ef úrskurður er ekki undirritaður á yfirlitsskjá verjanda',
  },
  noRuling: {
    id: 'judicial.system.core:defender_case_overview.no_ruling',
    defaultMessage: 'Máli lokið án úrskurðar',
    description:
      'Texti sem birtist ef enginn úrskurður er skráður á yfirlitsskjá verjanda',
  },
  confirmAppealAfterDeadlineModalTitle: {
    id: 'judicial.system.core:defender_case_overview.confirm_appeal_after_deadline_modal_title',
    defaultMessage: 'Kærufrestur er liðinn',
    description:
      'Notaður sem titill modal glugga þegar kært er eftir að kærufrestur rennur út.',
  },
  confirmAppealAfterDeadlineModalText: {
    id: 'judicial.system.core:defender_case_overview.confirm_appeal_after_deadline_modal_text',
    defaultMessage: 'Viltu halda áfram og senda kæru?',
    description:
      'Notaður sem texti í modal glugga þegar kært er eftir að kærufrestur rennur út.',
  },
  confirmAppealAfterDeadlineModalPrimaryButtonText: {
    id: 'judicial.system.core:defender_case_overview.confirm_appeal_after_deadline_modal_primary_button_text',
    defaultMessage: 'Já, senda kæru',
    description:
      'Notaður sem texti í staðfesta takka í modal glugga þegar kært er eftir að kærufrestur rennur út.',
  },
  confirmAppealAfterDeadlineModalSecondaryButtonText: {
    id: 'judicial.system.core:defender_case_overview.confirm_appeal_after_deadline_modal_secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti í Hætta við takka í modal glugga þegar kært er eftir að kærufrestur rennur út.',
  },
  confirmStatementAfterDeadlineModalTitle: {
    id: 'judicial.system.core:case_overview.confirm_statement_after_deadline_modal_title',
    defaultMessage: 'Frestur til að skila greinargerð er liðinn',
    description:
      'Notaður sem titill í modal glugga hjá sækjanda þegar frestur til greinargerðar er liðinn.',
  },
  confirmStatementAfterDeadlineModalText: {
    id: 'judicial.system.core:case_overview.confirm_statement_after_deadline_modal_text',
    defaultMessage: 'Viltu halda áfram og senda greinargerð?',
    description:
      'Notaður sem texti í modal glugga hjá sækjanda þegar frestur til greinargerðar er liðinn.',
  },
  confirmStatementAfterDeadlineModalPrimaryButtonText: {
    id: 'judicial.system.core:case_overview.confirm_statement_after_deadline_modal_primary_button_text',
    defaultMessage: 'Já, senda greinargerð',
    description:
      'Notaður sem texti í staðfesta takka í modal glugga hjá verjanda þegar frestur til greinargerðar er liðinn.',
  },
  confirmStatementAfterDeadlineModalSecondaryButtonText: {
    id: 'judicial.system.core:case_overview.confirm_statement_after_deadline_modal_secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti í Hætta við takka í modal glugga hjá verjanda þegar frestur til greinargerðar er liðinn.',
  },
  noCourtNumber: {
    id: 'judicial.system.core:defender_case_overview.no_court_number',
    defaultMessage: 'Ekki skráð',
    description:
      'Notaður sem texti ef ekkert málsnúmer héraðsdóms er skráð á yfirlitsskjá verjanda.',
  },
  rulingModifiedTitle: {
    id: 'judicial.system.core:defender_case_overview.ruling_modified_title',
    defaultMessage: 'Úrskurður leiðréttur',
    description:
      'Notaður sem titill á modal þegar úrskurður er leiðréttur á yfirlitsskjá verjanda.',
  },
})
