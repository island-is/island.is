import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.FundingGovernmentProjects.translation

export const submitted = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.submitted.pageTitle`,
      defaultMessage: 'Takk fyrir umsóknina',
      description: 'Submitted page title',
    },
  }),
  labels: defineMessages({}),
}
