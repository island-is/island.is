import { defineMessage } from '@formatjs/intl'

export const ruling = {
  title: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.title',
    defaultMessage: 'Úrskurður',
    description: 'Notaður sem titill á úrskurði.',
  }),
  missingIntroduction: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_introduction',
    defaultMessage: 'Aðfararorð hafa ekki verið skráð',
    description: 'Notaður sem texti þegar aðfararorð hafa ekki verið skráð.',
  }),
  missingCourt: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_court',
    defaultMessage: 'Dómstóll hefur ekki verið skráður',
    description: 'Notaður sem texti þegar dómstóll hefur ekki verið skráður.',
  }),
  caseNumber: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.case_number',
    defaultMessage: 'Mál nr. {caseNumber}',
    description:
      'Notað sem undirsögn á úrskurði þar sem {caseNumber} er númer á máli. {caseNumber} er sjálfkrafa bætt við í kóða.',
  }),
  prosecutorIs: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.prosecutor_is',
    defaultMessage: 'Sóknaraðili er',
    description: 'Notað fyrir Sóknaraðili er ...',
  }),
  missingDistrict: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_district',
    defaultMessage: 'ekki skráður',
    description: 'Notaður sem texti þegar embætti er ekki skráð',
  }),
  defendantIs: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.defendant_is',
    defaultMessage: 'Varnaraðil{suffix} er{isSuffix}',
    description: 'Notað fyrir Varnaraðili er ...',
  }),
  missingDefendants: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_defendants',
    defaultMessage: 'ekki skráður',
    description: 'Notaður sem texti þegar varnaraðila vantar',
  }),
  prosecutorDemandsHeading: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.prosecutor_demands_heading',
    defaultMessage: 'Krafa',
    description:
      'Notaður sem fyrirsögn á kröfu eins og hún er umorðuð af dómstól.',
  }),
  missingProsecutorDemands: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_prosecutor_demands',
    defaultMessage: 'Krafa hefur ekki verið skráð.',
    description: 'Notaður sem texti þegar krafa hefur ekki verið skráð.',
  }),
  courtCaseFactsHeading: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.court_case_facts_heading',
    defaultMessage: 'Greinargerð um málsatvik',
    description:
      'Notaður sem fyrirsögn á greinargerð um málsatvika eins og þau eru umorðuð af dómstól.',
  }),
  missingCourtCaseFacts: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_court_case_facts',
    defaultMessage: 'Málsatvik hafa ekki verið skráð.',
    description: 'Notaður sem texti þegar málsatvik hafa ekki verið skráð.',
  }),
  courtLegalArgumentsHeading: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.court_legal_arguments_heading',
    defaultMessage: 'Greinargerð um lagarök',
    description:
      'Notaður sem fyrirsögn á greinargerða um lagarök eins og þau eru umorðuð af dómstól.',
  }),
  missingCourtLegalArguments: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_court_legal_arguments',
    defaultMessage: 'Lagarök hafa ekki verið skráð.',
    description: 'Notaður sem texti þegar lagarök hafa ekki verið skráð.',
  }),
  rulingHeading: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.ruling_heading',
    defaultMessage: 'Niðurstaða',
    description: 'Notaður sem fyrirsögn á niðurstöðu.',
  }),
  missingRuling: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_ruling',
    defaultMessage: 'Niðurstaða hefur ekki verið skráð.',
    description: 'Notaður sem texti þegar niðurstaða hefur ekki verið skráð.',
  }),
  conclusionHeading: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.conclusion_heading',
    defaultMessage: 'Úrskurðarorð',
    description: 'Notaður sem fyrirsögn á úrskurðarorð.',
  }),
  missingConclusion: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_conclusion_v2',
    defaultMessage: 'Úrskurðarorð hefur ekki verið skráð.',
    description: 'Notaður sem texti þegar úrskurðarorð hefur ekki verið skráð.',
  }),
  missingJudge: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_judge',
    defaultMessage: 'Dómari hefur ekki verið skráður',
    description: 'Notaður sem texti þegar dómari hefur ekki verið skráður.',
  }),
}
