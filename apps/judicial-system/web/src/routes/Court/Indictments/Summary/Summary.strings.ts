import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  htmlTitle: {
    id: 'judicial.system.core:indictments.summary.html_title',
    defaultMessage: 'Samantekt',
    description: 'Notaður sem titill á síðu í vafra',
  },
  title: {
    id: 'judicial.system.core:indictments.summary.title',
    defaultMessage: 'Samantekt',
    description: 'Notaður sem titill fyrir samantektarsíðu',
  },
  caseFiles: {
    id: 'judicial.system.core:indictments.summary.case_files',
    defaultMessage: 'Skjöl málsins',
    description: 'Notaður sem titill fyrir skjöl málsins',
  },
  caseFilesSubtitleRuling: {
    id: 'judicial.system.core:indictments.summary.case_files_subtitle_rulings_and_court_records',
    defaultMessage: 'Dómar, úrskurðir og þingbók',
    description:
      'Notaður sem undirtitill fyrir skjöl málsins ef um dóm er að ræða',
  },
  nextButtonText: {
    id: 'judicial.system.core:indictments.summary.next_button_text',
    defaultMessage: 'Staðfesta',
    description:
      'Notaður sem titill á Staðfesta takka á Samantektarskjá ákæru.',
  },
  completedCaseModalTitle: {
    id: 'judicial.system.core:indictments.summary.completed_case_modal_title',
    defaultMessage: 'Máli hefur verið lokið',
    description: 'Notaður sem titill á staðfestingarglugga um að mál sé lokið.',
  },
  completedCaseModalBody: {
    id: 'judicial.system.core:indictments.summary.completed_case_modal_body_v2',
    defaultMessage: 'Gögn hafa verið send ákæranda og verjanda.',
    description: 'Notaður sem texti í staðfestingarglugga um að mál sé lokið.',
  },
})
