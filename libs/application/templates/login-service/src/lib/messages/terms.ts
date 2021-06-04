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
  }),
  values: defineMessages({
    termsAgreementUrl: {
      id: `ls.application:section.terms.termsAgreementUrl`,
      defaultMessage:
        'http://assets.ctfassets.net/8k0h54kbe6bj/5z9eyPyR1MRrhe0I0XVttN/152331e4d9ec3f281da5bba1aa12d00e/Skilma__lar_innskra__ningar__jo__nustan.pdf',
      description: 'Terms agreement url',
    },
  }),
}
