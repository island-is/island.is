import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    sectionTitle: {
      id: 'ss.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of confirmation screen',
    },
    alertTitle: {
      id: 'ss.application:confirmation.general.alertTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Conclusion general alert title',
    },
    alertMessage: {
      id: 'ss.application:confirmation.general.alertMessage',
      defaultMessage:
        'Umsókn þín í framhaldsskóla hefur verið móttekin! Hægt er að senda inn nýja umsókn til xx. júní 2025',
      description: 'Conclusion general alert message',
    },
    accordionTitle: {
      id: 'ss.application:confirmation.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion accordion title',
    },
    accordionText: {
      id: 'ss.application:confirmation.general.accordionText',
      defaultMessage:
        `* **xx. júní 2025**` +
        `\n\n Umsóknartímabili lýkur. Ekki verður farið að vinna úr umsóknum fyrr en eftir þessa dagsetningu. Ef þú af einhverjum ástæðum vilt gera breytingar þarftu að eyða núverandi umsókn og gera nýja áður en tímabilinu lýkur.\n` +
        `* **yy. - zz. júní 2025**` +
        `\n\n Unnið er úr umsóknum á þessu tímabili og verður tilkynning send á alla umsækjendur. Hnipp verður sent í gegnum island.is og ættir þú að fá tilkynningu í appið og tölvupóst um niðurstöðuna.`,
      description: 'Conclusion accordion text',
    },
  }),
}
