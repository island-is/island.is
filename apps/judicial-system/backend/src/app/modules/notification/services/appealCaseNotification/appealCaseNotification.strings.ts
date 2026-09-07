import { defineMessages } from '@formatjs/intl'

export const strings = {
  caseAppealedToCourtOfAppeals: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_appealed_to_court_of_appeals.subject',
      defaultMessage: 'Kæra í máli {courtCaseNumber}',
      description:
        'Fyrirsögn í pósti til dómara og dómritara þegar að mál er kært til landsréttar',
    },
    body: {
      id: 'judicial.system.backend:notifications.case_appealed_to_court_of_appeals.body_v3',
      defaultMessage:
        'Úrskurður hefur verið kærður í máli {courtCaseNumber}. {userHasAccessToRVG, select, true {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
      description:
        'Texti í pósti til dómara og dómritara þegar að mál er kært til landsréttar',
    },
    text: {
      id: 'judicial.system.backend:notifications.case_appealed_to_court_of_appeals.text',
      defaultMessage:
        'Úrskurður hefur verið kærður í máli {courtCaseNumber}. Sjá nánar á rettarvorslugatt.island.is',
      description:
        'Texti í SMS-i á vaktsíma dómara eða dómritara þegar að mál er kært til landsréttar',
    },
  }),
  caseAppealReceivedByCourt: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_appeal_received_by_court.subject',
      defaultMessage: 'Upplýsingar vegna kæru í máli {courtCaseNumber}',
      description: 'Fyrirsögn í pósti til aðila máls þegar að kæra er móttekin',
    },
    body: {
      id: 'judicial.system.backend:notifications.case_appeal_received_by_court.body_v3',
      defaultMessage:
        'Kæra í máli {courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til {statementDeadline}. {userHasAccessToRVG, select, true {Hægt er að skila greinargerð og nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að skila greinargerð og nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
      description: 'Texti í pósti til aðila máls þegar að kæra er móttekin',
    },
    courtOfAppealsBody: {
      id: 'judicial.system.backend:notifications.case_appeal_received_by_court.court_of_appeals_body_v3',
      defaultMessage:
        'Kæra í máli {courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til {statementDeadline}. Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
      description: 'Texti í pósti til Landsréttar þegar að kæra er móttekin',
    },
    text: {
      id: 'judicial.system.backend:notifications.case_appeal_received_by_court.text',
      defaultMessage:
        'Kæra í máli {courtCaseNumber} hefur borist Landsrétti. Frestur til að skila greinargerð er til {statementDeadline}. Sjá nánar á rettarvorslugatt.island.is',
      description:
        'Texti í SMS-i á vaktsíma dómara eða dómritara þegar að kærumál er móttekið af dómara',
    },
  }),
  caseAppealStatement: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_appeal_statement.subject',
      defaultMessage:
        'Ný greinargerð í máli {courtCaseNumber}{appealCaseNumber, select, NONE {} other { ({appealCaseNumber})}}',
      description: 'Fyrirsögn í pósti til aðila máls þegar greinargerð er send',
    },
    body: {
      id: 'judicial.system.backend:notifications.case_appeal_statement.body_v2',
      defaultMessage:
        'Greinargerð hefur borist vegna kæru í máli {courtCaseNumber}{appealCaseNumber, select, NONE {} other { (Landsréttarmál nr. {appealCaseNumber})}}. {userHasAccessToRVG, select, true {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
      description: 'Texti í pósti til aðila máls þegar greinargerð er send',
    },
  }),
  caseAppealCaseFilesUpdated: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_appeal_case_files_updated.subject',
      defaultMessage:
        'Ný gögn í máli {courtCaseNumber}{appealCaseNumber, select, NONE {} other { ({appealCaseNumber})}}',
      description: 'Fyrirsögn í pósti til aðila máls þegar ný gögn eru send',
    },
    body: {
      id: 'judicial.system.backend:notifications.case_appeal_case_files_updated.body',
      defaultMessage:
        'Ný gögn hafa borist vegna kæru í máli {courtCaseNumber}{appealCaseNumber, select, NONE {} other { (Landsréttarmál nr. {appealCaseNumber})}}. {appealCaseNumber, select, NONE {} other {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}}}.',
      description: 'Texti í pósti til aðila máls þegar ný gögn eru send',
    },
  }),
  caseAppealCompleted: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_appeal_completed.subject',
      defaultMessage:
        'Úrskurður í landsréttarmáli {appealCaseNumber} ({courtCaseNumber})',
      description: 'Fyrirsögn í pósti til aðila máls þegar kæru er lokið',
    },
    body: {
      id: 'judicial.system.backend:notifications.case_appeal_completed.body_v3',
      defaultMessage:
        'Landsréttur hefur úrskurðað í máli {appealCaseNumber} (héraðsdómsmál nr. {courtCaseNumber}). Niðurstaða Landsréttar: {appealRulingDecision}. {userHasAccessToRVG, select, true {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
      description: 'Texti í pósti til aðila máls þegar kæru er lokið',
    },
    text: {
      id: 'judicial.system.backend:notifications.case_appeal_completed.text',
      defaultMessage:
        'Landsréttur hefur úrskurðað í máli {appealCaseNumber} (héraðsdómsmál nr. {courtCaseNumber}). Niðurstaða Landsréttar: {appealRulingDecision}. Sjá nánar á rettarvorslugatt.island.is',
      description:
        'Texti í SMS til sækjanda þegar Landsréttur hefur úrskurðað í kærumáli',
    },
  }),
  caseAppealResent: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_appeal_resent.subject',
      defaultMessage:
        'Leiðréttur úrskurður í landsréttarmáli {appealCaseNumber} ({courtCaseNumber})',
      description:
        'Fyrirsögn í pósti til aðila máls þegar leiðréttur úrskurður er sendur',
    },
    body: {
      id: 'judicial.system.backend:notifications.case_appeal_resent.body',
      defaultMessage:
        'Landsréttur hefur leiðrétt úrskurð í máli {appealCaseNumber} (héraðsdómsmál nr. {courtCaseNumber}). {userHasAccessToRVG, select, true {Hægt er að nálgast gögn málsins á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Hægt er að nálgast gögn málsins hjá {court} ef þau hafa ekki þegar verið afhent}}.',
      description:
        'Texti í pósti til aðila máls þegar leiðréttur úrskurður er sendur',
    },
  }),
  caseAppealDiscontinued: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_appeal_discontinued.subject',
      defaultMessage:
        'Niðurfelling máls {appealCaseNumber} ({courtCaseNumber})',
      description: 'Fyrirsögn í pósti til aðila máls þegar kæra er afturkölluð',
    },
    body: {
      id: 'judicial.system.backend:notifications.case_appeal_discontinued.body',
      defaultMessage:
        'Landsréttur hefur móttekið afturköllun á kæru í máli {courtCaseNumber}. Landsréttarmálið {appealCaseNumber} hefur verið fellt niður.',
      description: 'Texti í pósti til aðila máls þegar kæra er afturkölluð',
    },
  }),
  caseAppealWithdrawn: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.case_appeal_withdrawn.subject',
      defaultMessage: 'Afturköllun kæru í máli {courtCaseNumber}',
      description: 'Fyrirsögn í pósti til aðila máls þegar kæra er afturkölluð',
    },
    body: {
      id: 'judicial.system.backend:notifications.case_appeal_withdrawn.body',
      defaultMessage:
        '{withdrawnByProsecution, select, true {Sækjandi} other {Verjandi}} hefur afturkallað kæru í máli {courtCaseNumber}.',
      description: 'Texti í pósti til aðila máls þegar kæra er afturkölluð',
    },
  }),
}
