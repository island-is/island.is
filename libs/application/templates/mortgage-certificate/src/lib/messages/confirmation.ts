import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'mc.application:confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation section title',
    },
  }),
  labels: defineMessages({
    openMySites: {
      id: 'mc.application:confirmation.labels.openMySites',
      defaultMessage: 'Opna mínar síður',
      description: 'Open my sites',
    },
    downloadMortgageCertificate: {
      id: 'mc.application:confirmation.labels.downloadMortgageCertificate',
      defaultMessage: 'Hlaða niður veðbókarvottorði',
      description: 'Download mortgage certificate',
    },
    confirmation: {
      id: 'mc.application:confirmation.labels.confirmation',
      defaultMessage: 'Staðfesting',
      description: 'confirmation',
    },
    successTitle: {
      id: 'mc.application:confirmation.labels.successTitle',
      defaultMessage: 'Umsókn þín um veðbókarvottorð hefur verið staðfest',
      description: 'Confirmation success title',
    },
    successDescription: {
      id: 'mc.application:confirmation.labels.successDescription',
      defaultMessage: 'Þú getur nú nálgast umsóknina þína inni á mínum síðum',
      description: '',
    },
    verificationDescription: {
      id: 'mc.application:confirmation.labels.verificationDescription',
      defaultMessage: 'Nánari upplýsingar um sannreyningu má finna á',
      description: '',
    },
    verificationLinkUrl: {
      id: 'mc.application:confirmation.labels.verificationLinkUrl',
      defaultMessage: 'https://island.is/sannreyna',
      description:
        'The url for the link to further information about the verification',
    },
    verificationLinkTitle: {
      id: 'mc.application:confirmation.labels.verificationLinkTitle',
      defaultMessage: 'island.is/sannreyna',
      description:
        'The title for the link to further information about the verification',
    },
    mortgageCertificate: {
      id: 'mc.application:confirmation.labels.mortgageCertificate',
      defaultMessage: 'Veðbókarvottorð',
      description: 'MortgageCertificate',
    },
    mortgageCertificateInboxLink: {
      id: 'mc.application:confirmation.labels.mortgageCertificateInboxLink',
      defaultMessage: 'https://island.is/minarsidur/postholf',
      description: 'Mortgage certificate inbox link',
    },
    mortgageCertificateInboxLinkText: {
      id: 'mc.application:confirmation.labels.mortgageCertificateInboxLinkText',
      defaultMessage: 'pósthólfinu',
      description: 'Mortgage certificate inbox link text',
    },
    mortgageCertificateInboxText: {
      id: 'mc.application:confirmation.labels.mortgageCertificateInboxText',
      defaultMessage: 'Veðbókarvottorð geturðu fundið í ',
      description: 'You can also find the mortgage certificate in your inbox',
    },
    incorrectPropertyTitle: {
      id: 'mc.application:confirmation.labels.incorrectPropertyTitle#markdown',
      defaultMessage:
        'Beiðni um lagfæringu á veðbókarvottorði fyir {propertyName} hefur verið send sýslumanni.',
      description: 'Incorrect property title in alert message',
    },
    incorrectPropertyMessage: {
      id: 'mc.application:confirmation.labels.incorrectPropertyMessage',
      defaultMessage:
        'Þú munt fá tilkynningu í pósthólfið þitt að yfirferð lokinni og getur þá reynt aftur og klárað umsóknina þína.',
      description: 'Incorrect property message in alert message',
    },
  }),
}
