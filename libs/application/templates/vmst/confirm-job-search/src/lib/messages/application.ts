import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'vmst.cjs.application:name',
    defaultMessage: 'Staðfesta atvinnuleit',
    description: `Application's name`,
  },
  institutionName: {
    id: 'vmst.cjs.application:institution',
    defaultMessage: 'Vinnumálastofnun',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'vmst.cjs.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'vmst.cjs.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in draft',
  },
  actionCardSubmitted: {
    id: 'vmst.cjs.application:actionCardSubmitted',
    defaultMessage: 'Innsend',
    description:
      'Description of application state/status when application is submitted',
  },
  agreeCheckbox: {
    id: 'vmst.cjs.application:agreeCheckbox',
    defaultMessage: 'Ég skil',
    description: 'Agree checkbox label',
  },
  successSubmissionTitle: {
    id: 'vmst.cjs.application:successSubmissionTitle',
    defaultMessage:
      'Vinnumálastofnun hefur móttekið umsókn þína og er hún komin til afgreiðslu.',
    description: 'Successful submission title',
  },
})
