import { defineMessages } from 'react-intl'

export const appealRuling = defineMessages({
  decisionAccept: {
    id: 'judicial.system.core:appeal_ruling.decisionAccept',
    defaultMessage: 'Staðfesting',
    description:
      'Staðfesting á "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionRepeal: {
    id: 'judicial.system.core:appeal_ruling.decisionRepeal',
    defaultMessage: 'Fella úr gildi',
    description:
      'Fallið úr gildi í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionChanged: {
    id: 'judicial.system.core:appeal_ruling.decisionChanged',
    defaultMessage: 'Niðurstöðu breytt',
    description:
      'Niðurstöðu breytt í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionDismissedFromCourtOfAppeal: {
    id: 'judicial.system.core:appeal_ruling.decisionDismissedFromCourtOfAppeal',
    defaultMessage: 'Frávísun frá Landsrétti',
    description:
      'Frávísun frá Landsrétti í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionDismissedFromCourt: {
    id: 'judicial.system.core:appeal_ruling.decisionDismissedFromCourt',
    defaultMessage: 'Frávísun frá héraðsdómi',
    description:
      'Frávísun frá héraðsdómi í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionUnlabeling: {
    id: 'judicial.system.core:appeal_ruling.decisionUnlabeling',
    defaultMessage: 'Ómerking og heimvísun',
    description:
      'Ómerking og heimvísun í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
})
