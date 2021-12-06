import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationQualityPhotoTitle: {
    id: 'dl.application:applicationQualityPhotoTitle',
    defaultMessage: 'Ljósmynd',
    description: 'title for quality photo section',
  },
  qualityPhotoTitle: {
    id: 'dl.application:qualityPhotoTitle',
    defaultMessage: 'Ljósmynd í ökuskírteinaskrá',
    description: 'title for quality photo section',
  },
  qualityPhotoAltText: {
    id: 'dl.application:qualityPhotoAltText',
    defaultMessage: 'Þín mynd skv. ökuskírteinaskrá',
    description: `Alt text for the user's quality photo`,
  },
  qualityPhotoSubTitle: {
    id: 'dl.application:qualityPhotoSubTitle',
    defaultMessage: 'Hér er núverandi ljósmynd í ökuskírteinaskrá',
    description: 'sub title for quality photo section',
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
  qualityPhotoAcknowledgement: {
    id: 'dl.application:qualityPhoto.acknowledgement',
    defaultMessage: 'Ég kem með nýja ljósmynd til sýslumanns',
    description: 'I will bring a new photo',
  },
  qualityPhotoNoAcknowledgement: {
    id: 'dl.application:qualityPhoto.noacknowledgement',
    defaultMessage: 'Ég staðfesti að nota núverandi mynd',
    description: 'I want to use current photo',
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
  qualityPhotoInstructionsBulletSix: {
    id: 'dl.application:qualityPhoto.instructionsbulletsix',
    defaultMessage: `
    Ljósmyndin þarf að vera prentuð á ljósmyndapappír og 35x45mm að stærð.
    `,
    description: 'Description of photo requirements',
  },
  congratulationsHelpText: {
    id: 'dl.application:congratulationsHelpText',
    defaultMessage:
      'Umsókn þín um P-Merki hefur verið móttekin. Þú færð P-Merkið afhent á uppgefið heimilisfang eftir 3-4 virka daga.',
    description: 'Your application for a P-sign has been received.',
  },
  congratulationsTitleSuccess: {
    id: 'dl.application:congratulationsTitleSuccess',
    defaultMessage:
      'Umsókn þín um P-Merki hefur verið móttekin. Þú færð P-Merkið afhent á uppgefið heimilisfang eftir 3-4 virka daga.',
    description: 'Your application for full driving license was successful.',
  },
  congratulationsTitle: {
    id: 'dl.application:congratulationsTitle',
    defaultMessage: 'Til hamingju',
    description: 'Congratulations',
  },
  congratulationsCertificateTitle: {
    id: 'dl.application:congratulationsCertificateTitle',
    defaultMessage: 'Læknisvottorð',
    description: 'Health Certificate',
  },
  congratulationsQualityPictureTitle: {
    id: 'dl.application:congratulationsQualityPictureTitle',
    defaultMessage: 'Passamynd',
    description: 'Quality photo',
  },
  congratulationsCertificateDescription: {
    id: 'dl.application:congratulationsCertificateDescription',
    defaultMessage:
      'Þörf er á læknisvottorði frá heimilislækni miðað við útfyllta heilbrigðisyfirlýsingu. Læknisvottorði þarf að skila til sýslumannsembættis. Þegar því hefur verið skilað og aðrar kröfur uppfylltar fer skírteinið í pöntunarferli.',
    description: 'Health Certificate',
  },
  congratulationsQualityPictureDescription: {
    id: 'dl.application:congratulationsQualityPictureDescription',
    defaultMessage:
      'Skila þarf passamynd til sýslumanns. Þegar því hefur verið skilað og aðrar kröfur uppfylltar fer skírteinið í pöntunarferli.',
    description: 'Quality photo',
  },
  errorDataProvider: {
    id: 'dl.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
})
