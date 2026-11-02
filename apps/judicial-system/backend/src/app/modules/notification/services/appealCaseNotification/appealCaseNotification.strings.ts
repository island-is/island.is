export const strings = {
  caseAppealedToCourtOfAppeals: {
    subject: 'Kæra í máli {courtCaseNumber}',
    body: 'Úrskurður hefur verið kærður í máli {courtCaseNumber}. {userHasAccessToRVG, select, true {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
    text: 'Úrskurður hefur verið kærður í máli {courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is',
  },
  caseAppealReceivedByCourt: {
    subject: 'Upplýsingar vegna kæru í máli {courtCaseNumber}',
    body: 'Kæra í máli {courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til {statementDeadline}. {userHasAccessToRVG, select, true {Hægt er að skila greinargerð og nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að skila greinargerð og nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
    courtOfAppealsBody:
      'Kæra í máli {courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til {statementDeadline}. Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
    text: 'Kæra í máli {courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til {statementDeadline}. Sjá nánar á rettarvorslugatt.island.is',
  },
  caseAppealStatement: {
    subject:
      'Ný greinargerð í máli {courtCaseNumber}{appealCaseNumber, select, NONE {} other { ({appealCaseNumber})}}',
    body: 'Greinargerð hefur borist vegna kæru í máli {courtCaseNumber}{appealCaseNumber, select, NONE {} other { (Landsréttarmál nr. {appealCaseNumber})}}. {userHasAccessToRVG, select, true {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
  },
  caseAppealCaseFilesUpdated: {
    subject:
      'Ný gögn í máli {courtCaseNumber}{appealCaseNumber, select, NONE {} other { ({appealCaseNumber})}}',
    body: 'Ný gögn hafa borist vegna kæru í máli {courtCaseNumber}{appealCaseNumber, select, NONE {} other { (Landsréttarmál nr. {appealCaseNumber})}}.{appealCaseNumber, select, NONE {} other { Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.}}',
  },
  caseAppealCompleted: {
    subject:
      'Úrskurður í landsréttarmáli {appealCaseNumber} ({courtCaseNumber})',
    body: 'Landsréttur hefur úrskurðað í máli {appealCaseNumber} (héraðsdómsmál nr. {courtCaseNumber}). Niðurstaða Landsréttar: {appealRulingDecision}. {userHasAccessToRVG, select, true {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
    text: 'Landsréttur hefur úrskurðað í máli {appealCaseNumber} (héraðsdómsmál nr. {courtCaseNumber}). Niðurstaða Landsréttar: {appealRulingDecision}. Sjá nánar á rettarvorslugatt.island.is',
  },
  caseAppealResent: {
    subject:
      'Leiðréttur úrskurður í landsréttarmáli {appealCaseNumber} ({courtCaseNumber})',
    body: 'Landsréttur hefur leiðrétt úrskurð í máli {appealCaseNumber} (héraðsdómsmál nr. {courtCaseNumber}). {userHasAccessToRVG, select, true {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
  },
  caseAppealDiscontinued: {
    subject: 'Niðurfelling máls {appealCaseNumber} ({courtCaseNumber})',
    body: 'Landsréttur hefur móttekið afturköllun á kæru í máli {courtCaseNumber}. Landsréttarmálið {appealCaseNumber} hefur verið fellt niður.',
  },
  caseAppealWithdrawn: {
    subject: 'Afturköllun kæru í máli {courtCaseNumber}',
    body: '{withdrawnByProsecution, select, true {Sækjandi} other {Verjandi}} hefur afturkallað kæru í máli {courtCaseNumber}.',
  },
}
