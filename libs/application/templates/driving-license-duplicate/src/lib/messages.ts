import { defineMessages } from 'react-intl'
export const applicationForMessages = {
  B_TEMP: defineMessages({
    title: {
      id: 'dl.application:shared.temp',
      defaultMessage: 'Almenn ökuréttindi',
      description: 'B-temp',
    },
    rightsDescription: {
      id: 'dl.application:shared.temp.rightDescription',
      defaultMessage: 'B flokki (fólksbifreið)',
      description: 'Temp license rights description',
    },
  }),
  B_FULL: defineMessages({
    title: {
      id: 'dl.application:shared.full',
      defaultMessage: 'Fullnaðarréttindi',
      description: 'B-full',
    },
    rightsDescription: {
      id: 'dl.application:shared.full.rightDescription',
      defaultMessage: 'B flokki (fólksbifreið)',
      description: 'Full license rights description',
    },
  }),
}

export const m = defineMessages({
  applicationTitle: {
    id: 'dld.application:applicationTitle',
    defaultMessage: 'Umsókn um samrit',
    description: 'Application for P-Sign',
  },
  /* Data Collection Section */
  dataCollectionTitle: {
    id: 'dld.application:applicationDataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Title for data collection section',
  },
  dataCollectionSubtitle: {
    id: 'dld.application:dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'Subtitle for data collection section',
  },
  dataCollectionDescription: {
    id: 'dld.application:dataCollectionDescription',
    defaultMessage:
      'Til þess að geta hafið umsókn þína fyrir stæðiskort þarf að sækja eftirfarandi gögn',
    description: 'Description for data collection section',
  },
  dataCollectionCheckboxLabel: {
    id: 'dld.application:dataCollectionCheckboxLabel',
    defaultMessage: 'Ég samþykki að láta sækja gögn',
    description: 'Checkbox label for data collection section',
  },
  dataCollectionDoctorsNoteTitle: {
    id: 'dld.application:dataCollectionDoctorsNoteTitle',
    defaultMessage: 'Læknisvottorð vegna umsóknar um stæðiskort',
    description: 'Doctors note title',
  },
  dataCollectionDoctorsNoteSubtitle: {
    id: 'dld.application:dataCollectionDoctorsNoteLabel',
    defaultMessage:
      'Rafrænt læknisvottorð frá heimilislækni þar sem tilgreindur er gildistími stæðiskorts.',
    description: 'Doctors note subtitle',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'dld.application:dataCollectionNationalRegistryTitle',
    defaultMessage: 'Persónuupplýsingar',
    description: 'National registry title',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'dld.application:dataCollectionNationalRegistrySubtitle',
    defaultMessage: 'Fullt nafn, kennitala, heimilisfang.',
    description: 'National registry subtitle',
  },
  dataCollectionQualityPhotoTitle: {
    id: 'dld.application:dataCollectionQualityPhotoTitle',
    defaultMessage: 'Ökuskírteini (ef til staðar)',
    description: 'Info from drivers license',
  },
  dataCollectionQualityPhotoSubtitle: {
    id: 'dld.application:dataCollectionQualityPhotoSubtitle',
    defaultMessage: 'Mynd úr ökuskírteinakerfi hjá Samgöngustofu.',
    description: 'National registry subtitle',
  },
  dataCollectionUserProfileTitle: {
    id: 'cr.application:dataCollectionUserProfileTitle',
    defaultMessage: 'Mínar síður á Ísland.is/stillingar',
    description: 'Your user profile information',
  },
  dataCollectionUserProfileSubtitle: {
    id: 'dld.application:dataCollectionUserProfileSubtitle',
    defaultMessage:
      'Ef þú ert með skráðar upplýsingar um síma og netfang inni á Mínar síður á Ísland.is þá verða þær sjálfkrafa settar inn í umsóknina.',
    description:
      'In order to apply for this application we need your email and phone number',
  },

  /* Information Section */
  informationSubtitle: {
    id: 'dld.application:information.sectionSubtitle',
    defaultMessage:
      'Hér fyrir neðan eru  upplýsingar um þig og þín ökuréttindi, sem koma fram á ökuskírteini þínu.',
    description: 'Information section title',
  },
  informationTitle: {
    id: 'dld.application:information.title',
    defaultMessage: 'Upplýsingar',
    description: 'Information title',
  },
  validTag: {
    id: 'dld.application:information.validTag',
    defaultMessage: 'Gildir til ',
    description: 'Some description',
  },
  rights: {
    id: 'dld.application:information.rights',
    defaultMessage: 'Ökuréttindi',
    description: 'Some description',
  },
  signatureAndImageAlert: {
    id: 'dld.application:information.signatureAndImageAlert',
    defaultMessage:
      'Ef þú þarft að uppfæra mynd eða undirskrift að þá þarft þú að fara til Sýslumanns til þess að gera það.',
    description: 'Some description',
  },
  signatureAndImage: {
    id: 'dld.application:information.signatureAndImage',
    defaultMessage: 'Undirskrift og mynd',
    description: 'Some description',
  },
  signature: {
    id: 'dld.application:information.signature',
    defaultMessage: 'Undirskrift á skrá',
    description: 'Some description',
  },
  image: {
    id: 'dld.application:information.Mynd',
    defaultMessage: 'Mynd á skrá',
    description: 'Some description',
  },

  /* Applicant - used in information and overview sections */
  applicantsName: {
    id: 'dld.application:applicantsName',
    defaultMessage: 'Nafn',
    description: 'Name label',
  },
  applicantsNationalId: {
    id: 'dld.application:applicantsNationalId',
    defaultMessage: 'Kennitala',
    description: 'National id label',
  },

  /* Quality Photo Section */
  qualityPhotoTitle: {
    id: 'dld.application:qualityPhotoSectionTitle',
    defaultMessage: 'Mynd',
    description: 'Title for quality photo section',
  },
  qualityPhotoSectionTitle: {
    id: 'dld.application:qualityPhotoSectionTitle',
    defaultMessage: 'Mynd',
    description: 'Title for quality photo section',
  },
  qualityPhotoExistingPhotoText: {
    id: 'dld.application:qualityPhotoExistingPhotoText',
    defaultMessage:
      'Hér er núverandi mynd úr ökuskírteinaskrá. Hægt er að nota hana eða hlaða inn nýrri mynd með tilgreindum skilyrðum hér fyrir neðan.',
    description: `Text for the user's existing quality photo`,
  },
  qualityPhotoUseExistingPhoto: {
    id: 'dld.application:qualityPhotoUseExistingPhoto',
    defaultMessage: 'Nota núverandi mynd',
    description: `Text for the user's existing quality photo`,
  },
  qualityPhotoUploadNewPhoto: {
    id: 'dld.application:qualityPhotoUploadNewPhoto',
    defaultMessage: 'Hlaða inn mynd',
    description: `Text for uploading a new photo`,
  },
  qualityPhotoFileUploadTitle: {
    id: 'dld.application:qualityPhotoFileUploadTitle',
    defaultMessage: 'Dragðu mynd hingað til að hlaða upp',
    description: `Title for file upload`,
  },
  qualityPhotoFileUploadDescription: {
    id: 'dld.application:qualityPhotoFileUploadDescription',
    defaultMessage: 'Tekið er við mynd með endingu: .jpeg, .png, .jpg',
    description: `Description for file upload`,
  },
  qualityPhotoUploadButtonLabel: {
    id: 'dld.application:qualityPhotoUploadButtonLabel',
    defaultMessage: 'Velja mynd til að hlaða upp',
    description: `Upload button label`,
  },
  qualityPhotoNoPhotoDescription: {
    id: 'dld.application:qualityPhotoNoPhotoDescription',
    defaultMessage:
      'Til að hlaða inn mynd fyrir stæðiskort, þarf hún að fylla upp eftirfarandi skilyrði:',
    description: `Description text for no existing photo`,
  },
  qualityPhotoAltText: {
    id: 'dld.application:qualityPhotoAltText',
    defaultMessage: 'Þín mynd skv. ökuskírteinaskrá',
    description: `Alt text for the user's quality photo`,
  },
  qualityPhotoInstructionsBulletOne: {
    id: 'dld.application:qualityPhoto.instructionsbulletone',
    defaultMessage: `
    Ljósmynd af umsækjanda þarf að vera tekin beint að framan.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletTwo: {
    id: 'dld.application:qualityPhoto.instructionsbullettwo',
    defaultMessage: `
    Sýna þarf höfuð (án höfuðfats) og herðar.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletThree: {
    id: 'dld.application:qualityPhoto.instructionsbulletthree',
    defaultMessage: `
    Lýsing andlits þarf að vera jöfn.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletFour: {
    id: 'dld.application:qualityPhoto.instructionsbulletfour',
    defaultMessage: `
    Hvorki má glampa á gleraugu né skyggja á augu.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletFive: {
    id: 'dld.application:qualityPhoto.instructionsbulletfive',
    defaultMessage: `
    Bakgrunnur þarf að vera einfaldur og ljós á litinn.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoNoPhotoAlertMessage: {
    id: 'dld.application:qualityPhoto.qualityPhotoNoPhotoAlertMessage',
    defaultMessage: 'Ath. Skylda er að hlaða inn mynd',
    description: 'Alert on no photo attachment',
  },

  /* Delivery method Section */
  deliveryMethodSectionTitle: {
    id: 'dld.application:deliveryMethodSectionTitle',
    defaultMessage: 'Afhending',
    description: 'Title for delivery method section',
  },
  deliveryMethodTitle: {
    id: 'dld.application:deliveryMethodTitle',
    defaultMessage: 'Afhendingarstaður',
    description: 'Title for delivery method section',
  },
  deliveryMethodDescription: {
    id: 'dld.application:deliveryMethodDescription',
    defaultMessage:
      'Fljótlegast er að sækja samrit hjá Þjóðskrá Íslands í Borgartúni 21, 105 Reykjavík. Á öðrum afhendingarstöðum getur afhending tekið allt að 6 til 10 daga. Sjá afgreiðslutíma.',
    description: 'Description for delivery method section',
  },
  deliveryMethodOfficeLabel: {
    id: 'dld.application:deliveryMethodOfficeLabel',
    defaultMessage: 'Afhendingarstaður',
    description: 'Title for office',
  },
  deliveryMethodOfficeSelectPlaceholder: {
    id: 'dld.application:deliveryMethodOfficeSelectPlaceholder',
    defaultMessage: 'Veldu afhendingarstað',
    description: 'Placeholder for office selection',
  },

  /* Overview Section */
  overviewTitle: {
    id: 'dld.application:overview.title',
    defaultMessage: 'Yfirlit umsóknar',
    description: 'Title for overview section',
  },
  overviewSectionTitle: {
    id: 'dld.application:overview.sectionTitle',
    defaultMessage: 'Yfirlit',
    description: 'Title for overview section',
  },
  overviewSectionDescription: {
    id: 'dld.application:overview.sectionDescription',
    defaultMessage:
      'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
    description: 'Description for overview section',
  },
  overviewLicenseExpires: {
    id: 'dld.application:overview.licenseExpires',
    defaultMessage: 'Gildistími ökuskírteinis',
    description: 'Some description',
  },

  /* Congratulation Section */
  congratulationsTitleSuccess: {
    id: 'dld.application:congratulationsTitleSuccess',
    defaultMessage:
      'Umsókn þín um stæðiskort hefur verið móttekin. Þú færð stæðiskortið afhent eftir 3-5 virka daga.',
    description: 'Your application for P-sign was successful.',
  },
  congratulationsTitle: {
    id: 'dld.application:congratulationsTitle',
    defaultMessage: 'Til hamingju',
    description: 'Congratulations',
  },
  errorDataProvider: {
    id: 'dld.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },

  /* Validation Error */
  missingAttachmentValidationError: {
    id: 'dld.application:error.missingAttachment',
    defaultMessage: 'Vinsamlegast veldu mynd til að hlaða inn',
    description: 'Validation error for attachment',
  },
  missingDistrictValidationError: {
    id: 'dld.application:error.missingAttachment',
    defaultMessage: 'Vinsamlegast veldu embætti',
    description: 'Validation error for district',
  },
})
