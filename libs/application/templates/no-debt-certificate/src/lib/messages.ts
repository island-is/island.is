import { defineMessages } from 'react-intl'

export const m = defineMessages({
  name: {
    id: 'cr.application:name',
    defaultMessage: 'Umsókn um skuldleysisvottorð',
    description: `Application's name`,
  },
  noDebtCertificate: {
    id: 'cr.application:noDebtCertificate',
    defaultMessage: 'Skuldleysisvottorð',
    description: `NoDebtCertificate`,
  },
  externalDataSection: {
    id: 'cr.application:externalData.section',
    defaultMessage: 'Gagnaöflun',
    description: 'Some description',
  },
  externalDataTitle: {
    id: 'cr.application:application.title',
    defaultMessage: 'Umsókn um skuldleysisvottorð',
    description: 'Application for no debt certificate for companies',
  },
  externalDataSubTitle: {
    id: 'cr.application:externalData.title',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'he following data will be retrieved electronically',
  },
  externalDataAgreement: {
    id: 'cr.application:externalData.agreement',
    defaultMessage: 'Ég hef kynnt mér ofangreint',
    description: 'I understand',
  },
  nationalRegistryTitle: {
    id: 'cr.application:nationalRegistry.title',
    defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
    description: 'Personal information from the National Registry',
  },
  nationalRegistrySubTitle: {
    id: 'cr.application:nationalRegistry.subTitle',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
    description:
      'Information from the National Registry will be used to prefill the data in the application',
  },
  userProfileInformationTitle: {
    id: 'cr.application:userprofile.title',
    defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
    description: 'Your user profile information',
  },
  userProfileInformationSubTitle: {
    id: 'cr.application:userprofile.subTitle',
    defaultMessage:
      'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
    description:
      'In order to apply for this application we need your email and phone number',
  },
  actionCardDraft: {
    id: 'cr.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardDone: {
    id: 'cr.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  confirmation: {
    id: 'cr.application:confirmation',
    defaultMessage: 'Staðfesting',
    description: 'confirmation',
  },
  confirm: {
    id: 'cr.application:confirm',
    defaultMessage: 'Staðfesta',
    description: 'confirm',
  },
  institutionName: {
    id: 'cr.application:institution',
    defaultMessage: 'Fjársýsla ríkisins',
    description: `Institution's name`,
  },
  draftTitle: {
    id: 'cr.application:draft.title',
    defaultMessage: 'Drög',
    description: 'First state title',
  },
  draftDescription: {
    id: 'cr.application:draft.description',
    defaultMessage: 'Á eftir að samþykkja gagnaöflun',
    description: 'Description of the state',
  },
  errorDataProviderNoDebtCertificate: {
    id: 'cr.application:error.errorDataProviderNoDebtCertificate',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in no debt certificate data provider',
  },
  errorDataProvider: {
    id: 'cr.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  noDebtCertificateInformationTitle: {
    id: 'cr.application:noDebtCertificate.title',
    defaultMessage: 'Upplýsingar úr gagnagrunni fjársýslu ríkisins',
    description: 'Information from the state treasury database',
  },
  noDebtCertificateInformationSubTitle: {
    id: 'cr.application:noDebtCertificate.subTitle',
    defaultMessage: 'Skjal sem inniheldur skuldleysisvottorðið þitt.',
    description:
      'Document that contains your no debt certificate for companies.',
  },
  submitErrorButtonCaption: {
    id: 'cr.application:submitErrorButtonCaption',
    defaultMessage: 'Reyna aftur',
    description:
      'Button that shows up when submitting the application fails, allowing you to retry',
  },
  submitErrorTitle: {
    id: 'cr.application:submitErrorTitle',
    defaultMessage: 'Móttaka umsóknar tókst ekki',
    description:
      'title that shows up when an error occurs while submitting the application',
  },
  submitErrorMessage: {
    id: 'cr.application:submitErrorMessage',
    defaultMessage:
      'Eitthvað fór úrskeiðis við að senda inn umsókn. Reyndu aftur síðar.',
    description:
      'Text that shows up when an error occurs while submitting the application',
  },
  successTitle: {
    id: 'cr.application:successTitle',
    defaultMessage: 'Umsókn þín um skuldleysisvottorð hefur verið staðfest',
    description: '',
  },
  successDescription: {
    id: 'cr.application:successDescription',
    defaultMessage: 'Þú getur nú nálgast umsóknina þína inni á mínum síðum',
    description: '',
  },
  vertificationDescription: {
    id: 'cr.application:vertificationDescription',
    defaultMessage: 'Nánari upplýsingar um sannreyningu má finna á',
    description: '',
  },
  vertificationLinkUrl: {
    id: 'cr.application:vertificationLinkUrl',
    defaultMessage: 'https://island.is/sannreyna',
    description:
      'The url for the link to further information about the verification',
  },
  vertificationLinkTitle: {
    id: 'cr.application:vertificationLinkTitle',
    defaultMessage: 'island.is/sannreyna',
    description:
      'The title for the link to further information about the verification',
  },
  noDebtCertificateInboxText: {
    id: 'cr.application:noDebtCertificateInboxText',
    defaultMessage:
      'Þú getur einning fundið skuldleysisvottorðið í pósthólfinu þínu',
    description:
      'You can also find the no debt certificate for companies in your inbox',
  },
  noDebtCertificateInboxLink: {
    id: 'cr.application:noDebtCertificateInboxLink',
    defaultMessage: 'https://island.is/minarsidur/postholf',
    description: 'Link to the island.is inbox',
  },
  downloadNoDebtCertificate: {
    id: 'cr.application:downloadNoDebtCertificate',
    defaultMessage: 'Hlaða niður skuldleysisvottorði',
    description: 'Download no debt certificate for companies',
  },
  openMySites: {
    id: 'cr.application:openMySites',
    defaultMessage: 'Opna mínar síður',
    description: 'Open my sites',
  },
  outroMessage: {
    id: 'cr.application:outro.message',
    defaultMessage:
      'Your application #{id} is now in review. The ID of the application is returned by the createApplication API action and read from application.externalData',
    description: '',
  },
  tryAgain: {
    id: 'cr.application:tryAgain',
    defaultMessage: 'Reyna aftur',
    description: '',
  },
  missingCertificate: {
    id: 'debtCertificate:missingCertificate',
    defaultMessage: 'Ekki tókst að sækja skuldleysisvottorð fyrir þig',
    description: '',
  },
})
