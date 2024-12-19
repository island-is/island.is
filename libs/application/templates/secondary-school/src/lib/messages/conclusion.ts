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
    alertMessageFreshman: {
      id: 'ss.application:conclusion.general.alertMessageFreshman',
      defaultMessage:
        'Umsókn þín í framhaldsskóla hefur verið móttekin! Hægt er að senda inn nýja umsókn til xx. júní 2025',
      description: 'Conclusion general alert message for freshman',
    },
    alertMessageGeneral: {
      id: 'ss.application:conclusion.general.alertMessageGeneral',
      defaultMessage:
        'Umsókn þín í framhaldsskóla hefur verið móttekin! Hægt er að senda inn nýja umsókn til aa. júní 2025',
      description: 'Conclusion general alert message for general application',
    },
    accordionTitle: {
      id: 'ss.application:conclusion.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion accordion title',
    },
    accordionTextFreshman: {
      id: 'ss.application:conclusion.general.accordionTextFreshman#markdown',
      defaultMessage:
        `* **xx. júní 2025**` +
        `\n\n Umsóknartímabili lýkur. Ekki verður farið að vinna úr umsóknum fyrr en eftir þessa dagsetningu. Ef þú af einhverjum ástæðum vilt gera breytingar þarftu að eyða núverandi umsókn og gera nýja áður en tímabilinu lýkur.\n` +
        `* **yy. - zz. júní 2025**` +
        `\n\n Unnið er úr umsóknum á þessu tímabili og verður tilkynning send á alla umsækjendur. Hnipp verður sent í gegnum island.is og ættir þú að fá tilkynningu í appið og tölvupóst um niðurstöðuna.`,
      description: 'Conclusion accordion text freshman',
    },
    accordionTextGeneral: {
      id: 'ss.application:conclusion.general.accordionTextGeneral#markdown',
      defaultMessage:
        `* **aa. júní 2025**` +
        `\n\n Umsóknartímabili lýkur. Ekki verður farið að vinna úr umsóknum fyrr en eftir þessa dagsetningu. Ef þú af einhverjum ástæðum vilt gera breytingar þarftu að eyða núverandi umsókn og gera nýja áður en tímabilinu lýkur.\n` +
        `* **bb. - cc. júní 2025**` +
        `\n\n Unnið er úr umsóknum á þessu tímabili og verður tilkynning send á alla umsækjendur. Hnipp verður sent í gegnum island.is og ættir þú að fá tilkynningu í appið og tölvupóst um niðurstöðuna.`,
      description: 'Conclusion accordion text general',
    },
  }),
  overview: defineMessages({
    alertTitle: {
      id: 'ss.application:conclusion.overview.alertTitle',
      defaultMessage: 'Athugið',
      description: 'Conclusion overview alert title',
    },
    alertMessage: {
      id: 'ss.application:conclusion.overview.alertMessage',
      defaultMessage:
        'Umsóknartímabili lýkur xx. júní. Ekki verður farið að vinna úr umsóknum fyrr en eftir þessa dagsetningu. Ef þú af einhverjum ástæðum vilt gera breytingar þarftu að eyða núverandi umsókn og gera nýja áður en tímabilinu lýkur.',
      description: 'Conclusion overview alert message',
    },
  }),
  buttons: defineMessages({
    back: {
      id: 'ss.application:conclusion.buttons.back',
      defaultMessage: 'Til baka',
      description: 'Back button in conclusion',
    },
    overview: {
      id: 'ss.application:conclusion.buttons.overview',
      defaultMessage: 'Skoða yfirlit',
      description: 'Overview button in conclusion',
    },
  }),
}
