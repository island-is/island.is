import { defineMessage, defineMessages } from '@formatjs/intl'

export const ruling = {
  title: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.title',
    defaultMessage: 'Úrskurður',
    description: 'Notaður sem titill á úrskurði.',
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
    id: 'judicial.system.backend:pdf.ruling.ruling_heading_tmp', // TODO: remove _tmp
    defaultMessage: 'Niðurstaða',
    description: 'Notaður sem fyrirsögn á niðurstöðu.',
  }),
  missingRuling: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_ruling',
    defaultMessage: 'Niðurstaða hefur ekki verið skráð.',
    description: 'Notaður sem texti þegar niðurstaða hefur ekki verið skráð.',
  }),
  conclusionHeading: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.conclusion_heading_tmp', // TODO: remove _tmp
    defaultMessage: 'Úrskurðarorð',
    description: 'Notaður sem fyrirsögn á úrskurðarorð.',
  }),
  missingConclusion: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_conclusion',
    defaultMessage: 'Úrskurðarorð hafa ekki verið skráð.',
    description: 'Notaður sem texti þegar úrskurðarorð hafa ekki verið skráð.',
  }),
  missingJudge: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.missing_judge',
    defaultMessage: 'Dómari hefur ekki verið skráður',
    description: 'Notaður sem texti þegar dómari hefur ekki verið skráður.',
  }),

  proceedingsHeading: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.proceedings_heading',
    defaultMessage: 'Þingbók og úrskurður',
    description: 'Notaður sem fyrirsögn á þingbók.',
  }),
  proceedingsHeadingShortVersion: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.proceedings_heading_short_version',
    defaultMessage: 'Þingbók',
    description: 'Notaður sem fyrirsögn á styttri útgáfu af þingbók.',
  }),
  intro: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.into',
    defaultMessage:
      'Þann {courtDate} heldur {judgeNameAndTitle} dómþing{courtLocation}. Fyrir er tekið mál nr. {caseNumber}. Þinghald hefst kl. {startTime}.',
    description:
      'Notaður sem upphafstexti þingbókar þar sem {courtDate} er dagsetning þinghalds, {judgeNameAndTitle} er nafn og starfsheiti dómara, {caseNumber} er númer dómsmáls og {startTime} er upphafstími þinghalds. {courtDate}, {judgeNameAndTitle}, {caseNumber} og {startTime} er sjálfkrafa bætt við í kóða.',
  }),
  closedCourtAnnouncement: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.close_court_announcement',
    defaultMessage:
      'Þinghaldið er háð fyrir luktum dyrum sbr. f-lið 10. gr. laga um meðferð sakamála nr. 88/2008.',
    description: 'Notaður sem tilkynning um þinghald fyrir luktum dyrum.',
  }),
  attendeesHeading: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.attendees_heading',
    defaultMessage: 'Mættir eru:',
    description: 'Notaður sem fyrirsögn á lista yfir viðstadda.',
  }),
  courtDocuments: defineMessages({
    heading: {
      id: 'judicial.system.backend:pdf.ruling.court_documents.heading',
      defaultMessage: 'Lagt er fram:',
      description: 'Notaður sem fyrirsögn á skjöl sem lögð eru fram.',
    },
    request: {
      id: 'judicial.system.backend:pdf.ruling.court_documents.request',
      defaultMessage: 'Krafa um {caseTypes} þingmerkt nr. 1.',
      description:
        'Notaður sem heiti á þingmerktri kröfu þar sem {caseType} er tegund máls og er sjálfkrafa bætt við í kóða.',
    },
    announcement: {
      id: 'judicial.system.backend:pdf.ruling.court_documents.announcement',
      defaultMessage: 'Rannsóknargögn málsins liggja frammi.',
      description:
        'Notaður sem tilkynning um að rannsóknargögn málsins liggi frammi.',
    },
    other: {
      id: 'judicial.system.backend:pdf.ruling.court_documents.other',
      defaultMessage: '{documentName} þingmerkt nr. {documentNumber}.',
      description:
        'Notaður sem heiti á öðrum þingmerktum skjölum þar sem {documentName} er nafn skjals og {documentNumber} er númer skjals og er sjálfkrafa bætt við í kóða.',
    },
  }),
  rulingHeading1: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.ruling_heading',
    defaultMessage: 'Úrskurður',
    description: 'Notaður sem fyrirsögn á úrskurð.',
  }),
  rulingShortVersionPlaceholder: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.short_version_placeholder',
    defaultMessage: '(...)',
    description: 'Notaður í stað úrskurðartexta í stuttu útgáfu úrskurðar.',
  }),
  rulingHeading2: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.conclusion_heading',
    defaultMessage: 'Niðurstaða',
    description: 'Notaður sem fyrirsögn á niðurstöðu.',
  }),
  rulingTextHeading: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.ruling_text_heading',
    defaultMessage: 'Úrskurðarorð',
    description: 'Notaður sem fyrirsögn á úrskurðarorð.',
  }),
  rulingTextIntro: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.ruling_text_into',
    defaultMessage:
      'Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.',
    description:
      'Notaður sem tilkynning um að úrskurðarorðið hafi verið lesið upp.',
  }),
  appealDirections: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.appeal_directions',
    defaultMessage:
      'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
    description: 'Notaður fyrir leiðeiningar dómara um rétt til kæru.',
  }),
  accusedCustodyDirections: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.accused_custody_directions',
    defaultMessage:
      'Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd gæsluvarðhaldsins undir dómara.',
    description:
      'Notaður fyrir ábendingu dómara um heimild kærða til að bera framkvæmd gæsluvarðhalds undir hann.',
  }),
  accusedTravelBanDirections: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.accused_travel_ban_directions',
    defaultMessage:
      'Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd farbannsins undir dómara.',
    description:
      'Notaður fyrir ábendingu dómara um heimild kærða til að bera framkvæmd farbanns undir hann.',
  }),
  registrarWitness: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.registrar_witness',
    defaultMessage: 'Vottur að þinghaldi er {registrarNameAndTitle}.',
    description:
      'Notaður sem staðfesting á því að dómritari hafi verið vitni að þinghaldi þar sem {registrarNameAndTitle} er nafn og titill dómritara og er sjálfkrafa bætt við í kóða.',
  }),
  signOff: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.sign_off',
    defaultMessage: 'Þinghaldi lýkur kl. {endTime}.',
    description:
      'Notaður sem lokaorð þar sem {endTime} er lokatími þinghalds og er sjálfkrafa bætt við í kóða.',
  }),
  inSession: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.in_session',
    defaultMessage: 'Þinghaldi er ekki lokið.',
    description: 'Notaður sem lokaorð þegar þinghaldi er ekki lokið.',
  }),
  noDistrict: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.no_district',
    defaultMessage: 'ekki skráður',
    description: 'Notaður sem texti þegar embætti er ekki skráð',
  }),
  prosecutorIs: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.prosecutor_is',
    defaultMessage: 'Sóknaraðili er',
    description: 'Notað fyrir Sóknaraðili er ...',
  }),
  defendantIs: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.defendant_is',
    defaultMessage: 'Varnaraðil{suffix} er{isSuffix}',
    description: 'Notað fyrir Varnaraðili er ...',
  }),
  noDefendants: defineMessage({
    id: 'judicial.system.backend:pdf.ruling.no_defendants',
    defaultMessage: 'ekki skráður',
    description: 'Notaður sem texti þegar varnaraðila vantar',
  }),
}
