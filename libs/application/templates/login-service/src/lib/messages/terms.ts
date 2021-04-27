import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessage, defineMessages } from 'react-intl'

const t = ApplicationConfigurations.LoginService.translation

export const terms = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.terms.pageTitle`,
      defaultMessage: 'Skilmálar',
      description: 'Terms page title',
    },
    pageDescription: {
      id: `${t}:section.terms.pageDescription`,
      defaultMessage: 'Samþykkt á skilmálum innskráningarþjónustu Ísland.is',
      description: 'Terms page description',
    },
  }),
  labels: defineMessages({
    termsAgreementLinkTitle: {
      id: `${t}:section.terms.termsAgreementLinkTitle`,
      defaultMessage: 'Skilmálar innskráningarþjónustu',
      description: 'Terms agreement link title',
    },
    termsAgreementApproval: {
      id: `${t}:section.terms.termsAgreementApproval`,
      defaultMessage: 'Ég samþykki ofangreinda skilmála',
      description: 'Terms agreement approval',
    },
  }),
  values: defineMessages({
    termsAgreementUrl: {
      id: `${t}:section.terms.termsAgreementUrl`,
      defaultMessage: 'http://island.is/',
      description: 'Terms agreement url',
    },
  }),
}
