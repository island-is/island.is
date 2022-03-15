import { defineMessages } from '@formatjs/intl'
import { defineMessage } from 'react-intl'

export const rcCourtOverview = {
  title: defineMessage({
    id: 'judicial.system.restriction_cases:reception_and_assignment.title',
    defaultMessage: 'Móttaka og úthlutun',
    description:
      'Notaður sem titill á Móttaka og úthlutun skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    caseResentExplanation: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:reception_and_assignment.case_resent_explanation.title',
        defaultMessage: 'Athugasemdir vegna endursendingar',
        description:
          'Notaður sem titill fyrir athugasemdir vegna endursendingar hluta á yfirlitssíðu í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}
