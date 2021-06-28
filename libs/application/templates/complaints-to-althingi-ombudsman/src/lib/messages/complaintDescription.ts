import { defineMessages } from 'react-intl'

export const complaintDescription = {
  general: defineMessages({
    pageTitle: {
      id: 'ctao.application:complaintDescription.pageTitle',
      defaultMessage: 'Upplýsingar um kvörtunarefnið',
      description: 'Page title for complaint description screen',
    },
    decisionInfo: {
      id: 'ctao.application:complaintDescription.decisionInfo',
      defaultMessage:
        'Eitt af skilyrðunum fyrir því að umboðsmaður Alþingis geti tekið kvörtun til meðferðar er að hún sé borin fram innan árs frá niðurstöðu stjórnvalds í máli.',
      description: 'Page description when complaint type is decision',
    },
    alertTitle: {
      id: 'ctao.application:complaintDescription.alertTitle',
      defaultMessage: 'Athugið',
      description: 'Title of description alert',
    },
    alertMessage: {
      id: 'ctao.application:complaintDescription.alertMessage',
      defaultMessage:
        'Í kvörtun skal lýst þeirri úrlausn eða annarri háttsemi sem stjórnvalda sem er tilefni kvörtunar. Hér skalt þú reyna að lýsa því hvað í meðferð stjórnvalda á máli þínu þú ert ósátt/-ur við. Lýsing kvörtunar þarf ekki að vera flókin, t.d. er ekki nauðsynlegt að vísa til lagareglna.',
      description: 'Description alert message',
    },
  }),
  labels: defineMessages({
    decisionDateTitle: {
      id: 'ctao.application:complaintDescription.decisionTitle',
      defaultMessage: 'Dagsetning ákvörðunar',
      description: 'Decision date title',
    },
    decisionDatePlaceholder: {
      id: 'ctao.application:complaintDescription.decisionPlaceholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Decision date placeholder',
    },
    complaintDescriptionTitle: {
      id: 'ctao.application:complaintDescription.descriptionTitle',
      defaultMessage: 'Lýsing kvörtunar',
      description: 'Title of complaint description input',
    },
    complaintDescriptionPlaceholder: {
      id: 'ctao.application:complaintDescription.descriptionPlaceholder',
      defaultMessage: 'Stutt lýsing...',
      description: 'Placeholder of complaint description input',
    },
  }),
}
