import { defineMessages } from 'react-intl'

export const m = defineMessages({
  name: {
    id: 'ndc.application:name',
    defaultMessage: 'Umsókn um skuldleysisvottorð',
    description: `Application's name`,
  },
  noDebtCertificate: {
    id: 'ndc.application:noDebtCertificate',
    defaultMessage: 'Skuldleysisvottorð',
    description: `NoDebtCertificate`,
  },
  externalDataSection: {
    id: 'ndc.application:externalData.section',
    defaultMessage: 'Gagnaöflun',
    description: 'Some description',
  },
  externalDataTitle: {
    id: 'ndc.application:application.title',
    defaultMessage: 'Umsókn um skuldleysisvottorð',
    description: 'Application for no debt certificate for companies',
  },
  externalDataSubTitle: {
    id: 'ndc.application:externalData.title',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'he following data will be retrieved electronically',
  },
  externalDataAgreement: {
    id: 'ndc.application:externalData.agreement',
    defaultMessage: 'Ég hef kynnt mér ofangreint',
    description: 'I understand',
  },
  actionCardDraft: {
    id: 'ndc.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardDone: {
    id: 'ndc.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  confirmation: {
    id: 'ndc.application:confirmation',
    defaultMessage: 'Staðfesting',
    description: 'confirmation',
  },
  confirm: {
    id: 'ndc.application:confirm',
    defaultMessage: 'Staðfesta',
    description: 'confirm',
  },
  institutionName: {
    id: 'ndc.application:institution',
    defaultMessage: 'Fjársýsla ríkisins',
    description: `Institution's name`,
  },
  draftTitle: {
    id: 'ndc.application:draft.title',
    defaultMessage: 'Drög',
    description: 'First state title',
  },
  draftDescription: {
    id: 'ndc.application:draft.description',
    defaultMessage: 'Á eftir að samþykkja gagnaöflun',
    description: 'Description of the state',
  },
  errorDataProviderNoDebtCertificate: {
    id: 'ndc.application:error.errorDataProviderNoDebtCertificate',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in no debt certificate data provider',
  },
  errorDataProvider: {
    id: 'ndc.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  noDebtCertificateInformationTitle: {
    id: 'ndc.application:noDebtCertificate.title',
    defaultMessage: 'Upplýsingar úr gagnagrunni fjársýslu ríkisins',
    description: 'Information from the state treasury database',
  },
  noDebtCertificateInformationSubTitle: {
    id: 'ndc.application:noDebtCertificate.subTitle',
    defaultMessage: 'Skjal sem inniheldur skuldleysisvottorðið þitt.',
    description:
      'Document that contains your no debt certificate for companies.',
  },
  submitErrorButtonCaption: {
    id: 'ndc.application:submitErrorButtonCaption',
    defaultMessage: 'Reyna aftur',
    description:
      'Button that shows up when submitting the application fails, allowing you to retry',
  },
  submitErrorTitle: {
    id: 'ndc.application:submitErrorTitle',
    defaultMessage: 'Móttaka umsóknar tókst ekki',
    description:
      'title that shows up when an error occurs while submitting the application',
  },
  submitErrorMessage: {
    id: 'ndc.application:submitErrorMessage',
    defaultMessage:
      'Eitthvað fór úrskeiðis við að senda inn umsókn. Reyndu aftur síðar.',
    description:
      'Text that shows up when an error occurs while submitting the application',
  },
  successTitle: {
    id: 'ndc.application:successTitle',
    defaultMessage: 'Umsókn þín um skuldleysisvottorð hefur verið staðfest',
    description: '',
  },
  successDescription: {
    id: 'ndc.application:successDescription',
    defaultMessage:
      'Þú getur nálgast skuldleysisvottorðið hér að neðan. Vottorðið birtist jafnframt í pósthólfinu á mínum síðum',
    description: '',
  },
  vertificationDescription: {
    id: 'ndc.application:vertificationDescription',
    defaultMessage: 'Nánari upplýsingar um sannreyningu má finna á',
    description: '',
  },
  verificationLinkUrl: {
    id: 'ndc.application:verificationLinkUrl',
    defaultMessage: 'https://island.is/sannreyna',
    description:
      'The url for the link to further information about the verification',
  },
  verificationLinkTitle: {
    id: 'ndc.application:verificationLinkTitle',
    defaultMessage: 'island.is/sannreyna',
    description:
      'The title for the link to further information about the verification',
  },
  noDebtCertificateInboxText: {
    id: 'ndc.application:noDebtCertificateInboxText',
    defaultMessage:
      'Þú getur einning fundið skuldleysisvottorðið í pósthólfinu þínu',
    description:
      'You can also find the no debt certificate for companies in your inbox',
  },
  downloadNoDebtCertificate: {
    id: 'ndc.application:downloadNoDebtCertificate',
    defaultMessage: 'Hlaða niður skuldleysisvottorði',
    description: 'Download no debt certificate for companies',
  },
  openMySites: {
    id: 'ndc.application:openMySites',
    defaultMessage: 'Opna mínar síður',
    description: 'Open my sites',
  },
  outroMessage: {
    id: 'ndc.application:outro.message',
    defaultMessage:
      'Your application #{id} is now in review. The ID of the application is returned by the createApplication API action and read from application.externalData',
    description: '',
  },
  tryAgain: {
    id: 'ndc.application:tryAgain',
    defaultMessage: 'Reyna aftur',
    description: '',
  },
  missingCertificateTitle: {
    id: 'ndc.application:missingCertificateTitle',
    defaultMessage: 'Ekki tókst að staðfesta skuldleysi',
    description: '',
  },
  missingCertificateSummary: {
    id: 'ndc.application:missingCertificateSummary',
    defaultMessage:
      'Staðfesting á skuldleysi fékkst ekki úr gagnagrunni Fjársýslu ríkisins',
    description: '',
  },
  pendingActionApplicationCompletedTitle: {
    id: 'ndc.application:pendingActionApplicationCompletedTitle',
    defaultMessage:
      'Umsókn þín hefur verið móttekin og er vottorðið aðgengilegt í stafrænu pósthólfi á Ísland.is.',
    description: 'Title of pending action',
  },
})
