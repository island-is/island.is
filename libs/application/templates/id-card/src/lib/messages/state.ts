import { defineMessages } from 'react-intl'

export const state = {
  general: defineMessages({
    sectionTitle: {
      id: 'id.application:state.general.sectionTitle',
      defaultMessage: 'Staða tilkynningar',
      description: 'Review state section title',
    },
    pageTitle: {
      id: 'id.application:state.general.pageTitle',
      defaultMessage: 'Staða tilkynningar',
      description: 'Review state page title',
    },
    description: {
      id: 'id.application:state.general.description',
      defaultMessage: 'Hér að neðan kemur fram hvað gerist næst',
      description: 'Review state description',
    },
  }),
  labels: defineMessages({
    actionCardTitle: {
      id: 'id.application:state.labels.actionCardTitle',
      defaultMessage: 'Samþykki ',
      description: 'Action card title',
    },
    actionCardDescription: {
      id: 'id.application:state.labels.actionCardDescription',
      defaultMessage:
        'Beðið er eftir að samþykki fyrir umsókn um nafnskírteini fyrir: ',
      description: 'Action card description',
    },
    actionCardTag: {
      id: 'id.application:state.labels.tag',
      defaultMessage: 'Samþykki í bið',
      description: 'Action card tag',
    },
  }),
  buttons: defineMessages({
    openApproval: {
      id: 'id.application:state.buttons.openApproval',
      defaultMessage: 'Opna samþykki',
      description: 'Open approval button in review process',
    },
  }),
}
