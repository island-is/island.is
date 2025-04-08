import { defineMessages } from 'react-intl'

export const tables = defineMessages({
  caseNumber: {
    id: 'judicial.system.core:tables.case_number_v1',
    defaultMessage: 'Málsnúmer',
    description: 'Notaður sem titill fyrir málsnúmer dálk í lista yfir mál.',
  },
  type: {
    id: 'judicial.system.core:tables.type',
    defaultMessage: 'Tegund',
    description: 'Notaður sem titill fyrir tegund dálk í lista yfir mál.',
  },
  state: {
    id: 'judicial.system.core:tables.state',
    defaultMessage: 'Staða',
    description: 'Notaður sem titill fyrir staða dálk í lista yfir mál.',
  },
  duration: {
    id: 'judicial.system.core:tables.duration',
    defaultMessage: 'Gildistími',
    description: 'Notaður sem titill fyrir gildistíma dálk í lista yfir mál.',
  },
  appealDate: {
    id: 'judicial.system.core:tables.appeal_date',
    defaultMessage: 'Kært',
    description: 'Notaður sem titill fyrir kært dálk í lista yfir mál.',
  },
  newTag: {
    id: 'judicial.system.core:tables.new_tag',
    defaultMessage: 'Nýtt',
    description: 'Notað sem merki þegar mál í stöðu "Nýtt" í málalista',
  },
  receivedTag: {
    id: 'judicial.system.core:tables.received_tag',
    defaultMessage: 'Móttekið',
    description: 'Notað sem merki þegar mál í stöðu "Móttekið" í málalista',
  },
  completedTag: {
    id: 'judicial.system.core:tables.completed_tag',
    defaultMessage: 'Lokið',
    description: 'Notað sem merki þegar mál í stöðu "Lokið" í málalista',
  },
  withdrawnTag: {
    id: 'judicial.system.core:tables.withdrawn_tag',
    defaultMessage: 'Afturkallað',
    description: 'Notað sem merki þegar mál í stöðu "Afturkallað" í málalista',
  },
  completedCasesTitle: {
    id: 'judicial.system.core:tables.completed_cases_title',
    defaultMessage: 'Afgreidd mál',
    description: 'Notaður sem titill á lista yfir afgreidd mál.',
  },
  extension: {
    id: 'judicial.system.core:tables.extension',
    defaultMessage: 'Framlenging',
    description:
      'Notaður sem texti sem segir til um hvort mál sé framlenging í málalista.',
  },
  sentToCourtDate: {
    id: 'judicial.system.core:tables.sent_to_court_date',
    defaultMessage: 'Útgáfudagur',
    description: 'Notaður sem titill fyrir Útgáfudagur dálk í lista yfir mál.',
  },
  hearingArrangementDate: {
    id: 'judicial.system.core:tables.hearing_arrangement_date',
    defaultMessage: 'Fyrirtaka',
    description: 'Notaður sem titill fyrir fyrirtöku dálk í lista yfir mál.',
  },
  filterIndictmentCaseLabel: {
    id: 'judicial.system.core:tables.filter_indictment_case_label',
    defaultMessage: 'Sakamál',
    description: 'Notaður sem titill fyrir Sakamál í síun.',
  },
  filterInvestigationCaseLabel: {
    id: 'judicial.system.core:tables.filter_investigation_case_label',
    defaultMessage: 'Rannsóknarmál',
    description: 'Notaður sem titill fyrir Rannsóknarmál í síun.',
  },
  prosecutor: {
    id: 'judicial.system.core:tables.prosecutor',
    defaultMessage: 'Sækjandi',
    description: 'Notaður sem titill fyrir sækjanda í málalista.',
  },
  prosecutorName: {
    id: 'judicial.system.core:tables.prosecutor_name',
    defaultMessage: 'Saksóknari',
    description: 'Notaður sem titill fyrir saksóknara í málalista.',
  },
  deadline: {
    id: 'judicial.system.core:tables.deadline',
    defaultMessage: 'Frestur',
    description: 'Notaður sem titill fyrir frestur dálk í lista yfir mál.',
  },
  reviewDecision: {
    id: 'judicial.system.core:tables.review_decision',
    defaultMessage: 'Ákvörðun',
    description: 'Notaður sem titill fyrir ákvörðun dálk í lista yfir mál.',
  },
  verdictViewState: {
    id: 'judicial.system.core:tables.verdict_view_state',
    defaultMessage: 'Birtingarstaða',
    description:
      'Notaður sem titill fyrir birtingarstaða dálk í lista yfir mál.',
  },
  postponed: {
    id: 'judicial.system.core:tables.postponed',
    defaultMessage: 'Frestað',
    description: 'Notaður sem texti þegar mál er frestað.',
  },
  court: {
    id: 'judicial.system.core:tables.court',
    defaultMessage: 'Dómstóll',
    description: 'Notaður sem titill fyrir dómstóll dálk í lista yfir mál.',
  },
  punishmentType: {
    id: 'judicial.system.core:tables.punishment_type',
    defaultMessage: 'Refsitegund',
    description: 'Notaður sem titill fyrir refsitegund dálk í lista yfir mál.',
  },
  sentencingDate: {
    id: 'judicial.system.core:tables.sentencing_date',
    defaultMessage: 'Dómsuppkvaðning',
    description:
      'Notaður sem titill fyrir Dómsuppkvaðning dálk í lista yfir mál.',
  },
  caseFileName: {
    id: 'judicial.system.core:tables.case_file_name',
    defaultMessage: 'Nafn skjals',
    description: 'Notaður sem titill fyrir nafn dálk í lista yfir mál.',
  },
  caseFileDate: {
    id: 'judicial.system.core:tables.case_file_date',
    defaultMessage: 'Dagsetning skjals',
    description: 'Notaður sem titill fyrir dagsetningu í lista yfir mál.',
  },
  received: {
    id: 'judicial.system.core:tables.received',
    defaultMessage: 'Móttekið',
    description:
      'Notaður sem titill fyrir móttökudagsetningu dálk í lista yfir mál.',
  },
  fineTag: {
    id: 'judicial.system.core:tables.fine_tag',
    defaultMessage: 'Viðurlagaákvörðun',
    description:
      'Notaðir sem texti í tagg þegar mál endar sem viðurlagaákvörðun',
  },
  rulingTag: {
    id: 'judicial.system.core:tables.ruling_tag',
    defaultMessage: 'Dómur',
    description: 'Notaðir sem texti í tagg þegar mál endar sem dómur',
  },
})
