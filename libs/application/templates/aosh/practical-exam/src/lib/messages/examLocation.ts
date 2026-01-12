import { defineMessages } from 'react-intl'

export const examLocation = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.pe.application:examLocation.general.pageTitle',
      defaultMessage: 'Prófstaður',
      description: `Exam location's page title`,
    },
    pageDescription: {
      id: 'aosh.pe.application:examLocation.general.pageDescription',
      defaultMessage:
        'Vinsamlegast skráðu niður þann stað sem verkleg próf eiga að fara fram og upplýsingar um þann sem sér um skipulagningu prófsins.',
      description: `Exam location's page description`,
    },
    sectionTitle: {
      id: 'aosh.pe.application:examLocation.general.sectionTitle',
      defaultMessage: 'Prófstaður',
      description: `Exam location section title`,
    },
    descriptionField: {
      id: 'aosh.pe.application:examLocation.general.descriptionField',
      defaultMessage:
        'Vinsamlegast tilgreinið tengilið vegna skipulags á verklegu prófi',
      description: `Exam location description field`,
    },
  }),
}
