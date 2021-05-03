import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.FundingGovernmentProjects.translation

export const overview = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.overview.pageTitle`,
      defaultMessage: 'Yfirlit og staðfesting umsóknar',
      description: 'Overview page title',
    },
  }),
  labels: defineMessages({}),
}
