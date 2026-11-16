export const courtRecord = {
  title: 'Þingbók',
  missingCourt: 'Dómstóll hefur ekki verið skráður',
  caseNumber: 'Mál nr. {caseNumber}',
  intro:
    '{courtDate} heldur {judgeNameAndTitle} dómþing{courtLocation}. Fyrir er tekið mál nr. {caseNumber}. Þinghald hefst kl. {startTime}.',
  closedCourtAnnouncement:
    'Þinghaldið er háð fyrir luktum dyrum sbr. f-lið 10. gr. laga um meðferð sakamála nr. 88/2008.',
  prosecutorIs: 'Sóknaraðili er',
  missingDistrict: 'ekki skráður',
  defendantIs: 'Varnaraðil{suffix} er{isSuffix}',
  missingDefendants: 'ekki skráður',
  attendeesHeading: 'Mættir eru:',
  courtDocuments: {
    heading: 'Lagt er fram:',
    request: 'Krafa um {caseTypes} þingmerkt nr. 1.',
    announcement: 'Rannsóknargögn málsins liggja frammi.',
    other:
      '{documentName} þingmerkt nr. {documentNumber}{submittedBy, select, DEFENDER { lagt fram af varnaraðila} PROSECUTOR { lagt fram af sækjanda} DISTRICT_COURT_JUDGE { lagt fram af dómnum} other {}}.',
  },
  missingSessionBookings: 'Bókanir fyrir úrskurð hafa ekki verið skráðar.',
  conclusionHeading: 'Úrskurðarorð',
  missingConclusion: 'Úrskurðarorð hefur ekki verið skráð.',
  missingJudge: 'Dómari hefur ekki verið skráður',
  appealDirections:
    'Dómari kynnir varnaraðila rétt til að kæra úrskurð og um kærufrest, sbr. 193. gr. laga nr. 88/2008.',
  prosecutor: 'sækjandi',
  defendant: 'varnaraðil{suffix}',
  registrarWitness: 'Vottur að þinghaldi er {registrarNameAndTitle}.',
  signOff:
    'Þinghaldi lýkur {endDate, select, NONE {} other {{endDate} }}kl. {endTime}.',
  inSession: 'Þinghaldi er ekki lokið.',
  smallPrint:
    '{actorName} ({actorInstitution, select, NONE {lögmaður} other {{actorInstitution}}}) sótti þetta skjal í Réttarvörslugátt {date}.',
}
