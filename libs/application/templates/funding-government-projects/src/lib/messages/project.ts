import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.FundingGovernmentProjects.translation

export const project = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.project.pageTitle`,
      defaultMessage: 'Upplýsingar um verkefnið',
      description: 'Project page title',
    },
  }),
  labels: defineMessages({}),
}
