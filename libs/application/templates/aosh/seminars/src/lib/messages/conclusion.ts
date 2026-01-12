import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.sem.application:conclusion.general.pageTitle',
      defaultMessage: 'Skráning móttekin!',
      description: `Conclusion page title`,
    },
    sectionTitle: {
      id: 'aosh.sem.application:conclusion.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: `Conclusion section title`,
    },
    subTitle: {
      id: 'aosh.sem.application:conclusion.general.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'Conclusion subTitle',
    },
  }),
  default: defineMessages({
    alertTitle: {
      id: 'aosh.sem.application:conclusion.default.alertTitle',
      defaultMessage: 'Skráning á námskeið {seminar} móttekin.',
      description: 'Conclusion alert message',
    },
    accordionTitle: {
      id: 'aosh.sem.application:conclusion.default.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion accordion title',
    },
    accordionTextCashOnDelivery: {
      id: 'aosh.sem.application:conclusion.default.accordionTextCashOnDelivery#markdown',
      defaultMessage: `Greiðsla hefur verið móttekin. Hægt er að nálgast 
    kvittun vegna greiðslu á mínum síðum [Ísland.is](https://island.is). 
    \nSkráðir nemendur munu fá póst um að þeir hafi verið skráðir 
    námskeið ásamt leiðbeiningum um hvar og hvernig eigi að sinna 
    náminu.`,
      description: 'Conclusion cash on delivery accordion text',
    },
    accordionTextPutIntoAccount: {
      id: 'aosh.sem.application:conclusion.default.accordionTextPutIntoAccount#markdown',
      defaultMessage: `* Krafa hefur nú verið stofnuð í bókhaldi Fjársýslu ríkisins.
* Rafrænir reikningar eru sendir þaðan vikulega.
* Fyrirtæki geta séð yfirlit reikninga á mínum síðum [Ísland.is](https://island.is).
\nSkráðir nemendur munu fá póst um að þeir hafi verið skráðir 
námskeið ásamt leiðbeiningum um hvar og hvernig eigi að sinna náminu.`,
      description: 'Conclusion put into account accordion text',
    },
  }),
}
