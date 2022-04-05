import { defineMessages } from 'react-intl'

export const m = defineMessages({
  name: {
    id: 'mc.application:name',
    defaultMessage: 'Umsókn um veðbókarvottorð',
    description: "Application's name",
  },
  continue: {
    id: 'cr.application:continue',
    defaultMessage: 'Áfram',
    description: 'Continue',
  },
  mortgageCertificate: {
    id: 'mc.application:mortgageCertificate',
    defaultMessage: 'Veðbókarvottorð',
    description: 'MortgageCertificate',
  },
  externalDataSection: {
    id: 'mc.application:externalData.section',
    defaultMessage: 'Gagnaöflun',
    description: 'Some description',
  },
  externalDataTitle: {
    id: 'mc.application:mortgageCertificate.mainTitle',
    defaultMessage: 'Umsókn um veðbókarvottorð',
    description: 'Title of the application',
  },
  externalDataSubTitle: {
    id: 'mc.application:externalData.title',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'he following data will be retrieved electronically',
  },
  externalDataAgreement: {
    id: 'mc.application:externalData.agreement',
    defaultMessage: 'Ég hef kynnt mér ofangreint',
    description: 'I understand',
  },
  nationalRegistryTitle: {
    id: 'mc.application:nationalRegistry.title',
    defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
    description: 'Personal information from the National Registry',
  },
  nationalRegistrySubTitle: {
    id: 'mc.application:nationalRegistry.subTitle',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
    description:
      'Information from the National Registry will be used to prefill the data in the application',
  },
  nationalRegistryRealEstateTitle: {
    id: 'mc.application:nationalRegistryRealEstate.title',
    defaultMessage: 'Fasteignaupplýsingar úr Þjóðskrá',
    description: 'Real estate information from the National Registry',
  },
  nationalRegistryRealEstateSubTitle: {
    id: 'mc.application:nationalRegistryRealEstate.subTitle',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við fasteignaupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
    description:
      'Information from the National Registry will be used to prefill the data in the application',
  },
  userProfileInformationTitle: {
    id: 'mc.application:userprofile.title',
    defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
    description: 'Your user profile information',
  },
  userProfileInformationSubTitle: {
    id: 'mc.application:userprofile.subTitle',
    defaultMessage:
      'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
    description:
      'In order to apply for this application we need your email and phone number',
  },
  actionCardDraft: {
    id: 'mc.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'mc.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  actionCardDone: {
    id: 'mc.application:actionCardDone',
    defaultMessage: 'Afgreidd',
    description:
      'Description of application state/status when application is processed',
  },
  payment: {
    id: 'mc.application:payment',
    defaultMessage: 'Greiðsla',
    description: 'payment',
  },
  paymentCapital: {
    id: 'mc.application:awaitingPayment',
    defaultMessage: 'Staðfesting á greiðslu',
    description: 'Payment',
  },
  forwardingToPayment: {
    id: 'mc.application:forwardingToPayment',
    defaultMessage: 'Sendi þig áfram á greiðsluveitu...',
    description: 'Forwarding you to payment handler...',
  },
  confirmation: {
    id: 'mc.application:confirmation',
    defaultMessage: 'Staðfesting',
    description: 'payment',
  },
  confirm: {
    id: 'mc.application:confirm',
    defaultMessage: 'Staðfesta',
    description: 'payment',
  },
  institutionName: {
    id: 'mc.application:institution',
    defaultMessage: 'Sýslumenn',
    description: "Institution's name",
  },
  draftTitle: {
    id: 'mc.application:draft.title',
    defaultMessage: 'Drög',
    description: 'First state title',
  },
  overviewPaymentCharge: {
    id: 'mc.application:overview.paymentcharge',
    defaultMessage: 'Til greiðslu',
    description: 'Cost',
  },
  draftDescription: {
    id: 'mc.application:draft.description',
    defaultMessage: 'Á eftir að samþykkja gagnaöflun',
    description: 'Description of the state',
  },
  errorDataProviderMortgageCertificate: {
    id: 'mc.application:error.errorDataProviderMortgageCertificate',
    defaultMessage: 'Reyndu aftur síðar eða leitaðu til næsta sýslumanns',
    description: 'Unhandled error in mortgage certificate data provider',
  },
  errorDataProvider: {
    id: 'mc.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  mortgageCertificateNoPropertyRegistered: {
    id: 'mc.application:mortgageCertificate.noPropertyRegistered',
    defaultMessage: 'Ekki fannst skráð eign á þessari kennitölu',
    description:
      'No registered property was found on this social security number',
  },
  mortgageCertificateInformationTitle: {
    id: 'mc.application:mortgageCertificate.title',
    defaultMessage: 'Upplýsingar úr veðbókarskrá',
    description: 'Information from the mortgage certificate database',
  },
  mortgageCertificateInformationSubTitle: {
    id: 'mc.application:mortgageCertificate.subTitle',
    defaultMessage: 'Skjal sem inniheldur veðbókarvottorðið þitt.',
    description: 'Document that contains your mortgage certificate.',
  },
  examplePaymentPendingFieldError: {
    id: 'mc.application:example.waitingForPaymentError',
    defaultMessage: 'Villa kom upp við að sækja upplýsingar um greiðslu',
    description: 'An error came up while getting payment information',
  },
  examplePaymentPendingDescription: {
    id: 'mc.application:example.waitingDescription',
    defaultMessage: 'Texti um hvað er að gerast',
    description: 'Text about current payment proceedures.',
  },
  paymentPendingDescription: {
    id: 'mc.application:paymentPendingDescription',
    defaultMessage: 'Augnablik meðan beðið er eftir staðfestingu',
    description: 'Please wait until the payment is confirmed',
  },
  paymentImage: {
    id: 'dl.application:paymentImage',
    defaultMessage: 'Skrautmynd',
    description: 'Company Image',
  },
  submitErrorButtonCaption: {
    id: 'mc.application:submitErrorButtonCaption',
    defaultMessage: 'Reyna aftur',
    description:
      'Button that shows up when submitting the application fails, allowing you to retry',
  },
  submitErrorTitle: {
    id: 'mc.application:submitErrorTitle',
    defaultMessage: 'Móttaka umsóknar tókst ekki',
    description:
      'title that shows up when an error occurs while submitting the application',
  },
  submitErrorMessage: {
    id: 'mc.application:submitErrorMessage',
    defaultMessage:
      'Eitthvað fór úrskeiðis við að senda inn umsókn. Reyndu aftur síðar.',
    description:
      'Text that shows up when an error occurs while submitting the application',
  },
  successTitle: {
    id: 'mc.application:successTitle',
    defaultMessage: 'Umsókn þín um veðbókarvottorð hefur verið staðfest',
    description: '',
  },
  successDescription: {
    id: 'mc.application:successDescription',
    defaultMessage: 'Þú getur nú nálgast umsóknina þína inni á mínum síðum',
    description: '',
  },
  verificationDescription: {
    id: 'mc.application:verificationDescription',
    defaultMessage: 'Nánari upplýsingar um sannreyningu má finna á',
    description: '',
  },
  verificationLinkUrl: {
    id: 'mc.application:verificationLinkUrl',
    defaultMessage: 'https://island.is/sannreyna',
    description:
      'The url for the link to further information about the verification',
  },
  verificationLinkTitle: {
    id: 'mc.application:verificationLinkTitle',
    defaultMessage: 'island.is/sannreyna',
    description:
      'The title for the link to further information about the verification',
  },
  mortgageCertificateInboxText: {
    id: 'mc.application:mortgageCertificateInboxText',
    defaultMessage:
      'Þú getur einning fundið veðbókarvottorðið í pósthólfinu þínu',
    description: 'You can also find the mortgage certificate in your inbox',
  },
  mortgageCertificateInboxLink: {
    id: 'mc.application:mortgageCertificateInboxLink',
    defaultMessage: 'https://island.is/minarsidur/postholf',
    description: 'Link to the island.is inbox',
  },
  downloadMortgageCertificate: {
    id: 'mc.application:downloadMortgageCertificate',
    defaultMessage: 'Hlaða niður veðbókarvottorði',
    description: 'Download mortgage certificate',
  },
  openMySites: {
    id: 'mc.application:openMySites',
    defaultMessage: 'Opna mínar síður',
    description: 'Open my sites',
  },
  outroMessage: {
    id: 'mc.application:outro.message',
    defaultMessage:
      'Your application #{id} is now in review. The ID of the application is returned by the createApplication API action and read from application.externalData',
    description: '',
  },
  errorMinAgeNotFulfilled: {
    id: 'mc.application:errorMinAgeNotFulfilled',
    defaultMessage:
      'Þú hefur ekki náð lágmarksaldri til að sækja um veðbókarvottorð',
    description: '',
  },
  errorMortgageCertificateDataProvider: {
    id: 'mc.application:errorMortgageCertificateDataProvider',
    defaultMessage:
      'Þú hefur ekki náð lágmarksaldri til að sækja um veðbókarvottorð',
    description: '',
  },
  tryAgain: {
    id: 'mc.application:tryAgain',
    defaultMessage: 'Reyna aftur',
    description: '',
  },
  selectRealEstateTitle: {
    id: 'mc.application:selectRealEstate.title',
    defaultMessage: 'Upplýsingar um eign',
    description: 'Real estate selection',
  },
  selectRealEstateDescription: {
    id: 'mc.application:selectRealEstate.description',
    defaultMessage:
      'Hér birtast upplýsingar úr fasteignaskrá um fasteignir þínar, lönd og lóðir sem þú ert þinglýstur eigandi að. Vinsamlegast hakaðu við þá eign sem þú ert að sækja veðbókarvottorð fyrir.',
    description:
      'Here is information from the Property Registry about your real estate, lands and plots that you are a registered owner of. Please check the property for which you are applying for a mortgage certificate.',
  },
  pendingRejectedTryAgainDescription: {
    id: 'mc.application:pendingRejectedTryAgain.description',
    defaultMessage:
      'Hér birtast upplýsingar úr fasteignaskrá um fasteignir þínar, lönd og lóðir sem þú ert þinglýstur eigandi að. Vinsamlegast hakaðu við þá eign sem þú ert að sækja veðbókarvottorð fyrir.',
    description:
      'Here is information from the Property Registry about your real estate, lands and plots that you are a registered owner of. Please check the property for which you are applying for a mortgage certificate.',
  },
  errorSheriffApiTitle: {
    id: 'mc.application:errorSherrifApi.title',
    defaultMessage: 'Villa hefur komið upp á milli Ísland.is og sýslumanna',
    description:
      "An error has occurred between Ísland.is and the sheriff's office",
  },
  errorSheriffApiMessage: {
    id: 'mc.application:errorSherrifApi.message',
    defaultMessage: 'Vinsamlega reyndu aftur síðar',
    description: 'Please try again later',
  },
  propertyNumber: {
    id: 'mc.application:property.number',
    defaultMessage: 'Fasteignarnúmer',
    description: 'Property number',
  },
  propertyMarking: {
    id: 'mc.application:property.marking',
    defaultMessage: 'Merking',
    description: 'Marking',
  },
  propertyDescription: {
    id: 'mc.application:property.description',
    defaultMessage: 'Lýsing',
    description: 'Description',
  },
  propertyConstructionYear: {
    id: 'mc.application:property.constructionYear',
    defaultMessage: 'Byggingarár',
    description: 'Construction year',
  },
  propertyShownSize: {
    id: 'mc.application:property.shownSize',
    defaultMessage: 'Birt stærð',
    description: 'Shown size',
  },
  propertyAddress: {
    id: 'mc.application:property.address',
    defaultMessage: 'Heimilisfang',
    description: 'Address',
  },
  propertySearch: {
    id: 'mc.application:property.search',
    defaultMessage: 'Leita að eign',
    description: 'Search properties',
  },
  propertyNotFoundTitle: {
    id: 'mc.application:property.notFoundTitle',
    defaultMessage: 'Eign fannst ekki',
    description: 'Property not found',
  },
  propertyNotFoundMessage: {
    id: 'mc.application:property.notFoundMessage',
    defaultMessage: 'Ekki fannst nein eign með þessu fasteignanúmeri',
    description: 'No property was found with this property number',
  },
  propertyErrorCertificateTitle: {
    id: 'mc.application:property.certificateErrorTitle',
    defaultMessage: 'Ekki tókst að sækja veðbókavottorð fyrir þessa eign',
    description: 'Failed to retrieve mortgage certificate for this property',
  },
  propertyErrorCertificateMessage: {
    id: 'mc.application:property.certificateErrorMessage',
    defaultMessage:
      'Því miður getum við ekki sótt rafrænt veðbókarvottorð fyrir valda eign þar sem skráning á viðkomandi eign þarnast uppfærslu. Sýslumanni í því umdæmi sem eignin er í verður send beiðni um lagfæringu, þú munt fá tilkynningu (á netfang) að yfirferð lokinni og getur þá reynt aftur.',
    description:
      'Sorry, we are unable to download an electronic mortgage certificate for the selected property as the listing of the property in question needs updating. The district commissioner of the property in which the property is located will be sent a request for repairs, you will be notified (by email) after the inspection and can then try again.',
  },
  propertyErrorCertificateSheriffTitle: {
    id: 'mc.application:property.errorCertificateSheriffTitle',
    defaultMessage:
      'Beiðni um lagfæringu á veðbókarvottorði hefur verið send sýslumanni',
    description:
      'A request for correction of the mortgage certificate has been sent to the district commissioner',
  },
  propertyErrorCertificateSheriffMessage: {
    id: 'mc.application:property.errorCertificateSheriffMessage',
    defaultMessage:
      'Þú munt fá tilkynningu á netfangið [netfang] að yfirferð lokinni og getur þá reynt aftur og klárað umsóknina þína.',
    description:
      'You will be notified by email [email address] after the review and can then try again and complete your application.',
  },
  propertySearchInfoMessage: {
    id: 'mc.application:property.searchInfoMessage',
    defaultMessage:
      'Hér að neðan getur þú einnig leitað í fasteignanúmerum annarra eigna',
    description:
      'Below you can also search the real estate numbers of other properties',
  },
  propertySearchInfoLink: {
    id: 'mc.application:property.searchInfoLink',
    defaultMessage: 'Hér getur þú nálgast nánari uppýsingar um eignina á skrá',
    description: 'Here you can get more information about the property on file',
  },

  propertyCertificateError: {
    id: 'mc.application:property.certificateError',
    defaultMessage: 'Ekki gekk að sækja vottorð fyrir þessa eign',
    description: 'Failed to fetch certificate for this property',
  },
  propertyCertificateErrorContactSheriff: {
    id: 'mc.application:property.certificateErrorContactSheriff',
    defaultMessage:
      'Vinsamlega hafðu samband við sýslumann, það er búið að senda inn beiðni um leiðréttingu',
    description:
      'Please contact the sheriff, a request for correction has been submitted',
  },
  mysites: {
    id: 'mc.application:mysites',
    defaultMessage: 'Mínar síður',
    description: 'My sites',
  },
  property: {
    id: 'mc.application:property',
    defaultMessage: 'Eign',
    description: 'Property',
  },
  requestForProcessing: {
    id: 'mc.application:requestForProcessing',
    defaultMessage: 'Beiðni um vinnslu',
    description: 'Request for processing',
  },
})
