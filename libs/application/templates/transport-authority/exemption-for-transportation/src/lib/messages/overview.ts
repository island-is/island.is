import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Title of overview section',
    },
    pageTitle: {
      id: 'ta.eft.application:overview.general.pageTitle',
      defaultMessage: 'Yfirlit umsóknar',
      description: 'Title of overview page',
    },
    // description: {
    //   id: 'ta.eft.application:overview.general.description',
    //   defaultMessage:
    //     'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en umsóknin er send.',
    //   description: 'Description of overview page',
    // },
  }),
  // applicant: defineMessages({
  //   subtitle: {
  //     id: 'ta.eft.application:overview.applicant.subtitle',
  //     defaultMessage: 'Umsækjandi',
  //     description: 'Applicant subtitle',
  //   },
  //   phoneLabel: {
  //     id: 'ta.eft.application:overview.applicant.phoneLabel',
  //     defaultMessage: 'Sími',
  //     description: 'Applicant phone label',
  //   },
  // }),
  buttons: defineMessages({
    submit: {
      id: 'ta.eft.application:overview.buttons.submit',
      defaultMessage: 'Senda umsókn',
      description: 'Submit application button',
    },
  }),
}
