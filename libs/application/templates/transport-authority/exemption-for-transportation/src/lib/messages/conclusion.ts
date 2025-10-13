import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:conclusion.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion section',
    },
    pageTitle: {
      id: 'ta.eft.application:conclusion.general.pageTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion page',
    },
    alertTitle: {
      id: 'ta.eft.application:conclusion.general.alertTitle',
      defaultMessage: 'Umsókn send til Samgöngustofu!',
      description: 'Conclusion general alert title',
    },
    alertMessage: {
      id: 'ta.eft.application:conclusion.general.alertMessage',
      defaultMessage: 'Umsóknin hefur verið send.',
      description: 'Conclusion general alert message',
    },
    accordionTitle: {
      id: 'ta.eft.application:conclusion.general.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion accordion title',
    },
    accordionText: {
      id: 'ta.eft.application:conclusion.general.accordionText#markdown',
      defaultMessage: `* Undanþágan verður yfirfarin af Samgöngustofu og Vegagerð og eftir atvikum öðrum hagsmunaaðilum. Niðurstaðan verður síðan send á umbeðin netföng. \n* Vakin er athygli á því að ekki er hægt að ábyrgjast að beiðnir um undanþágur vegna stærðar og þyngdar sem berast eftir kl. 13.00 verði afgreiddar samdægurs. \n* Vegagerðin gefur sér allt að tíu virka daga til að afgreiða undanþágur ef skoða þarf sérstaklega brú eða önnur umferðarmannvirki á flutningsleið.`,
      description: 'Conclusion accordion text',
    },
  }),
}
