import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.pe.application:conclusion.general.pageTitle',
      defaultMessage: 'Skráning móttekin!',
      description: `Conclusion page title`,
    },
    sectionTitle: {
      id: 'aosh.pe.application:conclusion.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: `Conclusion section title`,
    },
    subTitle: {
      id: 'aosh.pe.application:conclusion.general.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'Conclusion subTitle',
    },
  }),
  default: defineMessages({
    alertTitle: {
      id: 'aosh.pe.application:conclusion.default.alertMessage',
      defaultMessage: 'Skráning í verklegt próf hefur verið móttekin.',
      description: 'Conclusion alert message',
    },
    accordionTitle: {
      id: 'aosh.pe.application:conclusion.default.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion accordion title',
    },
    accordionTextCashOnDelivery: {
      id: 'aosh.pe.application:conclusion.default.accordionTextCashOnDelivery#markdown',
      defaultMessage: `Greiðsla hefur verið móttekin. Hægt er að nálgast 
    kvittun vegna greiðslu á mínum síðum [Ísland.is](https://island.is). 
    \nSkráðir nemendur munu fá póst um að þeir hafi verið skráðir í
    verklegt próf ásamt leiðbeiningum ... Þarf að klára þennan texta.`,
      description: 'Conclusion cash on delivery accordion text',
    },
    accordionTextPutIntoAccount: {
      id: 'aosh.pe.application:conclusion.default.accordionTextPutIntoAccount#markdown',
      defaultMessage: `* Krafa hefur nú verið stofnuð í bókhaldi Fjársýslu ríkisins.
* Rafrænir reikningar eru sendir þaðan vikulega.
* Fyrirtæki geta séð yfirlit reikninga á mínum síðum [Ísland.is](https://island.is).
\nSkráðir nemendur munu fá póst um að þeir hafi verið skráðir í
verklegt próf ásamt leiðbeiningum ... Þarf að klára þennan texta.`,
      description: 'Conclusion put into account accordion text',
    },
  }),
}
