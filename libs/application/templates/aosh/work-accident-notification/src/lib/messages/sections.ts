import { defineMessages } from 'react-intl'

export const sections = {
  prerequisites: defineMessages({
    dataFetching: {
      id: 'aosh.wan.application:sections.prerequisites.dataFetching',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section (right side panel)',
    },
    information: {
      id: 'aosh.wan.application:sections.prerequisites.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: `Title of information section (right side panel)`,
    },
    accident: {
      id: 'aosh.wan.application:sections.prerequisites.accident',
      defaultMessage: 'Slysið',
      description: 'Title of the accident section (right side panel)',
    },
    employee: {
      id: 'aosh.wan.application:sections.prerequisites.employee',
      defaultMessage: 'Starfsmaður',
      description: 'Title of the employee setion (right side panel)',
    },
    overview: {
      id: 'aosh.wan.application:sections.prerequisites.overview',
      defaultMessage: 'Yfirlit',
      description: 'Title of the overview setion (right side panel)',
    },
    conclusion: {
      id: 'aosh.wan.application:sections.prerequisites.conclusion',
      defaultMessage: 'Staðfesting',
      description: 'Title of the conclusion setion (right side panel)',
    },
  }),
}
