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
      id: 'id.application:state.general.description#markdown',
      defaultMessage: `{guardianName} hefur sótt um nafnkskírteini 
      sem er ferðaskilríki fyrir: {childName}.  Samþykki beggja forsjáraðila 
      þarf til að útgáfa þess sé heimil. Í þessu ferli getur þú afgreitt 
      samþykki fyrir útgáfunni rafrænt með því að halda áfram og samþykkja. 
      Samþykkið er vistað rafrænt hjá Þjóðskrá Íslands.`,
      description: 'Review state description',
    },
  }),
  labels: defineMessages({
    alertMessage: {
      id: 'id.application:state.labels.alertMessage',
      defaultMessage:
        'Athugaðu að þú hefur 7 daga til að samþykkja umsóknina inni á island.is. ',
      description: 'Alert message',
    },
    actionCardTitle: {
      id: 'id.application:state.labels.actionCardTitle',
      defaultMessage: 'Samþykki forsjáraðila 2',
      description: 'Action card title',
    },
    actionCardDescription: {
      id: 'id.application:state.labels.actionCardDescription#markdown',
      defaultMessage:
        'Beðið er eftir að samþykki fyrir umsókn um nafnskírteini fyrir: {name}',
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
