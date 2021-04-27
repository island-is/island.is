import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.LoginService.translation

export const technicalInfo = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.technicalInfo.pageTitle`,
      defaultMessage: 'Tæknilegar upplýsingar',
      description: 'technicalInfo page title',
    },
  }),
  labels: defineMessages({}),
}
