import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationTitle: {
    id: 'dl.application:applicationTitle',
    defaultMessage: 'Umsókn um P-Merki',
    description: 'Application for P-Sign',
  },
  /* Data Collection Section */
  dataCollectionTitle: {
    id: 'dl.application:applicationDataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Title for data collection section',
  },
  dataCollectionSubtitle: {
    id: 'dl.application:dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki',
    description: 'Subtitle for data collection section',
  },
  dataCollectionDescription: {
    id: 'dl.application:dataCollectionDescription',
    defaultMessage:
      'Svo hægt sé að afgreiða umsókn þína um stæðiskort, þarf að sækja eftirfarandi gögn með þínu samþykki.',
    description: 'Description for data collection section',
  },
  dataCollectionCheckboxLabel: {
    id: 'dl.application:dataCollectionCheckboxLabel',
    defaultMessage: 'Ég samþykki að láta sækja gögn',
    description: 'Checkbox label for data collection section',
  },
  dataCollectionDoctorsNoteTitle: {
    id: 'dl.application:dataCollectionDoctorsNoteTitle',
    defaultMessage: 'Læknisvottorð vegna umsóknar um stæðiskort',
    description: 'Doctors note title',
  },
  dataCollectionDoctorsNoteSubtitle: {
    id: 'dl.application:dataCollectionDoctorsNoteLabel',
    defaultMessage:
      'Rafrænt læknisvottorð frá heimilislækni, þar sem tilgreindur er gildistími stæðiskorts.',
    description: 'Doctors note subtitle',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'dl.application:dataCollectionNationalRegistryTitle',
    defaultMessage: 'Uppfletting í Þjóðskrá',
    description: 'National registry title',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'dl.application:dataCollectionNationalRegistrySubtitle',
    defaultMessage: 'Fullt nafn, kennitala, heimilisfang.',
    description: 'National registry subtitle',
  },
  dataCollectionQualityPhotoTitle: {
    id: 'dl.application:dataCollectionQualityPhotoTitle',
    defaultMessage: 'Upplýsingar úr ökuskírteinaskrá (ef við á)',
    description: 'Info from drivers license',
  },
  dataCollectionQualityPhotoSubtitle: {
    id: 'dl.application:dataCollectionQualityPhotoSubtitle',
    defaultMessage: 'Mynd er sótt úr ökuskírteinakerfi.',
    description: 'National registry subtitle',
  },
  dataCollectionUserProfileTitle: {
    id: 'cr.application:dataCollectionUserProfileTitle',
    defaultMessage: 'Mínar síður á Ísland.is/stillingar',
    description: 'Your user profile information',
  },
  dataCollectionUserProfileSubtitle: {
    id: 'cr.application:dataCollectionUserProfileSubtitle',
    defaultMessage:
      'Ef þú ert með skráaðar upplýsingar um síma og netfang á Mínum Síðum inná Ísland.is kemur það sjálfkrafa í umsókn þína.',
    description:
      'In order to apply for this application we need your email and phone number',
  },

  /* Information Section */
  informationTitle: {
    id: 'dl.application:informationSectionTitle',
    defaultMessage:
      'Persónuupplýsingar umsækjanda, vegna umsóknar um stæðiskort',
    description: 'Information section title',
  },
  informationSectionTitle: {
    id: 'dl.application:informationTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Information title',
  },

  /* Applicant - used in information and overview sections */
  applicantsName: {
    id: 'dl.application:applicantsName',
    defaultMessage: 'Nafn',
    description: 'Name label',
  },
  applicantsNationalId: {
    id: 'dl.application:applicantsNationalId',
    defaultMessage: 'Kennitala',
    description: 'National id label',
  },
  applicantsAddress: {
    id: 'dl.application:applicantsAddress',
    defaultMessage: 'Heimilisfang',
    description: 'Address label',
  },
  applicantsCity: {
    id: 'dl.application:applicantsCity',
    defaultMessage: 'Staður',
    description: 'City label',
  },
  applicantsEmail: {
    id: 'dl.application:applicantsEmail',
    defaultMessage: 'Netfang',
    description: 'Email label',
  },
  applicantsPhoneNumber: {
    id: 'dl.application:applicantsPhoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Phone number label',
  },
  cardValidityPeriod: {
    id: 'dl.application:cardValidityPeriod',
    defaultMessage: 'Gildistími',
    description: 'Card validity label',
  },

  /* Quality Photo Section */
  qualityPhotoTitle: {
    id: 'dl.application:qualityPhotoSectionTitle',
    defaultMessage: 'Mynd í stæðiskort',
    description: 'Title for quality photo section',
  },
  qualityPhotoSectionTitle: {
    id: 'dl.application:qualityPhotoSectionTitle',
    defaultMessage: 'Mynd',
    description: 'Title for quality photo section',
  },
  qualityPhotoExistingPhotoText: {
    id: 'dl.application:qualityPhotoExistingPhotoText',
    defaultMessage:
      'Hér er núverandi mynd úr ökuskírteinaskrá. Hægt er að nota hana eða hlaða inn nýrri mynd með tilgreindum skilyrðum hér fyrir neðan.',
    description: `Text for the user's existing quality photo`,
  },
  qualityPhotoUseExistingPhoto: {
    id: 'dl.application:qualityPhotoUseExistingPhoto',
    defaultMessage: 'Nota núverandi mynd',
    description: `Text for the user's existing quality photo`,
  },
  qualityPhotoUploadNewPhoto: {
    id: 'dl.application:qualityPhotoUploadNewPhoto',
    defaultMessage: 'Hlaða inn mynd',
    description: `Text for uploading a new photo`,
  },
  qualityPhotoFileUploadTitle: {
    id: 'dl.application:qualityPhotoFileUploadTitle',
    defaultMessage: 'Dragðu mynd hingað til að hlaða upp',
    description: `Title for file upload`,
  },
  qualityPhotoFileUploadDescription: {
    id: 'dl.application:qualityPhotoFileUploadDescription',
    defaultMessage: 'Tekið er við mynd með endingu: .jpeg, .png, .jpg',
    description: `Description for file upload`,
  },
  qualityPhotoUploadButtonLabel: {
    id: 'dl.application:qualityPhotoUploadButtonLabel',
    defaultMessage: 'Velja mynd til að hlaða upp',
    description: `Upload button label`,
  },
  qualityPhotoNoPhotoDescription: {
    id: 'dl.application:qualityPhotoNoPhotoDescription',
    defaultMessage:
      'Til að hlaða inn mynd fyrir stæðiskort, þarf hún að fylla upp eftirfarandi skilyrði:',
    description: `Description text for no existing photo`,
  },
  qualityPhotoAltText: {
    id: 'dl.application:qualityPhotoAltText',
    defaultMessage: 'Þín mynd skv. ökuskírteinaskrá',
    description: `Alt text for the user's quality photo`,
  },
  qualityPhotoWarningTitle: {
    id: 'dl.application:qualityPhotoWarningTitle',
    defaultMessage: 'Ljósmynd í ökuskírteinaskrá ekki gæðamerkt',
    description: 'title for quality photo warning',
  },
  qualityPhotoWarningDescription: {
    id: 'dl.application:qualityPhotoWarningDescription',
    defaultMessage:
      'Núverandi ljósmynd þín í ökuskírteinaskrá stenst ekki gæðakröfur og þarf því að koma með nýja ljósmynd.',
    description: 'Description for quality photo warning',
  },
  qualityPhotoInstructions: {
    id: 'dl.application:qualityPhoto.instructions',
    defaultMessage: `
    Ljósmynd af umsækjanda þarf að vera tekin beint að framan, hún þarf að sýna höfuð (án höfuðfats)
    og herðar þar sem lýsing andlits er jöfn. Athuga þarf að ekki glampi á gleraugu og skyggi
    á augu. Bakgrunnur þarf að vera ljós og ekki virka truflandi á myndefni.
    Ljósmyndin þarf að vera prentuð á ljósmyndapappír og 35x45mm að stærð.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletOne: {
    id: 'dl.application:qualityPhoto.instructionsbulletone',
    defaultMessage: `
    Ljósmynd af umsækjanda þarf að vera tekin beint að framan.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletTwo: {
    id: 'dl.application:qualityPhoto.instructionsbullettwo',
    defaultMessage: `
    Sýna þarf höfuð (án höfuðfats) og herðar.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletThree: {
    id: 'dl.application:qualityPhoto.instructionsbulletthree',
    defaultMessage: `
    Lýsing andlits þarf að vera jöfn.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletFour: {
    id: 'dl.application:qualityPhoto.instructionsbulletfour',
    defaultMessage: `
    Athuga þarf að ekki glampi á gleraugu og skyggi á augu.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoInstructionsBulletFive: {
    id: 'dl.application:qualityPhoto.instructionsbulletfive',
    defaultMessage: `
    Bakgrunnur þarf að vera ljós og ekki virka truflandi á myndefni.
    `,
    description: 'Description of photo requirements',
  },
  qualityPhotoNoPhotoAlertMessage: {
    id: 'dl.application:qualityPhoto.qualityPhotoNoPhotoAlertMessage',
    defaultMessage: 'Ath. Skylda er að hlaða inn mynd',
    description: 'Alert on no photo attachment',
  },

  /* Delivery method Section */
  deliveryMethodTitle: {
    id: 'dl.application:deliveryMethodTitle',
    defaultMessage: 'Afhending',
    description: 'Title for delivery method section',
  },
  deliveryMethodDescription: {
    id: 'dl.application:deliveryMethodDescription',
    defaultMessage:
      'Stæðiskort er sjálfkrafa sent með pósti á lögheimili eftir 3-5 virka daga frá umsóknardegi. Umsækjandi getur einnig valið að sækja stæðiskort á hvaða sýslumannsembætti sem er á landinu.',
    description: 'Description for delivery method section',
  },
  deliveryMethodHomeDelivery: {
    id: 'dl.application:deliveryMethodHomeDelivery',
    defaultMessage: 'Fá sent heim í pósti',
    description: 'Checkbox label for home delivery method',
  },
  deliveryMethodPickUp: {
    id: 'dl.application:deliveryMethodPickUp',
    defaultMessage: 'Sækja til Sýslumanns',
    description: 'Checkbox label for self-pickup',
  },
  deliveryMethodOfficeLabel: {
    id: 'dl.application:deliveryMethodOfficeLabel',
    defaultMessage: 'Embætti',
    description: 'Title for office',
  },
  deliveryMethodOfficeSelectPlaceholder: {
    id: 'dl.application:deliveryMethodOfficeSelectPlaceholder',
    defaultMessage: 'Veldu embætti',
    description: 'Placeholder for office selection',
  },

  /* Overview Section */
  overviewTitle: {
    id: 'dl.application:overviewTitle',
    defaultMessage: 'Yfirlit umsóknar',
    description: 'Title for overview section',
  },
  overviewSectionTitle: {
    id: 'dl.application:overviewTitle',
    defaultMessage: 'Yfirlit',
    description: 'Title for overview section',
  },
  overviewSectionDescription: {
    id: 'dl.application:overviewSectionDescription',
    defaultMessage:
      'Vinsamlegast staðfestu að neðangreindar upplýsingar séu réttar.,',
    description: 'Description for overview section',
  },
  overviewSelfPickupText: {
    id: 'dl.application:overviewSelfPickupText',
    defaultMessage: 'Þú hefur valið að sækja P-merkið sjálf/ur/t á: ',
    description: 'Text for delivery info',
  },
  overviewDeliveryText: {
    id: 'dl.application:overviewDeliveryText',
    defaultMessage: 'Þú hefur valið að fá P-merkið sent heim í pósti',
    description: 'Text for delivery info',
  },

  /* Congratulation Section */
  congratulationsTitleSuccess: {
    id: 'dl.application:congratulationsTitleSuccess',
    defaultMessage:
      'Umsókn þín um P-Merki hefur verið móttekin. Þú færð P-Merkið afhent á uppgefið heimilisfang eftir 3-4 virka daga.',
    description: 'Your application for P-sign was successful.',
  },
  congratulationsTitle: {
    id: 'dl.application:congratulationsTitle',
    defaultMessage: 'Til hamingju',
    description: 'Congratulations',
  },
  errorDataProvider: {
    id: 'dl.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
})
