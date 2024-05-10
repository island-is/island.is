import { defineMessages } from 'react-intl'

export const aboutChildrenForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.aboutChildrenForm.general.sectionTitle',
      defaultMessage: 'Börn',
      description: 'About form section title',
    },
    pageTitle: {
      id: 'fa.application:section.aboutChildrenForm.general.pageTitle',
      defaultMessage: 'Börn',
      description: 'About form page title',
    },
    description: {
      id: 'fa.application:section.aboutChildrenForm.general.description',
      defaultMessage:
        'Samkvæmt upplýsingum frá Þjóðskrá ert þú með börn á þínu framfæri.',
      description: 'About form page description',
    },
  }),
  page: defineMessages({
    content: {
      id: 'fa.application:section.aboutChildrenForm.page.content#markdown',
      defaultMessage:
        'Hér getur þú skráð leikskóla, grunn– eða framhaldsskóla barnanna og hvort þau séu í frístund eða með skólamat.',
      description: 'About school for children',
    },
  }),
  goToApplication: defineMessages({
    button: {
      id: 'fa.application:section.aboutChildrenForm.goToApplication.button',
      defaultMessage: 'Fara í umsókn',
      description: 'Go to application button text',
    },
  }),
}
