import { defineMessages } from 'react-intl'
export const applicationForMessages = {
  NONE: defineMessages({
    title: {
      id: 'dl.application:shared.none',
      defaultMessage: 'Engin ökuréttindi',
      description: 'no license',
    },
    rightsDescription: {
      id: 'dl.application:shared.none.rightDescription',
      defaultMessage: 'Umsækjandi hefur engin ökuréttindi.',
      description: 'No license rights description',
    },
  }),
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
    applicationDescription: {
      id: 'dl.application:shared.temp.applicationDescription',
      defaultMessage:
        'Umsókn um almenn ökuréttindi í B flokki (fólksbifreið). Fyrsta ökuskírteinið er bráðabirgðaskírteini sem gildir í 3 ár.',
      description: 'Temp license application description',
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
    applicationDescription: {
      id: 'dl.application:shared.full.applicationDescription',
      defaultMessage:
        'Ef ökumaður hefur haft bráðabirgðaskírteini í að minnsta kosti ár og farið í akstursmat með ökukennara getur hann sótt um fullnaðarskírteini.',
      description: 'full license application description',
    },
  }),
  B_RENEW: defineMessages({
    title: {
      id: 'dl.application:shared.renewFull',
      defaultMessage: 'Endurnýjun fullnaðarréttinda',
      description: 'B-renew',
    },
    applicationDescription: {
      id: 'dl.application:shared.renewFull.applicationDescription',
      defaultMessage:
        'Ef ökumaður hefur fullnaðarréttindi sem eru útrunnin eða renna út innan við 6 mánaða er hægt að sækja um endurnýjun.',
      description: 'renewFull license application description',
    },
  }),
}

export const m = defineMessages({
  applicationTitle: {
    id: 'dld.application:applicationTitle',
    defaultMessage: 'Umsókn um Stæðiskort',
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
    id: 'dld.application:informationSectionSubtitle',
    defaultMessage:
      'Hér fyrir neðan eru  upplýsingar um þig og þín ökuréttindi, sem koma fram á ökuskírteini þínu.',
    description: 'Information section title',
  },
  informationTitle: {
    id: 'dld.application:informationTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Information title',
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
  applicantsAddress: {
    id: 'dld.application:applicantsAddress',
    defaultMessage: 'Heimilisfang',
    description: 'Address label',
  },
  applicantsCity: {
    id: 'dld.application:applicantsCity',
    defaultMessage: 'Staður',
    description: 'City label',
  },
  applicantsEmail: {
    id: 'dld.application:applicantsEmail',
    defaultMessage: 'Netfang',
    description: 'Email label',
  },
  applicantsPhoneNumber: {
    id: 'dld.application:applicantsPhoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Phone number label',
  },
  applicantsActorEmail: {
    id: 'dld.application:applicantsEmail',
    defaultMessage: 'Netfang forráðamanns',
    description: 'Email label',
  },
  applicantsActorPhoneNumber: {
    id: 'dld.application:applicantsPhoneNumber',
    defaultMessage: 'Símanúmer forráðamanns',
    description: 'Phone number label',
  },
  cardValidityPeriod: {
    id: 'dld.application:cardValidityPeriod',
    defaultMessage: 'Gildistími',
    description: 'Card validity label',
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
  deliveryMethodTitle: {
    id: 'dld.application:deliveryMethodTitle',
    defaultMessage: 'Afhending',
    description: 'Title for delivery method section',
  },
  deliveryMethodDescription: {
    id: 'dld.application:deliveryMethodDescription',
    defaultMessage:
      'Þú getur valið að fá stæðiskortið sent með pósti á lögheimili þitt eftir 3 til 5 virka daga eða sótt það hjá næsta sýslumannsembætti.',
    description: 'Description for delivery method section',
  },
  deliveryMethodHomeDelivery: {
    id: 'dld.application:deliveryMethodHomeDelivery',
    defaultMessage: 'Fá sent í pósti',
    description: 'Checkbox label for home delivery method',
  },
  deliveryMethodPickUp: {
    id: 'dld.application:deliveryMethodPickUp',
    defaultMessage: 'Sækja til Sýslumanns',
    description: 'Checkbox label for self-pickup',
  },
  deliveryMethodOfficeLabel: {
    id: 'dld.application:deliveryMethodOfficeLabel',
    defaultMessage: 'Embætti',
    description: 'Title for office',
  },
  deliveryMethodOfficeSelectPlaceholder: {
    id: 'dld.application:deliveryMethodOfficeSelectPlaceholder',
    defaultMessage: 'Veldu embætti',
    description: 'Placeholder for office selection',
  },

  /* Overview Section */
  overviewTitle: {
    id: 'dld.application:overviewTitle',
    defaultMessage: 'Yfirlit',
    description: 'Title for overview section',
  },
  overviewSectionTitle: {
    id: 'dld.application:overviewTitle',
    defaultMessage: 'Yfirlit',
    description: 'Title for overview section',
  },
  overviewSectionDescription: {
    id: 'dld.application:overviewSectionDescription',
    defaultMessage:
      'Vinsamlegast lestu yfir umsóknina og vertu viss um að allar upplýsingar séu rétt uppgefnar. Að loknum yfirlestri getur þú sent inn umsóknina.',
    description: 'Description for overview section',
  },
  overviewSelfPickupText: {
    id: 'dld.application:overviewSelfPickupText',
    defaultMessage: 'Þú hefur valið að sækja stæðiskortið sjálf/ur/t á: ',
    description: 'Text for delivery info',
  },
  overviewDeliveryText: {
    id: 'dld.application:overviewDeliveryText',
    defaultMessage: 'Þú hefur valið að fá stæðiskortið sent heim í pósti',
    description: 'Text for delivery info',
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
