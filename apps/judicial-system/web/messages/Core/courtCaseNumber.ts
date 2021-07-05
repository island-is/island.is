import { defineMessages } from 'react-intl'

// Strings for CourtCaseNumber components
export const courtCaseNumber = defineMessages({
  title: {
    id: 'judicial.system:component.court_case_number.title',
    defaultMessage: 'Málsnúmer héraðsdóms',
    description: 'CourtCaseNumber component field: Title',
  },
  explanation: {
    id: 'judicial.system:component.court_case_number.explanation',
    defaultMessage:
      'Smelltu á hnappinn til að stofna nýtt mál eða skráðu inn málsnúmer sem er þegar til í Auði. Athugið að gögn verða sjálfkrafa vistuð á það málsnúmer sem slegið er inn.',
    description: 'CourtCaseNumber component field: Explanation',
  },
})
