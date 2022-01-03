import { defineMessages } from 'react-intl'

export const terms = {
  general: defineMessages({
    pageTitle: {
      id: `ls.application:section.terms.pageTitle`,
      defaultMessage: 'Skilmálar',
      description: 'Terms page title',
    },
    pageDescription: {
      id: `ls.application:section.terms.pageDescription`,
      defaultMessage: 'Samþykkt á skilmálum innskráningarþjónustu Ísland.is',
      description: 'Terms page description',
    },
  }),
  labels: defineMessages({
    termsAgreementLinkTitle: {
      id: `ls.application:section.terms.termsAgreementLinkTitle`,
      defaultMessage: 'Skilmálar innskráningarþjónustu',
      description: 'Terms agreement link title',
    },
    termsAgreementApproval: {
      id: `ls.application:section.terms.termsAgreementApproval`,
      defaultMessage: 'Ég samþykki ofangreinda skilmála',
      description: 'Terms agreement approval',
    },
    termsAgreementApprovalForOverview: {
      id: `ls.application:section.terms.termsAgreementApprovalForOverview`,
      defaultMessage: 'Skilmálar þjónustu samþykktir',
      description: 'Terms agreement approval for overview',
    },
    yesLabel: {
      id: `ls.application:section.terms.yesLabel`,
      defaultMessage: 'Já',
      description: 'Terms agreement approval yes label',
    },
  }),
  values: defineMessages({
    termsAgreementUrl: {
      id: `ls.application:section.terms.termsAgreementUrl`,
      defaultMessage:
        'https://island.is/innskraningarthjonusta/skilmalar-innskraningarthjonustu',
      description: 'Terms agreement url',
    },
  }),
}
