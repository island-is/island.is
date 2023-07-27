import { defineMessages } from 'react-intl'

export const m = defineMessages({
  name: {
    id: 'cr.application:name',
    defaultMessage: 'Umsókn um sakavottorð',
    description: `Application's name`,
  },
  criminalRecord: {
    id: 'cr.application:criminalRecord',
    defaultMessage: 'Sakavottorð',
    description: `CriminalRecord`,
  },
  externalDataSection: {
    id: 'cr.application:externalData.section',
    defaultMessage: 'Gagnaöflun',
    description: 'Some description',
  },
  externalDataTitle: {
    id: 'cr.application:application.title',
    defaultMessage: 'Umsókn um sakaskrá',
    description: 'Title of the application',
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
  actionCardPayment: {
    id: 'cr.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'cr.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  payment: {
    id: 'cr.application:payment',
    defaultMessage: 'Greiðsla',
    description: 'payment',
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
    defaultMessage: 'Sýslumenn',
    description: `Institution's name`,
  },
  draftTitle: {
    id: 'cr.application:draft.title',
    defaultMessage: 'Drög',
    description: 'First state title',
  },
  overviewPaymentCharge: {
    id: 'cr.application:overview.paymentcharge',
    defaultMessage: 'Til greiðslu',
    description: 'Cost',
  },
  overviewPaymentTotal: {
    id: 'cr.application:overview.paymentTotal',
    defaultMessage: 'Samtals',
    description: 'Total',
  },
  draftDescription: {
    id: 'cr.application:draft.description',
    defaultMessage: 'Á eftir að samþykkja gagnaöflun',
    description: 'Description of the state',
  },
  errorDataProviderCriminalRecord: {
    id: 'cr.application:error.errorDataProviderCriminalRecord',
    defaultMessage: 'Reyndu aftur síðar eða leitaðu til næsta sýslumanns',
    description: 'Unhandled error in criminal record data provider',
  },
  errorDataProvider: {
    id: 'cr.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  criminalRecordInformationTitle: {
    id: 'cr.application:criminalrecord.title',
    defaultMessage: 'Upplýsingar úr sakaskrá',
    description: 'Information from the criminal record database',
  },
  criminalRecordInformationSubTitle: {
    id: 'cr.application:criminalrecord.subTitle',
    defaultMessage: 'Skjal sem inniheldur sakavottorðið þitt.',
    description: 'Document that contains your criminal record.',
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
    defaultMessage: 'Umsókn þín um sakavottorð hefur verið staðfest',
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
  criminalRecordInboxText: {
    id: 'cr.application:criminalRecordInboxText',
    defaultMessage: 'Þú getur einning fundið sakavottorðið í pósthólfinu þínu',
    description: 'You can also find the criminal record in your inbox',
  },
  downloadCriminalRecord: {
    id: 'cr.application:downloadCriminalRecord',
    defaultMessage: 'Hlaða niður sakavottorði',
    description: 'Download criminal record',
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
  errorMinAgeNotFulfilled: {
    id: 'cr.application:errorMinAgeNotFulfilled',
    defaultMessage:
      'Þú hefur ekki náð lágmarksaldri til að sækja um sakavottorð',
    description: '',
  },
  errorCriminalRecordDataProvider: {
    id: 'cr.application:errorCriminalRecordDataProvider',
    defaultMessage:
      'Þú hefur ekki náð lágmarksaldri til að sækja um sakavottorð',
    description: '',
  },
  tryAgain: {
    id: 'cr.application:tryAgain',
    defaultMessage: 'Reyna aftur',
    description: '',
  },
  pendingActionApplicationCompletedTitle: {
    id: 'cr.application:pendingActionApplicationCompletedTitle',
    defaultMessage:
      'Umsókn þín hefur verið móttekin og er vottorðið aðgengilegt í stafrænu pósthólfi á Ísland.is.',
    description: 'Title of pending action',
  },
})
