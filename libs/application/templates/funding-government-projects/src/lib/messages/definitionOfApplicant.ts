import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.FundingGovernmentProjects.translation

export const definitionOfApplicant = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.definitionOfApplicant.pageTitle`,
      defaultMessage: 'Yfirlit',
      description: 'Definition of applicant section title',
    },
  }),
  labels: defineMessages({}),
}
