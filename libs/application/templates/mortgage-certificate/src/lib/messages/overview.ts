import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'mc.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Overview section title',
    },
    pageTitle: {
      id: 'mc.application:overview.general.pageTitle',
      defaultMessage: 'Upplýsingar um eignir',
      description: 'Overview page title',
    },
    description: {
      id: 'mc.application:overview.general.description',
      defaultMessage: 'Þú ert að sækja um vottorð fyrir eftirtaldar eignir:',
      description: 'Overview description',
    },
  }),
  labels: defineMessages({
    chosenProperty: {
      id: 'mc.application:overview.labels.chosenProperty',
      defaultMessage: 'Valin eign',
      description: 'Overview chosen property label',
    },
    warningAlertTitle: {
      id: 'mc.application:overview.labels.warningAlertTitle',
      defaultMessage: 'Ekki tókst að sækja veðbókavottorð fyrir {propertyName}',
      description: 'Overview warning alert message title',
    },
    warningAlertMessage: {
      id: 'mc.application:overview.labels.warningAlertMessage',
      defaultMessage:
        'Því miður getum við ekki sótt rafrænt veðbókarvottorð fyrir valda eign þar skráning á viðkomandi eign þarnast uppfærslu. Sýslumanni í því umdæmi sem eignin er í verður send beiðni um lagfæringu, þú munt fá tilkynningu (á netfang) að yfirferð lokinni og getur þá reynt aftur.',
      description: 'Overview warning alert message ',
    },
    successAlertTitle: {
      id: 'mc.application:overview.labels.successAlertTitle',
      defaultMessage:
        'Beiðni um lagfæringu á veðbókarvottorði hefur verið send sýslumanni',
      description: 'Overview success alert message title',
    },
    successAlertMessage: {
      id: 'mc.application:overview.labels.successAlertMessage',
      defaultMessage:
        'Þú munt fá tilkynningu á netfangið {email} að yfirferð lokinni og getur þá reynt aftur og klárað umsóknina þína.',
      description: 'Overview success alert message ',
    },
  }),
}
