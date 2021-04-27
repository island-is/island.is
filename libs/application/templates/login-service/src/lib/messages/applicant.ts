import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.LoginService.translation

export const applicant = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.applicant.pageTitle`,
      defaultMessage: 'Upplýsingar um fyrirtæki eða stofnun',
      description: 'Applicant page title',
    },
  }),
  labels: defineMessages({}),
}
