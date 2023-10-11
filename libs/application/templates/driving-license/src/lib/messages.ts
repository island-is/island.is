import { defineMessages } from 'react-intl'

export const m = defineMessages({
  existingApplicationTitle: {
    id: 'dl.application:error.existingApplication',
    defaultMessage: 'Fyrri umsóknir um ökuskírteini',
    description: 'Title of the data needed to fetch existing applications',
  },
  existingApplicationExists: {
    id: 'dl.application:error.existingApplicationExists',
    defaultMessage: 'Þú átt nú þegar umsókn í vinnslu',
    description:
      'Message letting the applicant know they already have an application in progress',
  },
  externalDataAgreement: {
    id: 'dl.application:externalData.agreement',
    defaultMessage: 'Ég hef kynnt mér ofangreint',
    description: 'I understand',
  },
  externalDataTitle: {
    id: 'dl.application:externalData.title',
    defaultMessage: 'Umsókn um ökuskírteini',
    description: 'Title of the application',
  },
  externalDataSubTitle: {
    id: 'dl.application:externalData.subTitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: 'The following data will be retrieved electronically',
  },
  yes: {
    id: 'dl.application:shared.yes',
    defaultMessage: 'Já',
    description: 'Yes',
  },
  no: {
    id: 'dl.application:shared.no',
    defaultMessage: 'Nei',
    description: 'No',
  },
  applicationName: {
    id: 'dl.application:application.name',
    defaultMessage: 'Ökuskírteini',
    description: 'Driving license',
  },
  externalDataSection: {
    id: 'dl.application:externalData.section',
    defaultMessage: 'Forsendur',
    description: 'Information',
  },
  externalDataComplete: {
    id: 'dl.application:externalData.complete',
    defaultMessage: 'Uppfletting í lagi',
    description: 'Information',
  },
  nationalRegistryTitle: {
    id: 'dl.application:nationalRegistry.title',
    defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
    description: 'Personal information from the National Registry',
  },
  nationalRegistrySubTitle: {
    id: 'dl.application:nationalRegistry.subTitle',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
    description:
      'Information from the National Registry will be used to prefill the data in the application',
  },
  userProfileInformationTitle: {
    id: 'dl.application:userprofile.title',
    defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
    description: 'Your user profile information',
  },
  userProfileInformationSubTitle: {
    id: 'dl.application:userprofile.subTitle',
    defaultMessage:
      'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
    description:
      'In order to apply for this application we need your email and phone number',
  },
  residenceTitle: {
    id: 'dl.application:residence.title',
    defaultMessage: 'Búseta',
    description: 'Residence',
  },
  residenceSubTitle: {
    id: 'dl.application:residence.subtitle',
    defaultMessage:
      'Ég hef fasta búsetu hér á landi eins og hún er skilgreind í VIII. viðauka reglugerðar um ökuskírteini eða tel mig fullnægja skilyrðum um búsetu hér á landi til að fá gefið út ökuskírteini.',
    description:
      "I've lived in Iceland according to VIII and here by confirm that I meet the conditions to apply for a driving license",
  },
  glassesPrescriptionTitle: {
    id: 'dl.application:glassesPrescription.title',
    defaultMessage: 'Gleraugnavottorð',
    description: 'Glasses prescription',
  },
  glassesPrescriptionSubTitle: {
    id: 'dl.application:glassesPrescription.subtitle',
    defaultMessage:
      'Til þess að auðvelda umsóknarferlið er sótt gleraugnavottorð frá samgöngustofu',
    description:
      'In order to facilitate the application process, a glasses certificate is obtained from the transport office',
  },
  informationSectionTitle: {
    id: 'dl.application:informationSection.title',
    defaultMessage: 'Sýslumannsembætti',
    description: 'Information',
  },
  pickupLocationTitle: {
    id: 'dl.application:pickuplocation',
    defaultMessage: 'Afhendingarstaður',
    description: 'location for pickup',
  },
  informationApplicant: {
    id: 'dl.application:information.applicant',
    defaultMessage: 'Umsækjandi',
    description: 'Applicant',
  },
  healthDeclarationSectionTitle: {
    id: 'dl.application:healthDeclarationSection.title',
    defaultMessage: 'Heilbrigðisyfirlýsing',
    description: 'Health declaration',
  },
  healthDeclarationMultiFieldTitle: {
    id: 'dl.application:healthDeclarationMultiField.title',
    defaultMessage: 'Heilbrigðisyfirlýsing',
    description: 'Health declaration',
  },
  healthDeclarationMultiFieldSubTitle: {
    id: 'dl.application:healthDeclarationMultiField.subTitle',
    defaultMessage: 'Yfirlýsing um líkamlegt og andlegt heilbrigði',
    description: 'Statement of physical and mental health',
  },
  declaration: {
    id: 'dl.application:declaration',
    defaultMessage: 'Yfirlýsing',
    description: '',
  },
  healthDeclarationSubTitle: {
    id: 'dl.application:healthDeclarationSubTitle',
    defaultMessage:
      'Ef einhverri spurningu er svarað játandi í heilbrigðisyfirlýsingu þarf læknisvottorð frá heimilislækni eða viðeigandi sérfræðilækni.',
    description: '',
  },
  uploadHeader: {
    id: 'dl.application:uploadHeader',
    defaultMessage: 'Læknisvottorð',
    description: 'Upload header',
  },
  uploadDescription: {
    id: 'dl.application:uploadDescription',
    defaultMessage:
      'Tekið er við skjölum með endingunum: .pdf, .doc, .docx, .rtf',
    description: 'Upload description',
  },
  uploadButtonLabel: {
    id: 'dl.application:uploadButtonLabel',
    defaultMessage: 'Velja skjal til að hlaða upp',
    description: 'Upload button label',
  },
  healthDeclarationAge65MultiFieldSubTitle: {
    id: 'dl.application:healthDeclarationAge65MultiFieldSubTitle.subTitle',
    defaultMessage:
      'Við endurnýjun ökuskírteinis fyrir 65 ára og eldri þarf að skila inn læknisvottorði frá heimilislækni. Vottorðið má ekki vera eldra en 3 mánaða.',
    description: 'Health declaration for 65+',
  },
  healthDeclaration1: {
    id: 'dl.application:healthDeclaration.1',
    defaultMessage: '1. Notar þú gleraugu, snertilinsur eða hefur skerta sjón?',
    description:
      '1. Do you wear glasses, contact lenses or have impaired vision?',
  },
  healthDeclaration2: {
    id: 'dl.application:healthDeclaration.2',
    defaultMessage:
      '2. Hefur þú skert sjónsvið til annarrar hliðar eða beggja?',
    description:
      '2. Do you have limited peripheral vision to one side or both?',
  },
  healthDeclaration3: {
    id: 'dl.application:healthDeclaration.3',
    defaultMessage:
      '3. Hefur þú verið flogaveik(ur) eða orðið fyrir alvarlegri truflun á meðvitund og stjórn hreyfinga?',
    description:
      '3. Have you had epilepsy or a severe disturbance of consciousness and control of movement?',
  },
  healthDeclaration4: {
    id: 'dl.application:healthDeclaration.4',
    defaultMessage:
      '4. Hefur þú nú eða hefur þú haft alvarlegan hjartasjúkdóm?',
    description:
      '4. Do you now have or have you had a serious heart condition?',
  },
  healthDeclaration5: {
    id: 'dl.application:healthDeclaration.5',
    defaultMessage: '5. Hefur þú nú eða hefur þú haft alvarlegan geðsjúkdóm?',
    description: '5. Do you now have or have you had a serious mental illness?',
  },
  healthDeclaration6: {
    id: 'dl.application:healthDeclaration.6',
    defaultMessage:
      '6. Notar þú að staðaldri læknislyf eða lyfjablöndur sem geta haft áhrif á meðvitund?',
    description:
      '6. Do you always use medicines or combinations of medicines that may affect your consciousness?',
  },
  healthDeclaration7: {
    id: 'dl.application:healthDeclaration.7',
    defaultMessage:
      '7. Ert þú háð(ur) áfengi, ávana- og/eða fíkniefnum eða misnotar þú geðræn lyf sem verkað gætu á meðvitund?',
    description:
      '7. Are you addicted to alcohol, drugs and/or drugs or are you abusing psychotropic drugs that could affect your consciousness?',
  },
  healthDeclaration8: {
    id: 'dl.application:healthDeclaration.8',
    defaultMessage: '8. Notar þú insúlín og/eða töflur við sykursýki?',
    description: '8. Do you use insulin and/or tablets for diabetes?',
  },
  healthDeclaration9: {
    id: 'dl.application:healthDeclaration.9',
    defaultMessage:
      '9. Hefur þú nú eða hefur þú haft hömlur í hreyfikerfi líkamans?',
    description:
      "9. Do you now have or have you had restrictions on your body's motor system?",
  },
  healthDeclaration10: {
    id: 'dl.application:healthDeclaration.10',
    defaultMessage:
      '10. Átt þú við einhvern annan sjúkdóm að stríða sem þú telur að geti haft áhrif á öryggi þitt í akstri í framtíðinni?',
    description:
      '10. Do you have any other illnesses that you think may affect your driving safety in the future?',
  },
  overviewSectionTitle: {
    id: 'dl.application:overviewSection.title',
    defaultMessage: 'Staðfesting',
    description: 'Confirmation',
  },
  errorHealthDeclarationNotFilledOut: {
    id: 'dl.application:errorHealthDeclarationNotFilledOut',
    defaultMessage: 'Vinsamlegast fylltu út heilbringðisyfirlýsingu',
    description: '',
  },
  alertHealthDeclarationGlassesMismatch: {
    id: 'dl.application:alertHealthDeclarationGlassesMismatch',
    defaultMessage:
      'Athugaðu að þar sem þú hefur (hefur ekki) verið að nota gleraugu seinast, þá þarftu að skila inn vottorði frá lækninum þínum sem sýnir að þú sért (sért ekki) að nota gleraugu.',
    description: '',
  },
  overviewMultiFieldTitle: {
    id: 'dl.application:overviewMultiField.title',
    defaultMessage: 'Yfirlit',
    description: 'Overview',
  },
  overviewMultiFieldDescription: {
    id: 'dl.application:overviewMultiField.Description',
    defaultMessage:
      'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
    description: "Please review the data below to confirm they're correct.",
  },
  overviewSubType: {
    id: 'dl.application:overview.subType',
    defaultMessage: 'Tegund ökuréttinda',
    description: 'Driving license type',
  },
  overviewName: {
    id: 'dl.application:overview.Name',
    defaultMessage: 'Nafn',
    description: 'Name',
  },
  overviewPhoneNumber: {
    id: 'dl.application:overview.phoneNumber',
    defaultMessage: 'Sími',
    description: 'Phone number',
  },
  overviewNationalId: {
    id: 'dl.application:overview.nationalId',
    defaultMessage: 'Kennitala',
    description: 'National Id',
  },
  overviewStreetAddress: {
    id: 'dl.application:overview.streetAddress',
    defaultMessage: 'Heimili',
    description: 'Street address',
  },
  overviewPostalCode: {
    id: 'dl.application:overview.postalCode',
    defaultMessage: 'Póstnúmer',
    description: 'Postal code',
  },
  overviewEmail: {
    id: 'dl.application:overview.email',
    defaultMessage: 'Netfang',
    description: 'Email',
  },
  overviewCity: {
    id: 'dl.application:overview.City',
    defaultMessage: 'Staður',
    description: 'City',
  },
  overviewTeacher: {
    id: 'dl.application:overview.teacher',
    defaultMessage: 'Ökukennari',
    description: 'Teacher',
  },
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
  overviewBringAlongTitle: {
    id: 'dl.application:overview.overviewBringAlongTitle',
    defaultMessage: 'Gögn höfð meðferðis til sýslumanns',
    description: `Data to bring along`,
  },
  overviewBringCertificateData: {
    id: 'dl.application:overview.bringCertificateData',
    defaultMessage: 'Ég kem með vottorð frá lækni meðferðis',
    description: `I'll bring a certificate from a doctor`,
  },
  overviewDone: {
    id: 'dl.application:overview.done',
    defaultMessage: 'Umsókn móttekin',
    description: 'Confirmation',
  },
  applicationDenied: {
    id: 'dl.application:applicationDenied',
    defaultMessage: 'Umsókn hafnað',
    description: 'Application denied',
  },
  overviewPaymentCharge: {
    id: 'dl.application:overview.paymentcharge',
    defaultMessage: 'Greiðsla',
    description: 'Cost',
  },
  errorDataProvider: {
    id: 'dl.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in driving license data provider',
  },
  examplePaymentPendingField: {
    id: 'dl.application:example.waitingForPayment',
    defaultMessage: 'Augnablik meðan beðið er eftir greiðslu',
    description: 'One moment while we wait for payment confirmation.',
  },
  examplePaymentPendingFieldError: {
    id: 'dl.application:example.waitingForPaymentError',
    defaultMessage: 'Villa kom upp við að sækja upplýsingar um greiðslu',
    description: 'An error came up while getting payment information',
  },
  orderDrivingLicense: {
    id: 'dl.application:order.drivingLicense',
    defaultMessage: 'Panta ökuskírteini',
    description: 'Order driving license',
  },
  continue: {
    id: 'dl.application:continue',
    defaultMessage: 'Halda áfram',
    description: 'Continue',
  },
  payment: {
    id: 'dl.application:DrivingLicenseApplicationPaymentForm',
    defaultMessage: 'greiðsla',
    description: 'payment',
  },
  paymentCapital: {
    id: 'dl.application:awaitingPayment',
    defaultMessage: 'Staðfesting á greiðslu',
    description: 'Payment',
  },
  forwardingToPayment: {
    id: 'dl.application:forwardingToPayment',
    defaultMessage: 'Sendi þig áfram á greiðsluveitu...',
    description: 'Forwarding you to payment handler...',
  },
  paymentPendingConfirmation: {
    id: 'dl.application:paymentPendingConfirmation',
    defaultMessage: 'Beðið eftir staðfestingu greiðsluveitu',
    description: 'Pending confirmation from payment handler',
  },
  applicationForDrivingLicense: {
    id: 'dl.application:applicationForDrivingLicense',
    defaultMessage: 'Umsókn um ökuskírteini',
    description: 'Application for driving license',
  },
  eligibilityRequirementTitle: {
    id: 'dl.application:eligibilityTitle',
    defaultMessage: 'Skilyrði sem umsækjandi þarf að uppfylla',
    description: 'title for requirement component',
  },
  applicationEligibilityTitle: {
    id: 'dl.application:applicationEligibilityTitle',
    defaultMessage: 'Skilyrði umsóknar',
    description: 'title for requirement section',
  },
  applicationDrivingLicenseTitle: {
    id: 'dl.application:applicationDrivingLicenseTitle',
    defaultMessage: 'Tegund umsóknar',
    description: 'Type of application for driving license',
  },
  drivingLicenseApplyingForTitle: {
    id: 'dl.application:drivingLicenseApplyingForTitle',
    defaultMessage: 'Ég er að sækja um:',
    description: 'I am applying for:',
  },
  congratulationsHelpText: {
    id: 'dl.application:congratulationsHelpText',
    defaultMessage:
      'Umsókn þín um fullnaðarskírteinið hefur verið móttekin. Áður en hægt er að panta fullnaðarskírteini, þarf að koma á skrifstofu sýslumanns og skila eftirfarandi gögnum.',
    description:
      'Your application for a full driving license has been received. Before a full driving license can be applied for, you must bring the following to the district commissioner.',
  },
  congratulationsTempHelpText: {
    id: 'dl.application:congratulationsTempHelpText',
    defaultMessage:
      'Umsókn þín um bráðabirgðaskírteini hefur verið móttekin. Áður en hægt er að panta bráðabirgðaskírteini, þarf að koma á skrifstofu sýslumanns og skila eftirfarandi gögnum.',
    description:
      'Your application for a full driving license has been received. Before a full driving license can be applied for, you must bring the following to the district commissioner.',
  },
  congratulationsTitleSuccess: {
    id: 'dl.application:congratulationsTitleSuccess',
    defaultMessage:
      'Umsókn þín um fullnaðarskírteini tókst og verður tilbúið á afhendingarstað eftir 3 til 4 vikur. Skila þarf inn bráðabirgðaskírteini til sýslumanns við afhendingu fullnaðarskírteinis.',
    description: 'Your application for full driving license was successful.',
  },
  congratulationsTempTitleSuccess: {
    id: 'dl.application:congratulationsTempTitleSuccess',
    defaultMessage:
      'Umsókn þín um að hefja ökunám og fá bráðabirgðaskírteini hefur verið móttekin. Þegar þú hefur lokið ökunámi og staðist bæði verklegt og bóklegt ökupróf, verður skírteini þitt pantað og tilbúið til afhendingar hjá völdu sýslumannsembætti þremur vikum síðar.',
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
  paymentPendingDescription: {
    id: 'dl.application:paymentPendingDescription',
    defaultMessage: 'Augnablik meðan beðið er eftir staðfestingu',
    description: 'Please wait until the payment is confirmed',
  },
  paymentSuccessExtraDocuments: {
    id: 'dl.application:paymentSuccessExtraDocuments',
    defaultMessage:
      'Ef beðið var um viðbótargögn (nýja ljósmynd eða læknisvottorð) þarf að skila þeim til Sýslumanns svo að fullnaðarskírteini fari í pöntun.',
    description:
      'If extra documents are required(new photograph or doctor certificate), you must return them to district commissioner so the driving license can be ordered.',
  },
  paymentSuccessIfNotReadyFewWeeks: {
    id: 'dl.application:paymentSuccessIfNotReadyFewWeeks',
    defaultMessage:
      'Ef svo var ekki þá verður fullnaðarskírteinið tilbúið á afhendingarstað eftir 3 til 4 vikur.',
    description:
      'If not then the driving license will be ready at the drop off location in 3 to 4 weeks.',
  },
  paymentApprovedContinue: {
    id: 'dl.application:paymentApprovedContinue',
    defaultMessage: `Greiðslan hefur verið staðfest, valið er 'Halda áfram' til að klára umsóknina.`,
    description:
      'The payment has been confirmed, choose "Continue" to finish the application.',
  },
  paymentImage: {
    id: 'dl.application:paymentImage',
    defaultMessage: `Skrautmynd`,
    description: 'Company Image',
  },
  districtCommisionerTitle: {
    id: 'dl.application:districtCommisionerTitle',
    defaultMessage: 'Sýslumannsembætti',
    description: 'Title for district commissioner',
  },
  districtCommisionerPickup: {
    id: 'dl.application:districtCommisionerPickup',
    defaultMessage: 'Afhending',
    description: 'Pickup for district commissioner',
  },
  chooseDistrictCommisionerForFullLicense: {
    id: 'dl.application:chooseDistrictCommisionerForFullLicense',
    defaultMessage:
      'Veldu það embætti sýslumanns þar sem þú vilt skila inn bráðabirgðaskírteini og fá afhent nýtt fullnaðarskírteini',
    description:
      'Choose district commissioner for returning a temporary license and recieve a new full license',
  },
  chooseDistrictCommisionerForTempLicense: {
    id: 'dl.application:chooseDistrictCommisionerForTempLicense',
    defaultMessage:
      'Veldu það embætti sýslumanns sem þú hyggst skila inn gæðamerktri ljósmynd',
    description: 'Choose district commissioner for submitting a quality photo',
  },
  confirmationStatusOfEligability: {
    id: 'dl.application:confirmationStatusOfEligability',
    defaultMessage:
      'Sóttar eru almennar upplýsingar um núverandi réttindi, sviptingar, punktastöðu og akstursmat ef við á.',
    description:
      'General information about current licenses, license loss, penalties and driving assessment if applicable.',
  },
  infoFromLicenseRegistry: {
    id: 'dl.application:infoFromLicenseRegistry',
    defaultMessage: 'Upplýsingar úr ökuskírteinaskrá',
    description: 'Information from driving license registry',
  },
  actionCardDraft: {
    id: 'dl.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in progress',
  },
  actionCardPayment: {
    id: 'dl.application:actionCardPayment',
    defaultMessage: 'Greiðslu vantar',
    description:
      'Description of application state/status when payment is pending',
  },
  submitErrorButtonCaption: {
    id: 'dl.application:submitErrorButtonCaption',
    defaultMessage: 'Reyna aftur',
    description:
      'Button that shows up when submitting the application fails, allowing you to retry',
  },
  submitErrorTitle: {
    id: 'dl.application:submitErrorTitle',
    defaultMessage: 'Móttaka umsóknar tókst ekki',
    description:
      'title that shows up when an error occurs while submitting the application',
  },
  submitErrorMessage: {
    id: 'dl.application:submitErrorMessage',
    defaultMessage:
      'Eitthvað fór úrskeiðis við að senda inn umsókn. Reyndu aftur síðar.',
    description:
      'Text that shows up when an error occurs while submitting the application',
  },
  attachmentMaxSizeError: {
    id: 'dl.application:error.attachment.maxSizeError',
    defaultMessage: 'Hámark 10 MB á skrá',
    description: 'Max 10 MB per file',
  },
  informationTitle: {
    id: 'dl.application:informationTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Title for information section',
  },
  chooseDrivingInstructor: {
    id: 'dl.application:chooseDrivingInstructor',
    defaultMessage: 'Finndu og veldu nafn ökukennara þíns úr listanum',
    description:
      'Find and select the name of your driving instructor from the list',
  },
  drivingLicenseTypeRequested: {
    id: 'dl.application:drivingLicenseTypeRequested',
    defaultMessage: 'Réttindi sem sótt er um',
    description: 'Driving license type that is requested',
  },
  informationStreetAddress: {
    id: 'dl.application:informationStreetAddress',
    defaultMessage: 'Heimilisfang',
    description: 'Street address',
  },
  informationYourEmail: {
    id: 'dl.application:informationYourEmail',
    defaultMessage: 'Netfangið þitt',
    description: 'Your email',
  },
  informationYourPhone: {
    id: 'dl.application:informationYourPhone',
    defaultMessage: 'Símanúmerið þitt',
    description: 'Your phone number',
  },
  drivingInstructor: {
    id: 'dl.application:drivingInstructor',
    defaultMessage: 'Ökukennari',
    description: 'Driving instructor',
  },
  drivingLicenseInOtherCountry: {
    id: 'dl.application:drivingLicenseInOtherCountry',
    defaultMessage: 'Ertu með ökuskírteini í öðru landi?',
    description: 'Do you have a driving license in another country?',
  },
  foreignDrivingLicense: {
    id: 'dl.application:foreignDrivingLicense',
    defaultMessage: 'Erlent ökuskírteini',
    description: 'Foreign driving license',
  },
  noDeprivedDrivingLicenseInOtherCountryTitle: {
    id: 'dl.application:noDeprivedDrivingLicenseInOtherCountryTitle',
    defaultMessage: 'Ég er ekki með sviptingu í öðru landi',
    description: 'I do not have a deprived driving license in another country',
  },
  noDeprivedDrivingLicenseInOtherCountryDescription: {
    id: 'dl.application:noDeprivedDrivingLicenseInOtherCountryDescription',
    defaultMessage:
      'Staðfesting að umsækjandi hafi ekki undir höndum ökuskírteini gefið út af öðru ríki sem er aðili að Evrópska efnahagssvæðinu né hafi sætt takmörkunum á ökurétti eða verið svipt(ur) ökuréttindum í þeim ríkjum',
    description:
      'Confirmation that the applicant did not hold a driving license issued by another Member State of the European Economic Area, nor were they subject to a driving license restriction or were deprived of their driving license in those countries',
  },
  applicationForFullLicenseTitle: {
    id: 'dl.application:applicationForFullLicenseTitle',
    defaultMessage: 'Fullnaðarréttindi',
    description: 'Option title for selecting to apply for full driving license',
  },
  applicationForFullLicenseDescription: {
    id: 'dl.application:applicationForFullLicenseDescription',
    defaultMessage:
      'Ef ökumaður hefur haft bráðabirgðaskírteini í að minnsta kosti ár og farið í akstursmat með ökukennara getur hann sótt um fullnaðarskírteini.',
    description:
      'Option description for selecting to apply for full driving license',
  },
  applicationForTempLicenseTitle: {
    id: 'dl.application:applicationForTempLicenseTitle',
    defaultMessage: 'Almenn ökuréttindi',
    description:
      'Option title for selecting to apply for temporary driving license',
  },
  applicationForTempLicenseDescription: {
    id: 'dl.application:applicationForTempLicenseDescription',
    defaultMessage:
      'Umsókn um almenn ökuréttindi í B flokki (fólksbifreið). Fyrsta ökuskírteinið er bráðabirgðaskírteini sem gildir í 3 ár.',
    description:
      'Option description for selecting to apply for temporary driving license',
  },
  declinedOtherCountryHelpText: {
    id: 'dl.application:declinedOtherCountryHelpText',
    defaultMessage:
      'Vinsamlega hafðu samband við næsta sýslumannsembætti til að fá frekari upplýsingar.',
    description: 'Requirement not met for driving license application',
  },
  declinedOtherEESCountryTitle: {
    id: 'dl.application:declinedOtherEESCountryTitle',
    defaultMessage: 'Ökuskírteini frá EES',
    description: 'Driving license from other EES country title',
  },
  declinedOtherEESCountryDescription: {
    id: 'dl.application:declinedOtherEESCountryDescription',
    defaultMessage:
      'Umsækjandi með ökuskírteini frá landi innan EES, Bretlandi og Japan má skipta yfir í íslenskt ökuskírteini án þess að taka próf.',
    description: 'Driving license from other EES country description',
  },
  declinedOtherNonEESCountryTitle: {
    id: 'dl.application:declinedOtherNonEESCountryTitle',
    defaultMessage: 'Ökuskírteini utan EES',
    description: 'Driving license from other country title',
  },
  declinedOtherNonEESCountryDescription: {
    id: 'dl.application:declinedOtherNonEESCountryDescription',
    defaultMessage:
      'Umsækjandi með ökuskírteini utan EES getur sótt um að skipta yfir í íslenskt ökuskírteini eftir 6 mánaða fasta búsetu. Taka þarf bæði bóklegt og verklegt próf og öðlast fullnaðarskírteini.',
    description: 'Driving license from other country description',
  },
  nationalCommissionerOfPolice: {
    id: 'dl.application:nationalCommissionerOfPolice',
    defaultMessage: 'Ríkislögreglustjóri',
    description: 'National Commissioner of Police',
  },
  countryDirectionsTitle: {
    id: 'dl.application:countryDirectionsTitle',
    defaultMessage: 'Leiðbeiningar',
    description:
      'Title of the section that explains the next steps when they have a driving license in a different country',
  },
  healthRemarksTitle: {
    id: 'dl.application:healthRemarksTitle',
    defaultMessage: 'Athugið',
    description:
      'Alert message title for health remarks on temporary driving license',
  },
  healthRemarksDescription: {
    id: 'dl.application:healthRemarksDescription',
    defaultMessage:
      'Á bráðabirgðaskírteini eru tákntölur, því þarft þú að skila læknisvottorði til sýslumanns miðað við þá heilbrigðisyfirlýsingu sem fyllt var út í þeirri umsókn. Tákntölurnar eru eftirfarandi: ',
    description:
      'Alert message for health remarks on temporary driving license',
  },
})

export const requirementsMessages = defineMessages({
  rlsAcceptedDescription: {
    id: 'dl.application:requirementunmet.accepted',
    defaultMessage: 'Þú uppfyllir þær kröfur sem gerðar eru',
    description: 'RLS / driving license api approves of the applicant',
  },
  rlsDefaultDeniedDescription: {
    id: 'dl.application:requirementunmet.deniedbyservicedescription',
    defaultMessage:
      'Vinsamlega hafðu samband við næsta sýslumannsembætti til að fá frekari upplýsingar.',
    description:
      'requirement unmet api returned false for an unspecified reason',
  },
  invalidLicense: {
    id: 'dl.application:requirementunmet.invalidlicense',
    defaultMessage:
      'Bráðabirgðaskírteini er ekki til staðar. Vinsamlega hafðu samband við næsta sýslumannsembætti til að fá frekari upplýsingar.',
    description:
      'requirement unmet api returned NO_TEMP_LICENSE / NO_LICENSE_FOUND',
  },
  hasPointsOrDeprivation: {
    id: 'dl.application:requirementunmet.haspointsordeprivation',
    defaultMessage:
      'Þú ert með punkta eða sviptingu. Vinsamlega hafðu samband við næsta sýslumannsembætti til að fá frekari upplýsingar.',
    description: 'requirement unmet api returned HAS_DEPRIVATION / HAS_POINTS',
  },
  drivingAssessmentTitle: {
    id: 'dl.application:requirementunmet.drivingassessmenttitle',
    defaultMessage: 'Akstursmat',
    description: 'requirement unmet assessment',
  },
  drivingAssessmentDescription: {
    id: 'dl.application:requirementunmet.drivingassessmentdescription',
    defaultMessage:
      'Ef þú ert búinn að fara í akstursmat hjá ökukennara biddu hann um að staðfesta það rafrænt.',
    description: 'requirement unmet assessment',
  },
  drivingSchoolTitle: {
    id: 'dl.application:requirementunmet.drivingschooltitle',
    defaultMessage: 'Ökuskóli 3',
    description: 'requirement unmet driving school',
  },
  drivingSchoolDescription: {
    id: 'dl.application:requirementunmet.drivingschooldescription',
    defaultMessage:
      'Umsækjandi þarf að hafa klárað Ökuskóla 3 til að fá fullnaðarskírteini.',
    description: 'requirement unmet driving school',
  },
  rlsTitle: {
    id: 'dl.application:requirementunmet.deniedbyservicetitle',
    defaultMessage: 'Ökuskírteinaskrá',
    description: 'requirement unmet api returned false',
  },
  localResidencyTitle: {
    id: 'dl.application:requirementunmet.localResidencyTitle',
    defaultMessage: 'Búseta á Íslandi',
    description: 'requirement unmet api returned false',
  },
  localResidencyDescription: {
    id: 'dl.application:requirementunmet.localResidencyDescription',
    defaultMessage:
      'Þú þarft að hafa búið að minnsta kosti 180 daga af síðustu 365 dögum á Íslandi til að geta sótt um ökuskírteini.',
    description: 'requirement unmet api returned false',
  },
  currentLocalResidencyDescription: {
    id: 'dl.application:requirementunmet.currentLocalResidencyDescription',
    defaultMessage:
      'Þú þarft að hafa búsetu á Íslandi til að geta sótt um fullnaðarskírteini.',
    description: 'requirement unmet api returned false',
  },
})
