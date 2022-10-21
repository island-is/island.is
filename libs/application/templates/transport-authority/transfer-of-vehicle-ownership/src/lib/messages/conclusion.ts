import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    title: {
      id: 'ta.tvo.application:conclusion.general.title',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
    sectionTitle: {
      id: 'ta.tvo.application:conclusion.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
  }),
  seller: defineMessages({
    alertMessage: {
      id: 'ta.tvo.application:conclusion.seller.alertMessage',
      defaultMessage:
        'Skráning þín á eigendaskiptum ökutækis hefur verið móttekin!',
      description: 'Conclusion seller alert message',
    },
    accordionTitle: {
      id: 'ta.tvo.application:conclusion.seller.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion seller accordion title',
    },
    accordionText: {
      id: 'ta.tvo.application:conclusion.seller.accordionText',
      defaultMessage: `Nú þarf kaupandi að samþykkja eigendaskiptin. Greiðslan verður í bið á meðan beðið er eftir samþykkinu og fellur niður innan tveggja vikna verði samþykki ekki komið innan þess tíma og fella þá eigendaskiptin niður.
        Þegar kaupandinn hefur samþykkt ganga eigendaskiptin í gegn og bifreiðin ekki lengur sýnileg inni á þínum síðum.`,
      description: 'Conclusion seller accordion text',
    },
  }),
  buyer: defineMessages({
    alertMessage: {
      id: 'ta.tvo.application:conclusion.seller.alertMessage',
      defaultMessage:
        'Samþykt þín á eigendaskiptum ökutækis og skráning meiganda hefur verið móttekin!',
      description: 'Conclusion seller alert message',
    },
    accordionTitle: {
      id: 'ta.tvo.application:conclusion.seller.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion seller accordion title',
    },
    accordionText: {
      id: 'ta.tvo.application:conclusion.seller.accordionText',
      defaultMessage: `Nú þarf meðeigandi að samþykkja skráninguna. Greiðslan verður í bið á meðan beðið er eftir samþykkinu og fellur niður innan tveggja vikna verði samþykki ekki komið innan þess tíma og fella þá eigendaskiptin niður.`,
      description: 'Conclusion seller accordion text',
    },
  }),
}
