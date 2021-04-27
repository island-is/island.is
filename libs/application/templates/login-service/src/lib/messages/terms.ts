import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.LoginService.translation

export const terms = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.terms.pageTitle`,
      defaultMessage: 'Skilmálar',
      description: 'Terms page title',
    },
  }),
  labels: defineMessages({}),
}
