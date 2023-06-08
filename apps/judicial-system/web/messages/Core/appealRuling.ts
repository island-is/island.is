import { defineMessages } from 'react-intl'

export const appealRuling = defineMessages({
  decisionAccept: {
    id: 'judicial.system.core:appeal_ruling.decision_accept',
    defaultMessage: 'Staðfesting',
    description:
      'Staðfesting á "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionRepeal: {
    id: 'judicial.system.core:appeal_ruling.decision_repeal',
    defaultMessage: 'Fella úr gildi',
    description:
      'Fallið úr gildi í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionChanged: {
    id: 'judicial.system.core:appeal_ruling.decision_changed',
    defaultMessage: 'Niðurstöðu breytt',
    description:
      'Niðurstöðu breytt í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionDismissedFromCourtOfAppeal: {
    id: 'judicial.system.core:appeal_ruling.decision_dismissed_from_court_of_appeal',
    defaultMessage: 'Frávísun frá Landsrétti',
    description:
      'Frávísun frá Landsrétti í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionDismissedFromCourt: {
    id: 'judicial.system.core:appeal_ruling.decision_dismissed_from_court',
    defaultMessage: 'Frávísun frá héraðsdómi',
    description:
      'Frávísun frá héraðsdómi í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  decisionRemand: {
    id: 'judicial.system.core:appeal_ruling.decision_remand',
    defaultMessage: 'Ómerking og heimvísun',
    description:
      'Ómerking og heimvísun í "Úrskurður" hlutanum á úrskurðar skrefi í Landsrétti.',
  },
  tagDecisionAccept: {
    id: 'judicial.system.core:appeal_ruling.tag_decision_accept',
    defaultMessage: 'Staðfest',
    description: 'Staða eftir úrskurð á máli ef málið er staðfest',
  },
  tagDecisionChange: {
    id: 'judicial.system.core:appeal_ruling.tag_decision_change',
    defaultMessage: 'Breytt',
    description: 'Staða eftir úrskurð á máli ef málið er breytt',
  },
  tagDecisionDismissed: {
    id: 'judicial.system.core:appeal_ruling.tag_decision_dismissed',
    defaultMessage: 'Frávísun',
    description: 'Staða eftir úrskurð á máli ef málið er frávísun',
  },
  tagDecisionRemand: {
    id: 'judicial.system.core:appeal_ruling.tag_decision_remand',
    defaultMessage: 'Heimvísun',
    description: 'Staða eftir úrskurð á máli ef málið er heimvísun',
  },
})
