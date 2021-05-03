import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.FundingGovernmentProjects.translation

export const informationAboutInstitution = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.informationAboutInstitution.pageTitle`,
      defaultMessage: 'Upplýsingar um stofnun',
      description: 'Information About Institution page title',
    },
  }),
  labels: defineMessages({}),
}
