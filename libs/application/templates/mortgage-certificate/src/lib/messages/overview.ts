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
    chosenProperties: {
      id: 'mc.application:overview.labels.chosenProperties',
      defaultMessage: 'Valdar eignir',
      description: 'Overview chosen properties label',
    },
    chosenProperty: {
      id: 'mc.application:overview.labels.chosenProperty',
      defaultMessage: 'Valin eign',
      description: 'Overview chosen property label',
    },
    warningAlertTitle: {
      id: 'mc.application:overview.labels.warningAlertTitle#markdown',
      defaultMessage: 'Ekki tókst að sækja veðbókavottorð fyrir {propertyName}',
      description: 'Overview warning alert message title',
    },
    warningAlertMessage: {
      id: 'mc.application:overview.labels.warningAlertMessage',
      defaultMessage:
        'Ekki tókst að sækja rafrænt veðbókarvottorð fyrir valda eign. Beiðni verður send sýslumanni í því umdæmi sem eignin er í. Að lokinni lagfæringu munt þú fá tilynningu í pósthólf þitt á ísland.is og getur þá reynt aftur.',
      description: 'Overview warning alert message ',
    },
    successAlertTitle: {
      id: 'mc.application:overview.labels.successAlertTitle#markdown',
      defaultMessage:
        'Beiðni um lagfæringu á veðbókarvottorð fyrir {propertyName} hefur verið send sýslumanni',
      description: 'Overview success alert message title',
    },
    successAlertMessage: {
      id: 'mc.application:overview.labels.successAlertMessage',
      defaultMessage:
        'Þú munt fá tilkynningu í pósthólfið þitt að yfirferð lokinni og getur þá reynt aftur og klárað umsóknina þína.',
      description: 'Overview success alert message ',
    },
    errorAlertTitle: {
      id: 'mc.application:overview.labels.errorAlertTitle',
      defaultMessage: 'Ekki náðist samband við þjónustu augnablikinu',
      description: 'Overview error alert message title',
    },
    errorAlertMessage: {
      id: 'mc.application:overview.labels.errorAlertMessage',
      defaultMessage: 'Vinsamlega reyndu aftur',
      description: 'Overview error alert message ',
    },
    fetchingCorrectionMessage: {
      id: 'mc.application:overview.labels.fetchingCorrectionMessage',
      defaultMessage: 'Sendi beiðni um lagfæringu til sýslumanns',
      description: 'Fetching correction ',
    },
  }),
}
