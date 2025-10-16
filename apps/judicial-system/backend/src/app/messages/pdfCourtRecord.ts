import { defineMessage, defineMessages } from '@formatjs/intl'

export const courtRecord = {
  title: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.title',
    defaultMessage: 'Þingbók',
    description: 'Notaður sem titill á þingbók.',
  }),
  missingCourt: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.missing_court',
    defaultMessage: 'Dómstóll hefur ekki verið skráður',
    description: 'Notaður sem texti þegar dómstóll hefur ekki verið skráður.',
  }),
  caseNumber: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.case_number',
    defaultMessage: 'Mál nr. {caseNumber}',
    description:
      'Notaður sem undirtitill á þingbók þar sem {caseNumber} er númer á máli. {caseNumber} er sjálfkrafa bætt við í kóða.',
  }),
  intro: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.intro',
    defaultMessage:
      'Þann {courtDate} heldur {judgeNameAndTitle} dómþing{courtLocation}. Fyrir er tekið mál nr. {caseNumber}. Þinghald hefst kl. {startTime}.',
    description:
      'Notaður sem upphafstexti þingbókar þar sem {courtDate} er dagsetning þinghalds, {judgeNameAndTitle} er nafn og starfsheiti dómara, {caseNumber} er númer dómsmáls og {startTime} er upphafstími þinghalds. {courtDate}, {judgeNameAndTitle}, {caseNumber} og {startTime} er sjálfkrafa bætt við í kóða.',
  }),
  closedCourtAnnouncement: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.closed_court_announcement',
    defaultMessage:
      'Þinghaldið er háð fyrir luktum dyrum sbr. f-lið 10. gr. laga um meðferð sakamála nr. 88/2008.',
    description: 'Notaður sem tilkynning um þinghald fyrir luktum dyrum.',
  }),
  prosecutorIs: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.prosecutor_is',
    defaultMessage: 'Sóknaraðili er',
    description: 'Notað fyrir Sóknaraðili er ...',
  }),
  missingDistrict: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.missing_district',
    defaultMessage: 'ekki skráður',
    description: 'Notaður sem texti þegar embætti er ekki skráð',
  }),
  defendantIs: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.defendant_is',
    defaultMessage: 'Varnaraðil{suffix} er{isSuffix}',
    description:
      'Notað fyrir Varnaraðili er ... þar sem {suffix} og {isSuffix} eru viðeigandi endingar eftir því hvort varnaraðilar eru einn eða fleiri. {suffix} og {isSuffix} er sjálfkrafa bætt við í kóða.',
  }),
  missingDefendants: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.missing_defendants',
    defaultMessage: 'ekki skráður',
    description: 'Notaður sem texti þegar varnaraðila vantar',
  }),
  attendeesHeading: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.attendees_heading',
    defaultMessage: 'Mættir eru:',
    description: 'Notaður sem fyrirsögn á lista yfir viðstadda.',
  }),
  courtDocuments: defineMessages({
    heading: {
      id: 'judicial.system.backend:pdf.court_record.court_documents.heading',
      defaultMessage: 'Lagt er fram:',
      description: 'Notaður sem fyrirsögn á skjöl sem lögð eru fram.',
    },
    request: {
      id: 'judicial.system.backend:pdf.court_record.court_documents.request',
      defaultMessage: 'Krafa um {caseTypes} þingmerkt nr. 1.',
      description:
        'Notaður sem heiti á þingmerktri kröfu þar sem {caseType} er tegund máls og er sjálfkrafa bætt við í kóða.',
    },
    announcement: {
      id: 'judicial.system.backend:pdf.court_record.court_documents.announcement',
      defaultMessage: 'Rannsóknargögn málsins liggja frammi.',
      description:
        'Notaður sem tilkynning um að rannsóknargögn málsins liggi frammi.',
    },
    other: {
      id: 'judicial.system.backend:pdf.court_record.court_documents.other_v2',
      defaultMessage:
        '{documentName} þingmerkt nr. {documentNumber}{submittedBy, select, DEFENDER { lagt fram af varnaraðila} PROSECUTOR { lagt fram af sækjanda} DISTRICT_COURT_JUDGE { lagt fram af dómnum} other {}}.',
      description:
        'Notaður sem heiti á öðrum þingmerktum skjölum þar sem {documentName} er nafn skjals og {documentNumber} er númer skjals og er sjálfkrafa bætt við í kóða.',
    },
  }),
  missingSessionBookings: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.missing_session_bookings',
    defaultMessage: 'Bókanir fyrir úrskurð hafa ekki verið skráðar.',
    description:
      'Notaður sem texti þegar bókanir fyrir úrskurð hafa ekki verið skráðar.',
  }),
  conclusionHeading: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.conclusion_heading',
    defaultMessage: 'Úrskurðarorð',
    description: 'Notaður sem fyrirsögn á úrskurðarorð.',
  }),
  missingConclusion: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.missing_conclusion',
    defaultMessage: 'Úrskurðarorð hafa ekki verið skráð.',
    description: 'Notaður sem texti þegar úrskurðarorð hafa ekki verið skráð.',
  }),
  missingJudge: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.missing_judge',
    defaultMessage: 'Dómari hefur ekki verið skráður',
    description: 'Notaður sem texti þegar dómari hefur ekki verið skráður.',
  }),
  appealDirections: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.appeal_directions',
    defaultMessage:
      'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
    description: 'Notaður fyrir leiðeiningar dómara um rétt til kæru.',
  }),
  prosecutor: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.prosecutor',
    defaultMessage: 'sækjandi',
    description: 'Notað fyrir orðið sækjandi.',
  }),
  defendant: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.defendant',
    defaultMessage: 'varnaraðil{suffix}',
    description:
      'Notað fyrir orðið varnaraðili þar sem {suffix} er viðeigandi ending eftir því hvort varnaraðilar eru einn eða fleiri. {suffix} er sjálfkrafa bætt við í kóða',
  }),
  registrarWitness: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.registrar_witness',
    defaultMessage: 'Vottur að þinghaldi er {registrarNameAndTitle}.',
    description:
      'Notaður sem staðfesting á því að dómritari hafi verið vitni að þinghaldi þar sem {registrarNameAndTitle} er nafn og titill dómritara og er sjálfkrafa bætt við í kóða.',
  }),
  signOff: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.sign_off_v2',
    defaultMessage:
      'Þinghaldi lýkur {endDate, select, NONE {} other {{endDate} }}kl. {endTime}.',
    description:
      'Notaður sem lokaorð þar sem {endDate/endTime} er lokatími þinghalds og er sjálfkrafa bætt við í kóða.',
  }),
  inSession: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.in_session',
    defaultMessage: 'Þinghaldi er ekki lokið.',
    description: 'Notaður sem lokaorð þegar þinghaldi er ekki lokið.',
  }),
  smallPrint: defineMessage({
    id: 'judicial.system.backend:pdf.court_record.small_print',
    defaultMessage:
      '{actorName} ({actorInstitution, select, NONE {lögmaður} other {{actorInstitution}}}) sótti þetta skjal í Réttarvörslugátt {date}.',
    description: 'Notaður til að tilgreina hver sótti þingbók.',
  }),
}
