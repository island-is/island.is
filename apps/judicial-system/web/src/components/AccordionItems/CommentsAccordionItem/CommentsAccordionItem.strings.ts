import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  label: {
    id: 'judicial.system.core:comments_accordion_item.label',
    defaultMessage: 'Athugasemdir ({commentCount})',
    description:
      'Notaður sem titill fyrir "Athugasemdir" hlutann á fellilista í öllum málstegundum',
  },
  comments: {
    id: 'judicial.system.core:comments_accordion_item.comments',
    defaultMessage: 'Athugasemdir vegna málsmeðferðar',
    description:
      'Notaður sem titill fyrir "Athugasemdir vegna málsmeðferðar" hlutann í "Athugasemdir" fellilista í öllum málstegundum',
  },
  caseFilesComments: {
    id: 'judicial.system.core:comments_accordion_item.case_files_comments',
    defaultMessage: 'Athugasemdir vegna rannsóknargagna',
    description:
      'Notaður sem titill fyrir "Athugasemdir vegna rannsóknargagna" hlutann í "Athugasemdir" fellilista í öllum málstegundum',
  },
  caseResentExplanation: {
    id: 'judicial.system.core:comments_accordion_item.case_resent_explanation',
    defaultMessage: 'Athugasemdir vegna endursendingar',
    description:
      'Notaður sem titill fyrir "Athugasemdir vegna endursendingar" hlutann í "Athugasemdir" fellilista í öllum málstegundum',
  },
})
