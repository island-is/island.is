import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    sectionTitle: {
      id: 'ss.application:conclusion.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion section',
    },
    pageTitle: {
      id: 'ss.application:conclusion.general.pageTitle',
      defaultMessage: 'Umsóknin móttekin!',
      description: 'Title of conclusion page',
    },
    alertTitle: {
      id: 'ss.application:conclusion.general.alertTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Conclusion general alert title',
    },
    alertMessageWithValuesFreshman: {
      id: 'ss.application:conclusion.general.alertMessageWithValuesFreshman',
      defaultMessage:
        'Umsókn þín í framhaldsskóla hefur verið móttekin! Hægt er að breyta umsókn til {registrationEndDateStr}',
      description: 'Conclusion general alert message for freshman',
    },
    alertMessageWithValuesGeneral: {
      id: 'ss.application:conclusion.general.alertMessageWithValuesGeneral',
      defaultMessage:
        'Umsókn þín í framhaldsskóla hefur verið móttekin! Hægt er að breyta umsókn til {registrationEndDateStr}',
      description: 'Conclusion general alert message for general',
    },
    accordionTitle: {
      id: 'ss.application:conclusion.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion accordion title',
    },
    accordionTextWithValuesFreshman: {
      id: 'ss.application:conclusion.general.accordionTextWithValuesFreshman#markdown',
      defaultMessage: `* **Þann {registrationEndDateStr}:**\n\n\tUmsóknartímabili lýkur. Ekki verður farið að vinna úr umsóknum fyrr en eftir þessa dagsetningu. Ef þú af einhverjum ástæðum vilt gera breytingar þarftu að gera það áður en tímabilinu lýkur.\n* **Frá {reviewStartDateStr}:** \n\n\tUnnið er úr umsóknum frá og með þessum degi og verður tilkynning send á alla umsækjendur. Hnipp verður sent í gegnum Ísland.is og ættir þú að fá tilkynningu í appið og tölvupóst um niðurstöðuna.`,
      description: 'Conclusion accordion text freshman',
    },
    accordionTextWithValuesGeneral: {
      id: 'ss.application:conclusion.general.accordionTextWithValuesGeneral#markdown',
      defaultMessage: `* **Þann {registrationEndDateStr}:**\n\n\tUmsóknartímabili lýkur. Ekki verður farið að vinna úr umsóknum fyrr en eftir þessa dagsetningu. Ef þú af einhverjum ástæðum vilt gera breytingar þarftu að gera það áður en tímabilinu lýkur.\n* **Frá {reviewStartDateStr}:** \n\n\tUnnið er úr umsóknum frá og með þessum degi og verður tilkynning send á alla umsækjendur. Hnipp verður sent í gegnum Ísland.is og ættir þú að fá tilkynningu í appið og tölvupóst um niðurstöðuna.`,
      description: 'Conclusion accordion text general',
    },
  }),
  overview: defineMessages({
    sectionTitle: {
      id: 'ss.application:conclusion.overview.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Title of conclusion overview section',
    },
    pageTitle: {
      id: 'ss.application:conclusion.overview.pageTitle',
      defaultMessage: 'Umsóknin þín',
      description: 'Title of conclusion overview page',
    },
    alertTitle: {
      id: 'ss.application:conclusion.overview.alertTitle',
      defaultMessage: 'Athugið',
      description: 'Conclusion overview alert title',
    },
    alertMessageWithValuesFreshman: {
      id: 'ss.application:conclusion.overview.alertMessageWithValuesFreshman',
      defaultMessage:
        'Umsóknartímabili lýkur {registrationEndDateStr}. Ekki verður farið að vinna úr umsóknum fyrr en eftir þessa dagsetningu. Ef þú af einhverjum ástæðum vilt gera breytingar þarftu að gera það áður en tímabilinu lýkur.',
      description: 'Conclusion overview alert message freshman',
    },
    alertMessageWithValuesGeneral: {
      id: 'ss.application:conclusion.overview.alertMessageWithValuesGeneral',
      defaultMessage:
        'Umsóknartímabili lýkur {registrationEndDateStr}. Ekki verður farið að vinna úr umsóknum fyrr en eftir þessa dagsetningu. Ef þú af einhverjum ástæðum vilt gera breytingar þarftu að gera það áður en tímabilinu lýkur.',
      description: 'Conclusion overview alert message general',
    },
  }),
}
