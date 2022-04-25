import { CaseType } from '@island.is/judicial-system/types'
import { defineMessages } from 'react-intl'

export const rcCourtOverview = {
  sections: {
    title: {
      id: 'rcCourtOverview.sections.title',
      defaultMessage: `Yfirlit {caseType, select, ${CaseType.ADMISSION_TO_FACILITY} {kröfu um vistun á viðeigandi stofnun} ${CaseType.TRAVEL_BAN} {farbannskröfu} other {gæsluvarðhaldskröfu}}`,
      description:
        'Notaður sem titill á yfirlitssíðu í gæsluvarðhalds-, vistunar- og farbannsmálum.',
    },
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
