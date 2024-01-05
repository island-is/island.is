import { defineMessages } from 'react-intl'

export const useStringHelpersStrings = defineMessages({
  decisionAccept: {
    id: 'judicial.system.core:use_string_helpers.decision_accept',
    defaultMessage: 'Staðfest',
    description: 'Staða eftir úrskurð á máli ef málið er staðfest',
  },
  decisionChange: {
    id: 'judicial.system.core:use_string_helpers.decision_change',
    defaultMessage: 'Breytt',
    description: 'Staða eftir úrskurð á máli ef málið er breytt',
  },
  decisionDismissed: {
    id: 'judicial.system.core:use_string_helpers.decision_dismissed',
    defaultMessage: 'Frávísun',
    description: 'Staða eftir úrskurð á máli ef málið er frávísun',
  },
  decisionRemand: {
    id: 'judicial.system.core:use_string_helpers.tag_decision_remand',
    defaultMessage: 'Heimvísun',
    description: 'Staða eftir úrskurð á máli ef málið er heimvísun',
  },
})
