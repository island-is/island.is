import { defineMessages } from 'react-intl'

export const applicationCheck = {
  submitApplication: defineMessages({
    sellerNotValid: {
      id: 'aosh.drm.application:applicationCheck.submitApplication.sellerNotValid',
      defaultMessage:
        'Aðeins sá sem skráði umsókn má vera skráður sem seljandi.',
      description: 'Only applicant can be registered as seller',
    },
  }),
}
