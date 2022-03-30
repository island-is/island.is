import { defineMessage } from 'react-intl'

export const commentsAccordion = {
  comments: defineMessage({
    id: 'judicial.system.core:comments_accordion.comments',
    defaultMessage: 'Athugasemdir vegna málsmeðferðar',
    description:
      'Notaður sem titill fyrir "Athugasemdir vegna málsmeðferðar" hlutann í "Athugasemdir" fellilista í öllum málstegundum',
  }),
  caseFilesComments: defineMessage({
    id: 'judicial.system.core:comments_accordion.case_files_comments',
    defaultMessage: 'Athugasemdir vegna rannsóknargagna',
    description:
      'Notaður sem titill fyrir "Athugasemdir vegna rannsóknargagna" hlutann í "Athugasemdir" fellilista í öllum málstegundum',
  }),
  caseResentExplanation: defineMessage({
    id: 'judicial.system.core:comments_accordion.case_resent_explanation',
    defaultMessage: 'Athugasemdir vegna endursendingar',
    description:
      'Notaður sem titill fyrir "Athugasemdir vegna endursendingar" hlutann í "Athugasemdir" fellilista í öllum málstegundum',
  }),
}
