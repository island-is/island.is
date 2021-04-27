import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.LoginService.translation

export const technicalContact = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.technicalContact.pageTitle`,
      defaultMessage: 'Tæknilegur tengiliður',
      description: 'technicalContact page title',
    },
  }),
  labels: defineMessages({}),
}
