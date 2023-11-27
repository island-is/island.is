import { defineMessages } from 'react-intl'
export const m = defineMessages({
  applicationTitle: {
    id: 'dld.application:applicationTitle',
    defaultMessage: 'Samrit ökuskírteinis',
    description: 'Application for driving license duplicate title',
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
    defaultMessage: 'Upplýsingar úr Ökuskírteinaskrá',
    description: 'Info from drivers license',
  },
  dataCollectionQualityPhotoSubtitle: {
    id: 'dld.application:dataCollectionQualityPhotoSubtitle',
    defaultMessage:
      'Sóttar eru almennar upplýsingar um núverandi réttindi, sviptingar, punktastöðu og akstursmat ef við á.',
    description: 'Info from drivers license subtitle',
  },
  dataCollectionUserProfileTitle: {
    id: 'dld.application:dataCollectionUserProfileTitle',
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
      'Hér fyrir neðan eru upplýsingar um þig og þín ökuréttindi, sem koma fram á ökuskírteini þínu.',
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
      'Ef þú þarft að uppfæra mynd eða undirskrift, þá þarft þú að fara til Sýslumanns til þess að gera það.',
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

  /* rejected Section */
  rejected: {
    id: 'dld.application:rejected',
    defaultMessage: 'Hafnað',
    description: 'rejected title',
  },
  rejectedSubtitle: {
    id: 'dld.application:rejected.sectionSubtitle',
    defaultMessage:
      'Þú hefur því miður ekkert til að sækja um. Hér fyrir neðan getur þú séð hvaða ökuréttindi þú ert með og hvað það er sem þig vantar til að geta haldið áfram umsókn þinni. ',
    description: 'rejected section title',
  },
  rejectedTitle: {
    id: 'dld.application:rejected.title',
    defaultMessage: 'Þú hefur ekkert til að sækja um',
    description: 'rejected title',
  },
  requirementsTitle: {
    id: 'dld.application:rejected.requirementsTitle',
    defaultMessage: 'Það sem vantar fyrir umsókn',
    description: 'Some description',
  },
  rejectedSignatureTitle: {
    id: 'dld.application:rejected.signature.title',
    defaultMessage: 'Undirskrift ekki til á skrá',
    description: 'Some description',
  },
  rejectedSignatureMessage: {
    id: 'dld.application:rejected.signature.message',
    defaultMessage:
      'Undirskrift ekki til í ökuskírteinaskrá og þarf því að koma til Sýslumanns og skrifa undir.',
    description: 'Some description',
  },
  rejectedImageTitle: {
    id: 'dld.application:rejected.image.title',
    defaultMessage: 'Ljósmynd í ökuskírteini ekki gæðamerkt',
    description: 'Some description',
  },
  rejectedImageMessage: {
    id: 'dld.application:rejected.image.message',
    defaultMessage:
      'Núverandi ljósmynd þín í ökuskírteinaskrá stenst ekki gæðakröfur og þarf því að koma með nýja ljósmynd.',
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

  /* Reason Section */
  reasonSectionTitle: {
    id: 'dld.application:reasonSectionTitle',
    defaultMessage: 'Ástæða umsóknar',
    description: 'Title for reason section',
  },
  reasonTitle: {
    id: 'dld.application:reasonTtitle',
    defaultMessage: 'Ástæða',
    description: 'Title for reason section',
  },
  reasonDescription: {
    id: 'dld.application:reasonDescription#markdown',
    defaultMessage:
      '**Vinsamlegast tilgreinið ástæðu umsóknarinnar.**\n\nAthugið: Saknæmt er að gefa rangar eða ósannar upplýsingar um að ökuskírteini hafi skemmst eða glatast. Finnist glataða skírteinið skal skila því inn til sýslumanns eða lögreglu. Afhenda skal lögreglu eða sýslumanni ökuskírteini sem eru skemmd, af eldri gerð eða EES gerð þegar óskað er eftir samriti.',
    description: 'Description for reason section',
  },
  confirmReason: {
    id: 'dld.application:confirmReason',
    defaultMessage: 'Ég staðfesti að ökuskírteinið hafi skemmst eða glatast',
    description: 'Confirm reason text',
  },
  reasonLostOption: {
    id: 'dld.application:reasonLostOption',
    defaultMessage: 'Glatað ökuskírteini',
    description: 'Lost option',
  },
  reasonStolenOption: {
    id: 'dld.application:reasonStolenOption',
    defaultMessage: 'Stolið ökuskírteini',
    description: 'Stolen option',
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
  qualityPhotoNoPhotoAlertMessage: {
    id: 'dld.application:qualityPhoto.qualityPhotoNoPhotoAlertMessage',
    defaultMessage: 'Ath. Skylda er að hlaða inn mynd',
    description: 'Alert on no photo attachment',
  },

  /* Delivery method Section */
  deliveryMethodSectionTitle: {
    id: 'dld.application:deliveryMethodSectionTitle',
    defaultMessage: 'Afhendingarstaður',
    description: 'Title for delivery method section',
  },
  deliveryMethodTitle: {
    id: 'dld.application:deliveryMethodTitle',
    defaultMessage: 'Afhendingarstaður',
    description: 'Title for delivery method section',
  },
  deliveryMethodDescription: {
    id: 'dld.application:deliveryMethodDescription#markdown',
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
  notFilledOut: {
    id: 'dld.application:notFilledOut',
    defaultMessage: 'Ekki fyllt út',
    description: '',
  },
  confirmTitle: {
    id: 'dld.application:confirm.title',
    defaultMessage: 'Staðfesta',
    description: 'Title for confirm section',
  },
  confirmDescription: {
    id: 'dld.application:confirm.description',
    defaultMessage:
      'Vinsamlegast farið yfir undirskrift og mynd. Ef nafn hefur breyst frá því að síðast var sótt um skírteini mun það stöðva umsókn. Fara þarf með nýja mynd eða veita nýja undirskrift hjá Sýslumanni ef svo ber undir.',
  },
  confirmSignatureAndPhoto: {
    id: 'dld.application:confirmSignatureAndPhoto',
    defaultMessage: 'Ég staðfesti að ofangreindar upplýsingar séu réttar.',
    description: 'Text for confirmation of signature and photo',
  },
  requiredCheckmark: {
    id: 'dld.application:requiredCheckmark',
    defaultMessage: 'Skylda er að haka við þennan reit',
    description: 'Text for required checkmark',
  },
  /*Payment Section*/
  proceedToPayment: {
    id: 'dld.application:payment.proceedToPayment',
    defaultMessage: 'Greiða',
    description: 'Some description',
  },
  paymentSection: {
    id: 'dld.application:payment.section',
    defaultMessage: 'Staðfesting og greiðsla',
    description: 'Some description',
  },
  paymentSectionTitle: {
    id: 'dld.application:payment.section.title',
    defaultMessage: 'Greiðsla',
    description: 'Some description',
  },
  paymentAmount: {
    id: 'dld.application:payment.amount',
    defaultMessage: 'Til greiðslu',
    description: 'Some description',
  },
  paymentSum: {
    id: 'dld.application:payment.sum',
    defaultMessage: 'Samtals',
    description: 'Some description',
  },
  payment: {
    id: 'dld.application:payment',
    defaultMessage: 'Ganga frá greiðslu',
    description: 'Some description',
  },
  confirm: {
    id: 'dld.application:confirm',
    defaultMessage: 'Staðfesta',
    description: 'Some description',
  },

  /* Congratulation Section */
  congratulationsTitleSuccess: {
    id: 'dld.application:congratulationsTitleSuccess',
    defaultMessage:
      'Umsókn þín um samrit af ökuskírteini hefur verið móttekin og skírteini pantað.',
    description: 'Your application for P-sign was successful.',
  },
  congratulationsTitle: {
    id: 'dld.application:congratulationsTitle',
    defaultMessage: 'Umsókn móttekin',
    description: 'Congratulations',
  },
  congratulationsApplicationNumber: {
    id: 'dld.application:congratulationsApplicationNumber',
    defaultMessage: 'Númer umsóknar',
    description: 'Congratulations',
  },
  congratulationsNextStepsTitle: {
    id: 'dld.application:congratulations.nextSteps.title',
    defaultMessage: 'Næstu skref',
    description: 'Congratulations Next steps title',
  },
  congratulationsNextStepsDescription: {
    id: 'dld.application:congratulations.nextSteps.description#markdown',
    defaultMessage:
      '* Ökuskírteinið verður tilbúið til afhendingar eftir þrjár vikur hjá því sýslumannsembætti sem þú valdir í umsókninni.\n\n* Á meðan getur þú notað [ökuskírteini í símanum](https://island.is/okuskirteini). Athugið að uppfæra þarf stafræna skírteinið ef þú ert þegar með það í símanum.',
    description: 'Congratulations Next steps title',
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
    id: 'dld.application:error.missingAttachmentDistrict',
    defaultMessage: 'Vinsamlegast veldu embætti',
    description: 'Validation error for district',
  },

  /* Category Section */
  categorySectionTitle: {
    id: 'dld.application:categorySectionTitle',
    defaultMessage: 'Réttindi',
    description: 'text for category section after NR',
  },
  noExpirationDate: {
    id: 'dld.application:noExpirationDate',
    defaultMessage: 'Villa: Enginn gildistími skilgreindur',
    description: 'text for when no expiration date is set on license',
  },
  generalLicense: {
    id: 'dld.application:generalLicense',
    defaultMessage: 'Almenn ökuréttindi',
    description: 'text for general license',
  },
  temporaryLicense: {
    id: 'dld.application:temporaryLicense',
    defaultMessage: 'Bráðabirgðaskírteini',
    description: 'text for temporary license',
  },

  /* Application log */
  pendingActionApplicationCompletedTitle: {
    id: 'dld.application:pendingActionApplicationCompletedTitle',
    defaultMessage: 'Umsókn þín hefur verið móttekin og skírteini pantað',
    description: 'text for pending action application completed title',
  },
})
