import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationTitle: {
    id: 'mac.application:applicationTitle',
    defaultMessage: 'Umsókn um könnun hjónavígsluskilyrða',
    description: 'Application for Marriage Conditions',
  },

  /* Intro section */
  introTitle: {
    id: 'mac.application:intro.title',
    defaultMessage: 'Inngangur',
    description: 'Some description',
  },
  introSectionTitle: {
    id: 'mac.application:introSection.title',
    defaultMessage: 'Könnun hjónavígsluskilyrða',
    description: 'Some description',
  },
  introSectionDescription: {
    id: 'mac.application:intro.introSection.description#markdown',
    defaultMessage: `Í þessu ferli fer fram könnun á hvort öll skilyrði eru uppfyllt til að hjónavígsla megi fara fram. Eftir að þú hefur fyllt út þessa umsókn verður hún send áfram á þinn 
    maka og á þá svaramenn sem tilgreindir eru í ferlinu. Ef þið uppfyllið öll skilyrði til að ganga í hjónaband gefur sýslumaður út svokallað könnunarvottorð sem vígsluaðili notar til að tilkynna Þjóðskrá Íslands um að hjónavígsla hafi farið fram. Könnunarvottorð gildir í 30 daga og þarf hjónavígsla því að fara fram innan þess gildistíma. Þetta ferli vistast sjálfkrafa á meðan það er fyllt út og hægt er að opna það aftur undir umsóknum inni á Mínar síður á Ísland.is. Þar getur þú einnig fylgst með stöðu mála eftir að öll gögn hafa verið send inn. Meðhöndlun umsóknar kostar 15.500kr og greiðist áður en könnun er send áfram á þinn maka.`,
    description: 'Some description',
  },

  /* Data Collection Section */
  dataCollectionTitle: {
    id: 'mac.application:applicationDataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Title for data collection section',
  },
  dataCollectionSubtitle: {
    id: 'mac.application:dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki',
    description: 'Subtitle for data collection section',
  },
  dataCollectionDescription: {
    id: 'mac.application:dataCollectionDescription',
    defaultMessage:
      'Til þess að uppfylla skilyrði til hjónavígslu þurfa bæði hjónaefni að skila inn fæðingar- og hjúskaparvottorði frá Þjóðskrá Íslands.',
    description: 'Description for data collection section',
  },
  dataCollectionCheckboxLabel: {
    id: 'mac.application:dataCollectionCheckboxLabel',
    defaultMessage: 'Ég samþykki gagnaöflun',
    description: 'Checkbox label for data collection section',
  },
  dataCollectionBirthCertificateTitle: {
    id: 'mac.application:dataCollectionBirthCertificateTitle',
    defaultMessage: 'Fæðingarvottorð',
    description: 'Birth certificate',
  },
  dataCollectionBirthCertificateDescription: {
    id: 'mac.application:dataCollectionBirthCertificateDescription',
    defaultMessage:
      'Vottorð um fæðingardag/kennitölu, kyn, fæðingarstað og nöfn foreldra.',
    description: 'Birth certificate',
  },
  dataCollectionMaritalStatusTitle: {
    id: 'mac.application:dataCollectionMaritalStatusTitle',
    defaultMessage: 'Hjúskaparstöðuvottorð',
    description: 'Marital Status',
  },
  dataCollectionMaritalStatusDescription: {
    id: 'mac.application:dataCollectionMaritalStatusDescription',
    defaultMessage: 'Vottorð um núverandi hjúskaparstöðu.',
    description: 'Marital Status',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'mac.application:dataCollectionNationalRegistryTitle',
    defaultMessage: 'Persónuupplýsingar',
    description: 'National registry title',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'mac.application:dataCollectionNationalRegistrySubtitle',
    defaultMessage: 'Fullt nafn, kennitala, heimilisfang.',
    description: 'National registry subtitle',
  },
  dataCollectionUserProfileTitle: {
    id: 'mac.application:dataCollectionUserProfileTitle',
    defaultMessage: 'Mínar síður á Ísland.is/stillingar',
    description: 'Your user profile information',
  },
  dataCollectionUserProfileSubtitle: {
    id: 'mac.application:dataCollectionUserProfileSubtitle',
    defaultMessage:
      'Ef þú ert með skráðar upplýsingar um síma og netfang inni á Mínar síður á Ísland.is þá verða þær sjálfkrafa settar inn í umsóknina.',
    description:
      'In order to apply for this application we need your email and phone number',
  },

  /* Information Section Marital Sides */
  informationTitle: {
    id: 'mac.application:informationSectionTitle',
    defaultMessage: 'Upplýsingar um hjónaefni',
    description: 'Information section title',
  },
  informationSectionTitle: {
    id: 'mac.application:informationTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Information title',
  },
  informationSubtitle: {
    id: 'mac.application:informationSectionSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
    description: 'Information section title',
  },
  informationSpouse1: {
    id: 'mac.application:informationSpouse1',
    defaultMessage: 'Hjónaefni 1',
    description: 'Information title spouse 1',
  },
  informationSpouse2: {
    id: 'mac.application:informationSpouse2',
    defaultMessage: 'Hjónaefni 2',
    description: 'Information title spouse 2',
  },
  informationAlertMessage: {
    id: 'mac.application:informationAlertMessage',
    defaultMessage:
      'Tilvonandi hjónaefni fær sendan tölvupóst til þess að samþykkja umsókn.',
    description: '',
  },
  informationMaritalSides: {
    id: 'mac.application:maritalSides',
    defaultMessage: 'Hjónaefni',
    description: 'marital sides',
  },
  informationMaritalSidesDescription: {
    id: 'mac.application:maritalSidesDescription',
    defaultMessage:
      'Undirritaðir svaramenn hjónaefna ábyrgjast að enginn lagatálmi sbr. II. og III. kafla laga nr. 31/1993 sé á fyrirhuguðum hjúskap þeirra.',
    description: 'marital sides',
  },
  informationWitnessTitle: {
    id: 'mac.application:',
    defaultMessage: 'Svaramenn',
    description: 'screen title',
  },
  informationWitness1: {
    id: 'mac.application:informationWitness1',
    defaultMessage: 'Svaramaður 1',
    description: 'Information title witness 1',
  },
  informationWitness2: {
    id: 'mac.application:informationWitness2',
    defaultMessage: 'Svaramaður 2',
    description: 'Information title witness 2',
  },

  /* Individuals info headers */
  nationalId: {
    id: 'mac.application:nationalId',
    defaultMessage: 'Kennitala',
    description: 'national id',
  },
  name: {
    id: 'mac.application:name',
    defaultMessage: 'Nafn',
    description: 'name',
  },
  phone: {
    id: 'mac.application:phone',
    defaultMessage: 'Símanúmer',
    description: 'phone',
  },
  email: {
    id: 'mac.application:email',
    defaultMessage: 'Netfang',
    description: 'email',
  },
  address: {
    id: 'mac.application:address',
    defaultMessage: 'Lögheimili',
    description: 'address',
  },
  citizenship: {
    id: 'mac.application:citizenship',
    defaultMessage: 'Ríkisfang',
    description: 'citizenship',
  },
  maritalStatus: {
    id: 'mac.application:maritalStatus',
    defaultMessage: 'Hjúskaparstaða fyrir vígslu',
    description: 'marital status',
  },
  previousMarriageTermination: {
    id: 'mac.application:previousMarriageTermination',
    defaultMessage: 'Hvernig lauk síðasta hjúskap?',
    description: 'previous marriage',
  },
  terminationByDivorce: {
    id: 'mac.application:terminationByDivorce',
    defaultMessage: 'Með lögskilnaði',
    description: '',
  },
  terminationByLosingSpouse: {
    id: 'mac.application:terminationByLosingSpouse',
    defaultMessage: 'Með láti maka',
    description: '',
  },
  terminationByAnnulment: {
    id: 'mac.application:terminationByAnnulment',
    defaultMessage: 'Með ógildingu',
    description: '',
  },
  personalInformationTitle: {
    id: 'mac.application:personalInformationTitle',
    defaultMessage: 'Persónuuplýsingar',
    description: 'personal info',
  },
  personalInformationDescription: {
    id: 'mac.application:personalInformationDescription',
    defaultMessage:
      'Veita þarf nánari persónuupplýsingar auk upplýsinga um hjúskaparstöðu fyrir vígslu. Hjónaefni ábyrgjast að þær upplýsingar sem eru gefnar séu réttar.',
    description: 'personal info',
  },
  ceremony: {
    id: 'mac.application:ceremony',
    defaultMessage: 'Vígsla',
    description: '',
  },
  ceremonyDescription: {
    id: 'mac.application:ceremonyDescription',
    defaultMessage:
      'Veita þarf nánari persónuupplýsingar auk upplýsinga um hjúskaparstöðu fyrir vígslu. Hjónaefni ábyrgjast að þær upplýsingar sem eru gefnar séu réttar.',
    description: '',
  },
  ceremonyDate: {
    id: 'mac.application:ceremonyDate',
    defaultMessage: 'Áætlaður vígsludagur',
    description: '',
  },
  ceremonyDatePlaceholder: {
    id: 'mac.application:ceremonyDatePlaceholder',
    defaultMessage: 'Skráðu inn dag',
    description: '',
  },
  ceremonyPlace: {
    id: 'mac.application:ceremonyPlace',
    defaultMessage: 'Hvar er vígsla áformuð?',
    description: '',
  },
  ceremonyAtDistrictsOffice: {
    id: 'mac.application:ceremonyAtDistrictsOffice',
    defaultMessage: 'Embætti sýslumanns',
    description: '',
  },
  ceremonyAtReligiousLifeViewingSociety: {
    id: 'mac.application:ceremonyAtReligiousLifeViewingSociety',
    defaultMessage: 'Trú- eða lífsskoðunarfélagi',
    description: '',
  },
  ceremonyChooseDistrict: {
    id: 'mac.application:ceremonyChooseDistrict',
    defaultMessage: 'Veldu embætti sýslumanns úr lista',
    description: '',
  },
  ceremonyChooseSociety: {
    id: 'mac.application:ceremonyChooseSociety',
    defaultMessage: 'Veldu trú- eða lífsskoðunarfélag úr lista',
    description: '',
  },

  /* Spouse confirmation screens */
  entrance: {
    id: 'mac.application:entrance',
    defaultMessage: 'Inngangur',
    description: '',
  },
  spouseIntroDescription: {
    id: 'mac.application:spouseIntroDescription',
    defaultMessage:
      '**{applicantsName}** sendi inn umsókn um könnun hjónavígsluskilyrða ykkar þann **{applicationDate}**. Til þess að halda áfram með ferlið þurfa bæði hjónaefni að senda frá sér persónuupplýsingar til samþykktar af Sýslumanni.',
    description: '',
  },
  spouseContinue: {
    id: 'mac.application:spouseContinue',
    defaultMessage: 'Ég vil halda áfram',
    description: '',
  },
  spouseDecline: {
    id: 'mac.application:spouseDecline',
    defaultMessage: 'Ég vil hafna þessari beiðni',
    description: '',
  },

  /* Payment */
  payment: {
    id: 'mac.application:payment',
    defaultMessage: 'Greiðsla',
    description: '',
  },
  maritalStatusCertificates: {
    id: 'mac.application:maritalStatusCertificates',
    defaultMessage: 'Tvö hjúskaparstöðuvottorð',
    description: '',
  },
  birthCertificates: {
    id: 'mac.application:birthCertificates',
    defaultMessage: 'Tvö fæðingarvottorð',
    description: '',
  },
  surveyCertificate: {
    id: 'mac.application:surveyCertificate',
    defaultMessage: 'Könnunarvottorð',
    description: '',
  },
  total: {
    id: 'mac.application:total',
    defaultMessage: 'Samtals',
    description: '',
  },
  proceedToPayment: {
    id: 'mac.application:proceedToPayment',
    defaultMessage: 'Áfram í greiðslu',
    description: '',
  },
  paymentPendingDescription: {
    id: 'mac.application:paymentPendingDescription',
    defaultMessage: 'Augnablik meðan beðið er eftir staðfestingu',
    description: 'Please wait until the payment is confirmed',
  },
  paymentSuccessExtraDocuments: {
    id: 'mac.application:paymentSuccessExtraDocuments',
    defaultMessage:
      'Ef beðið var um viðbótargögn (nýja ljósmynd eða læknisvottorð) þarf að skila þeim til Sýslumanns svo að fullnaðarskírteini fari í pöntun.',
    description:
      'If extra documents are required(new photograph or doctor certificate), you must return them to district commissioner so the driving license can be ordered.',
  },
  paymentSuccessIfNotReadyFewWeeks: {
    id: 'mac.application:paymentSuccessIfNotReadyFewWeeks',
    defaultMessage:
      'Ef svo var ekki þá verður fullnaðarskírteinið tilbúið á afhendingarstað eftir 3 til 4 vikur.',
    description:
      'If not then the driving license will be ready at the drop off location in 3 to 4 weeks.',
  },
  paymentApprovedContinue: {
    id: 'mac.application:paymentApprovedContinue',
    defaultMessage: `Greiðslan hefur verið staðfest, valið er 'Halda áfram' til að klára umsóknina.`,
    description:
      'The payment has been confirmed, choose "Continue" to finish the application.',
  },
  paymentImage: {
    id: 'mac.application:paymentImage',
    defaultMessage: `Skrautmynd`,
    description: 'Company Image',
  },
  examplePaymentPendingField: {
    id: 'mac.application:example.waitingForPayment',
    defaultMessage: 'Augnablik meðan beðið er eftir greiðslu',
    description: 'One moment while we wait for payment confirmation.',
  },
  examplePaymentPendingFieldError: {
    id: 'mac.application:example.waitingForPaymentError',
    defaultMessage: 'Villa kom upp við að sækja upplýsingar um greiðslu',
    description: 'An error came up while getting payment information',
  },
  submitErrorButtonCaption: {
    id: 'mac.application:submitErrorButtonCaption',
    defaultMessage: 'Reyna aftur',
    description:
      'Button that shows up when submitting the application fails, allowing you to retry',
  },
  submitErrorTitle: {
    id: 'mac.application:submitErrorTitle',
    defaultMessage: 'Móttaka umsóknar tókst ekki',
    description:
      'title that shows up when an error occurs while submitting the application',
  },
  submitErrorMessage: {
    id: 'mac.application:submitErrorMessage',
    defaultMessage:
      'Eitthvað fór úrskeiðis við að senda inn umsókn. Reyndu aftur síðar.',
    description:
      'Text that shows up when an error occurs while submitting the application',
  },
  forwardingToPayment: {
    id: 'mac.application:forwardingToPayment',
    defaultMessage: 'Sendi þig áfram á greiðsluveitu...',
    description: 'Forwarding you to payment handler...',
  },

  /* Overview */
  overview: {
    id: 'mac.application:overview',
    defaultMessage: 'Yfirlit',
    description: '',
  },
  applicationOverview: {
    id: 'mac.application:applicationOverview',
    defaultMessage: 'Yfirlit umsóknar',
    description: '',
  },
  overviewFooterText: {
    id: 'mac.application:overviewFooterText',
    defaultMessage:
      'Hjónaefni ábyrgjast hér með undirskrift sinni að upplýsingar gefnar af þeim eru réttar og lýsa yfir að viðlögðum drengskap að þau viti ekki um tálma á fyrirhuguðum hjúskap sínum, sbr. II. og III. kafla laga nr. 31/1993.',
    description: '',
  },

  /* Next steps for spouse 1 */
  nextStepsTitle: {
    id: 'mac.application:nextStepsTitle',
    defaultMessage: 'Umsókn send áfram á þinn maka',
    description: '',
  },
  nextStepsDescription: {
    id: 'mac.application:nextStepsDescription',
    defaultMessage:
      'Umsókn þín um könnun hjónavígsluskilyrða hefur nú verið send á þinn maka.',
    description: '',
  },
  nextSteps: {
    id: 'mac.application:nextSteps',
    defaultMessage: 'Næstu skref',
    description: '',
  },
  bullet1: {
    id: 'mac.application:bullet1',
    defaultMessage: ' þarf að fylla út sinn hluta umsóknarinnar.',
    description: '',
  },
  bullet2: {
    id: 'mac.application:bullet2',
    defaultMessage:
      'Ef maki þinn tekur ekki afstöðu til samningsins innan 60 daga þarf að hefja umsóknarferlið að nýju á Ísland.is.',
    description: '',
  },
  bullet3: {
    id: 'mac.application:bullet3',
    defaultMessage:
      'Könnunarvottorð frá sýslumanni gildir í 30 daga frá útgáfudegi.',
    description: '',
  },
  bullet4: {
    id: 'mac.application:bullet4',
    defaultMessage:
      'Könnunarvottorð verður sent í pósthólf ykkar beggja á island.is og þið berið ábyrgð á því að afhenda vígsluaðila vottorðið fyrir hjónavígsluna.',
    description: '',
  },
  copyLink: {
    id: 'mac.application:copyLink',
    defaultMessage: 'Afrita hlekk',
    description: '',
  },
  shareLink: {
    id: 'mac.application:shareLink',
    defaultMessage: 'Deila hlekk',
    description: '',
  },
  submitApplication: {
    id: 'mac.application:actionCard.submitApplication',
    defaultMessage: 'Senda inn umsókn',
    description: '',
  },
  errorDataProvider: {
    id: 'mac.application:error.dataProvider',
    defaultMessage: 'Úps! Eitthvað fór úrskeiðis við að sækja gögnin',
    description: 'Oops! Something went wrong when fetching your data',
  },
  errorDataProviderMaritalStatus: {
    id: 'mac.application:error.daterrorDataProviderMaritalStatusaProvider',
    defaultMessage:
      'Núverandi hjúskaparstaða þín leyfir þér ekki að halda áfram með þessa umsókn.',
    description: 'Oops! Something went wrong when fetching your data',
  },
  actionCardDoneTag: {
    id: 'mac.application:actionCard.done',
    defaultMessage: 'Móttekin',
    description: '',
  },
  applicationComplete: {
    id: 'mac.application:actionCard.applicationComplete',
    defaultMessage: 'Umsókn móttekin',
    description: '',
  },
  spouseDoneDescription: {
    id: 'mac.application:actionCard.spouseDoneDescription#markdown',
    defaultMessage:
      'Umsókn ykkar um könnun hjónavígsluskilyrða hefur verið send til rafrænnar undirritunar. Þegar bæði hjónaefni og svaramenn hafa undirritað rafrænt berst umsókn til sýslumanns. Sýslumaður gefur út í kjölfarið könnunarvottorð. Þið eruð nú einu skrefi nær því að ganga í hjónaband.',
    description: '',
  },
  spouseNextSteps: {
    id: 'mac.application:actionCard.spouseNextSteps#markdown',
    defaultMessage:
      'Umsókn ykkar um könnun hjónavígsluskilyrða hefur verið send til rafrænnar undirritunar. Þegar bæði hjónaefni og svaramenn hafa undirritað rafrænt berst umsókn til sýslumanns. Sýslumaður gefur út í kjölfarið könnunarvottorð. Þið eruð nú einu skrefi nær því að ganga í hjónaband.',
    description: '',
  },
  nameError: {
    id: 'mac.application:nameError',
    defaultMessage: 'Tókst ekki að sækja nafn út frá þessari kennitölu.',
    description: '',
  },
})
