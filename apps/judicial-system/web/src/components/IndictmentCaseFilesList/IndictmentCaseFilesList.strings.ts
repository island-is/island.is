import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:indictment_case_files_list.title',
    defaultMessage: 'Skjöl málsins',
    description: 'Notaður sem titill á skjölum málsins í ákærum.',
  },
  caseFileTitle: {
    id: 'judicial.system.indictments:indictment_case_files_list.case_file_title',
    defaultMessage: 'Gagnapakkar',
    description: 'Titill á Gagnapakkar hluta á dómskjalaskjá í ákærum.',
  },
  caseFileButtonText: {
    id: 'judicial.system.indictments:indictment_case_files_list.case_file_button_text',
    defaultMessage: 'Skjalaskrá {policeCaseNumber}.pdf',
    description:
      'Notaður sem texti á PDF takka til að sækja gagnapakka í ákærum.',
  },
  courtRecordTitle: {
    id: 'judicial.system.core:court.indictment_case_files_list.court_record_title',
    defaultMessage: 'Þingbók',
    description:
      'Notaður sem titill á þingbókar hluta á dómskjalaskjá í ákærum.',
  },
  rulingTitle: {
    id: 'judicial.system.core:court.indictment_case_files_list.ruling_titles',
    defaultMessage: 'Dómar, úrskurður og þingbók',
    description: 'Notaður sem titill á dómur hluta á dómskjalaskjá í ákærum.',
  },
})
