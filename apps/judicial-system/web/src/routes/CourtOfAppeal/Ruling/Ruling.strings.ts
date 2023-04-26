import { defineMessages } from 'react-intl'

export const courtOfAppealRuling = defineMessages({
  title: {
    id: 'judicial.system.core:court_of_appeal_ruling.title',
    defaultMessage: 'Úrskurður',
    description: 'Titill á úrskurðar skrefi afgreiddra mála hjá Landsrétti',
  },
  caseNumber: {
    id: 'judicial.system.core:court_of_appeal_ruling.caseNumber',
    defaultMessage: 'Mál nr. {caseNumber}',
    description: 'Notað fyrir texta fyrir númer á máli',
  },
  courtOfAppealCaseNumber: {
    id: 'judicial.system.core:court_of_appeal_ruling.courtOfAppealCaseNumber',
    defaultMessage: 'Málsnr. Héraðsdóms {caseNumber}',
    description: 'Notað fyrir texta fyrir númer á Héraðsdóm máli',
  },
  decision: {
    id: 'judicial.system.core:court_of_appeal_ruling.decision',
    defaultMessage: 'Lyktir',
    description:
      'Notaður sem titill fyrir "Úrskurður" hlutann á úrskurðar skrefi í Landsrétti.',
  },
  decisionAccept: {
    id: 'judicial.system.core:court_of_appeal_ruling.decisionAccept',
    defaultMessage: 'Staðfesting',
    description:
      'Staðfesting á "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionRepeal: {
    id: 'judicial.system.core:court_of_appeal_ruling.decisionRepeal',
    defaultMessage: 'Fella úr gildi',
    description:
      'Fallið úr gildi í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionChanged: {
    id: 'judicial.system.core:court_of_appeal_ruling.decisionChanged',
    defaultMessage: 'Niðurstöðu breytt',
    description:
      'Niðurstöðu breytt í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionDismissedFromCourtOfAppeal: {
    id:
      'judicial.system.core:court_of_appeal_ruling.decisionDismissedFromCourtOfAppeal',
    defaultMessage: 'Frávísun frá Landsrétti',
    description:
      'Frávísun frá Landsrétti í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionDismissedFromCourt: {
    id:
      'judicial.system.core:court_of_appeal_ruling.decisionDismissedFromCourt',
    defaultMessage: 'Frávísun frá héraðsdómi',
    description:
      'Frávísun frá héraðsdómi í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionUnlabeling: {
    id: 'judicial.system.core:court_of_appeal_ruling.decisionUnlabeling',
    defaultMessage: 'Ómerking og heimvísun',
    description:
      'Ómerking og heimvísun í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  conclusionHeading: {
    id: 'judicial.system.backend:pdf.court_record.conclusionHeading',
    defaultMessage: 'Úrskurðarorð',
    description: 'Notaður sem fyrirsögn á úrskurðarorð.',
  },
})
