import { defineMessages } from 'react-intl'

export const m = defineMessages({
  nationalCommissionerOfPolice: {
    id: 'dl.application:nationalCommissionerOfPolice',
    defaultMessage: 'Sýslumenn',
    description: 'Institution responsible for the driving license application',
  },
  chooseDistrictCommissionerForFullLicense: {
    id: 'dl.application:chooseDistrictCommissionerForFullLicense',
    defaultMessage:
      'Veldu það embætti sýslumanns þar sem þú vilt skila inn eldra ökuskírteini og fá afhent nýtt með nýjum réttindunum',
    description:
      'Choose district commissioner for returning a temporary license and recieve a new full license',
  },
  chooseDistrictCommissionerForTempLicense: {
    id: 'dl.application:chooseDistrictCommissionerForTempLicense',
    defaultMessage:
      'Veldu það embætti sýslumanns sem þú hyggst skila inn gæðamerktri ljósmynd',
    description: 'Choose district commissioner for submitting a quality photo',
  },
  continue: {
    id: 'dl.application:continue',
    defaultMessage: 'Halda áfram',
    description: 'Continue',
  },
  orderDrivingLicense: {
    id: 'dl.application:order.drivingLicense',
    defaultMessage: 'Panta ökuskírteini',
    description: 'Order driving license',
  },
  eligibilityRequirementTitle: {
    id: 'dl.application:eligibilityTitle',
    defaultMessage: 'Skilyrði sem umsækjandi þarf að uppfylla:',
    description: 'title for requirement component',
  },
  paymentCapital: {
    id: 'dl.application:awaitingPayment',
    defaultMessage: 'Staðfesting á greiðslu',
    description: 'Payment',
  },
  applicationEligibilityTitle: {
    id: 'dl.application:applicationEligibilityTitle',
    defaultMessage: 'Skilyrði umsóknar',
    description: 'title for requirement section',
  },
  applicationForAdvancedAgeRequired: {
    id: 'dl.application:applicationForAdvancedAgeFor',
    defaultMessage: 'Réttindaaldur er {age} ára.',
    description: 'Required age for {licenses} is {age} years',
  },
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
  confirmationStatusOfEligability: {
    id: 'dl.application:confirmationStatusOfEligability',
    defaultMessage:
      'Sóttar eru almennar upplýsingar um núverandi réttindi, sviptingar, punktastöðu og akstursmat ef við á.',
    description:
      'General information about current licenses, license loss, penalties and driving assessment if applicable.',
  },
  drivingLicenseApplyingForTitle: {
    id: 'dl.application:drivingLicenseApplyingForTitle',
    defaultMessage: 'Ég er að sækja um:',
    description: 'I am applying for:',
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
    defaultMessage: 'Almenn ökuréttindi - B flokkur (Fólksbifreið)',
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
  infoFromLicenseRegistry: {
    id: 'dl.application:infoFromLicenseRegistry',
    defaultMessage: 'Upplýsingar úr ökuskírteinaskrá',
    description: 'Information from driving license registry',
  },
  applicationDrivingLicenseTitle: {
    id: 'dl.application:applicationDrivingLicenseTitle',
    defaultMessage: 'Tegund umsóknar',
    description: 'Type of application for driving license',
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
  informationTitle: {
    id: 'dl.application:informationTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Title for information section',
  },
  overviewPaymentCharge: {
    id: 'dl.application:overview.paymentcharge',
    defaultMessage: 'Greiðsla',
    description: 'Cost',
  },
  applicationDone: {
    id: 'dl.application:overview.done',
    defaultMessage: 'Umsókn móttekin',
    description: 'Confirmation',
  },
  applicationDenied: {
    id: 'dl.application:applicationDenied',
    defaultMessage: 'Umsókn hafnað',
    description: 'Application denied',
  },
  applicationForBAdvancedDescription: {
    id: 'dl.application:applicationForBAdvancedDescription',
    defaultMessage: 'Umsókn um aukin ökuréttindi',
    description: 'Option description for selecting to renew driving license',
  },
  applicationForDrivingLicense: {
    id: 'dl.application:applicationForDrivingLicense',
    defaultMessage: 'Umsókn um ökuskírteini',
    description: 'Application for driving license',
  },
  applicationForBELicenseTitle: {
    id: 'dl.application:applicationForBELicenseTitle',
    defaultMessage: 'Eftirvagn BE',
    description: 'Option title for selecting to apply for trailer license',
  },
  applicationForBELicenseDescription: {
    id: 'dl.application:applicationForBELicenseDescription',
    defaultMessage:
      'Almenn ökuréttindi gefa réttindi til að mega draga kerrur sem eru allt að 750 kg, til að mega draga þyngri kerrur, hjólhýsi, hestakerrur ofl þarf réttindi sem kallast BE réttindi.',
    description: 'Option title for selecting to apply for trailer license',
  },
  applicationForAdvancedLicenseTitle: {
    id: 'dl.application:applicationForAdvancedLicenseTitle',
    defaultMessage: 'Aukin ökuréttindi / meirapróf',
    description: 'Option title for selecting advanced driving license',
  },
  applicationForAdvancedLicenseDescription: {
    id: 'dl.application:applicationForAdvancedLicenseDescription',
    defaultMessage:
      'Til að sækja um aukin ökuréttindi þarf að hafa að lámarki ökuréttindi í flokki B.',
    description: 'Option description for selecting advanced driving license',
  },
  applicationForAdvancedLicenseSectionTitle: {
    id: 'dl.application:applicationForAdvancedLicenseSectionTitle',
    defaultMessage: 'Veldu réttindi',
    description: 'Option title for selecting advanced driving license',
  },
  applicationForAdvancedLicenseSectionDescription: {
    id: 'dl.application:applicationForAdvancedLicenseSectionDescription',
    defaultMessage: 'Í þessari umsókn er verið að sækja um:',
    description: 'Option description for selecting advanced driving license',
  },
  groupTitleC1: {
    id: 'dl.application:groupTitleC1',
    defaultMessage: 'Minni vörubíll og eftirvagn (C1 og C1E)',
    description: 'C1 group title',
  },
  groupTitleC: {
    id: 'dl.application:groupTitleC',
    defaultMessage: 'Vörubíll og eftirvagn (C og CE)',
    description: 'C1 group title',
  },
  groupTitleD1: {
    id: 'dl.application:groupTitleD1',
    defaultMessage: 'Lítil rúta og eftirvagn (D1 og D1E)',
    description: 'C1 group title',
  },
  groupTitleD: {
    id: 'dl.application:groupTitleD',
    defaultMessage: 'Stór rúta og eftirvagn (D og DE)',
    description: 'C1 group title',
  },
  applicationForAdvancedLicenseTitleC1: {
    id: 'dl.application:applicationForAdvancedLicenseTitleC1',
    defaultMessage: 'Minni vörubíll (C1)',
    description: 'C1 title',
  },
  applicationForAdvancedLicenseLabelC1: {
    id: 'dl.application:applicationForAdvancedLicenseLabelC1',
    defaultMessage:
      'Gefur réttindi til að aka bifreið fyrir 8 farþega eða færri, sem er þyngri en 3.500 kg en þó ekki þyngri en 7.500 kg. Sá sem hefur C1 réttindi má tengja eftirvagn/tengitæki sem er 750 kg eða minna af leyfðri heildarþyngd. Til þess að mega draga þyngri eftirvagna/tengitæki þarf að taka C1E réttindi.',
    description: 'C1 description',
  },
  applicationForAdvancedLicenseLabelC1A: {
    id: 'dl.application:applicationForAdvancedLicenseLabelC1A',
    defaultMessage: 'Sækja um leyfi í atvinnuskyni',
    description: 'C1A description',
  },
  applicationForAdvancedLicenseTitleD1: {
    id: 'dl.application:applicationForAdvancedLicenseTitleD1',
    defaultMessage: 'Lítil rúta (D1)',
    description: 'D1 title',
  },
  applicationForAdvancedLicenseLabelD1: {
    id: 'dl.application:applicationForAdvancedLicenseLabelD1',
    defaultMessage:
      'Gefur réttindi til að aka hópbifreið sem er gerð fyrir að hámarki 16 farþega. Sá sem hefur D1 réttindi má tengja eftirvagn/tengitæki sem er 750 kg eða minna að leyfðri heildarþyngd.',
    description: 'D1 description',
  },
  applicationForAdvancedLicenseLabelD1A: {
    id: 'dl.application:applicationForAdvancedLicenseLabelD1A',
    defaultMessage: 'Sækja um leyfi í atvinnuskyni',
    description: 'D1A description',
  },
  applicationForAdvancedLicenseTitleC: {
    id: 'dl.application:applicationForAdvancedLicenseTitleC',
    defaultMessage: 'Vörubíll (C)',
    description: 'C title',
  },
  applicationForAdvancedLicenseLabelC: {
    id: 'dl.application:applicationForAdvancedLicenseLabelC',
    defaultMessage:
      'Gefur réttindi til að aka vörubifreið fyrir 8 farþega eða færri, sem er þyngri en 7.500 kg. C flokkur gefur einnig réttindi til að aka bifreiðinni með eftirvagni sem er 750 kg eða minna af leyfðri heildarþyngd.',
    description: 'C description',
  },
  applicationForAdvancedLicenseLabelCA: {
    id: 'dl.application:applicationForAdvancedLicenseLabelCA',
    defaultMessage: 'Sækja um leyfi í atvinnuskyni',
    description: 'CA description',
  },
  applicationForAdvancedLicenseTitleD: {
    id: 'dl.application:applicationForAdvancedLicenseTitleD',
    defaultMessage: 'Stór rúta (D)',
    description: 'D title',
  },
  applicationForAdvancedLicenseLabelD: {
    id: 'dl.application:applicationForAdvancedLicenseLabelD',
    defaultMessage:
      'Gefur réttindi til að aka bifreið sem gerð er fyrir fleiri en 8 farþega auk ökumanns. Sá sem hefur D réttindi má tengja eftirvagn/tengitæki sem er 750 kg eða minna af leyfðri heildarþyngd.',
    description: 'D description',
  },
  applicationForAdvancedLicenseLabelDA: {
    id: 'dl.application:applicationForAdvancedLicenseLabelDA',
    defaultMessage: 'Sækja um leyfi í atvinnuskyni',
    description: 'DA description',
  },
  applicationForAdvancedLicenseTitleC1E: {
    id: 'dl.application:applicationForAdvancedLicenseTitleC1E',
    defaultMessage: 'Minni vörubíll og eftirvagn (C1E)',
    description: 'C1E title',
  },
  applicationForAdvancedLicenseLabelC1E: {
    id: 'dl.application:applicationForAdvancedLicenseLabelC1E',
    defaultMessage:
      'Gefur réttindi til að aka vörubifreið/stórum pallbíl í flokki C1 með eftirvagni sem er þyngri en 750 kg að heildarþunga. Þó má sameiginlegur heildarþungi beggja ökutækja ekki fara yfir 12.000 kg. ',
    description: 'C1E description',
  },
  applicationForAdvancedLicenseTitleD1E: {
    id: 'dl.application:applicationForAdvancedLicenseTitleD1E',
    defaultMessage: 'Lítil rúta og eftirvagn (D1)',
    description: 'D1E title',
  },
  applicationForAdvancedLicenseLabelD1E: {
    id: 'dl.application:applicationForAdvancedLicenseLabelD1E',
    defaultMessage:
      'Gefur réttindi til að aka bifreið í B-flokki með eftirvagn í BE-flokki og hópbifreið í D1 flokki með eftirvagn sem er þyngri en 750 kg að heildarþunga. Þó má sameiginlegur heildarþungi beggja ökutækja ekki fara yfir 12.000 kg.',
    description: 'D1E description',
  },
  applicationForAdvancedLicenseTitleCE: {
    id: 'dl.application:applicationForAdvancedLicenseTitleCE',
    defaultMessage: 'Vörubíll og eftirvagn (CE)',
    description: 'CE title',
  },
  applicationForAdvancedLicenseLabelCE: {
    id: 'dl.application:applicationForAdvancedLicenseLabelCE',
    defaultMessage:
      'Gefur réttindi til að aka vörubifreið í flokki C með eftirvagni sem er þyngri en 750 kg að heildarþunga.',
    description: 'CE description',
  },
  applicationForAdvancedLicenseTitleDE: {
    id: 'dl.application:applicationForAdvancedLicenseTitleDE',
    defaultMessage: 'Stór rúta og eftirvagn (DE)',
    description: 'DE title',
  },
  applicationForAdvancedLicenseLabelDE: {
    id: 'dl.application:applicationForAdvancedLicenseLabelDE',
    defaultMessage:
      'Að loknum D réttindum, er hægt að taka að auki DE, sem gefur réttindi til að aka hópbifreið í flokki D með eftirvagni sem er þyngri en 750 kg að heildarþunga. Þeir nemendur sem taka eftirvagnaréttindi í flokki DE og gilda þau réttindi einnig fyrir CE.',
    description: 'DE description',
  },
  applicationForAdvancedRequiredError: {
    id: 'dl.application:applicationForAdvancedRequiredError',
    defaultMessage: 'Þú verður að velja að minnsta kosti einn valmöguleika',
    description: 'You must select at least one option',
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
  informationSectionTitle: {
    id: 'dl.application:informationSection.title',
    defaultMessage: 'Sýslumannsembætti',
    description: 'Information',
  },
  pickupLocationTitle: {
    id: 'dl.application:pickupLocationTitle',
    defaultMessage: 'Afhendingarstaður',
    description: 'location for pickup',
  },
  pickupLocationDescription: {
    id: 'dl.application:pickupLocationDescription',
    defaultMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    description: 'location for pickup',
  },
  deliveryMethodHeader: {
    id: 'dl.application:deliveryMethodHeader',
    defaultMessage: 'Hvernig vilt þú fá plastökuskírteini þitt afhent?',
    description: 'Where do you want to pick up your driving license?',
  },
  informationApplicant: {
    id: 'dl.application:information.applicant',
    defaultMessage: 'Umsækjandi',
    description: 'Applicant',
  },
  informationApplicantDescription: {
    id: 'dl.application:information.applicantDescription',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingar hér að neðan til að staðfesta að þær séu réttar.',
    description: '',
  },
  healthDeclarationSectionTitle: {
    id: 'dl.application:healthDeclarationSection.title',
    defaultMessage: 'Læknisvottorð',
    description: 'Health declaration',
  },
  healthDeclarationMultiFieldTitle: {
    id: 'dl.application:healthDeclarationMultiField.title',
    defaultMessage: 'Læknisvottorð',
    description: 'Health declaration',
  },
  healthDeclarationMultiField65Description: {
    id: 'dl.application:healthDeclarationMultiField65Description#markdown',
    defaultMessage:
      'Þú þarft að skila inn læknisvottorði vegna ökuleyfis til að endurnýja ökuskírteini þitt. Læknisvottorðið þarf að vera frá **heimilislækni** og vegna ökuleyfis. Þegar búið er að ljúka umsókn þarf að skila inn læknisvottorði á valið sýslumannsembætti til að hægt sé að panta skírteinið.  **Athugið að skírteinið verður ekki pantað fyrr en búið er að skila inn vottorði.**',
    description: 'Health declaration',
  },
  healthDeclarationMultiField65DescriptionRedesigned: {
    id: 'dl.application:healthDeclarationMultiField65DescriptionRedesigned#markdown',
    defaultMessage:
      'Þú þarft að skila inn læknisvottorði vegna ökuleyfis til að endurnýja ökuskírteini þitt. Læknisvottorðið þarf að vera frá **heimilislækni** og má ekki vera eldra en 3 mánaða. Hladdu vottorðinu hér að neðan til að halda áfram með umsóknina. Starfsmaður mun fara yfir vottorðið og samþykkja það áður en nýtt skírteini er pantað.',
    description:
      'Health declaration intro for 65+ renewal redesigned flow (in-app upload)',
  },
  healthDeclarationMultiFieldSubTitle: {
    id: 'dl.application:healthDeclarationMultiField.subTitle',
    defaultMessage: 'Yfirlýsing um líkamlegt og andlegt heilbrigði',
    description: 'Statement of physical and mental health',
  },
  healthDeclarationSubTitle: {
    id: 'dl.application:healthDeclarationSubTitle',
    defaultMessage:
      'Ef einhverri spurningu er svarað játandi í heilbrigðisyfirlýsingu þarf læknisvottorð frá heimilislækni eða viðeigandi sérfræðilækni.',
    description: '',
  },
  alertHealthDeclarationGlassesMismatch: {
    id: 'dl.application:alertHealthDeclarationGlassesMismatch',
    defaultMessage:
      'Athugaðu að þar sem breyting hefur orðið á sjón síðan síðast var sótt um ökuskírteini þarftu að skila vottorði frá heimilislækni þess efnis.',
    description: '',
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
    defaultMessage: 'Heimilisfang',
    description: 'Street address',
  },
  overviewEmail: {
    id: 'dl.application:overview.email',
    defaultMessage: 'Netfang',
    description: 'Email',
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
  qualityPhotoInstructionBullets: {
    id: 'dl.application:qualityPhoto.instructionbullets#markdown',
    defaultMessage:
      '* Myndin skal vera andlitsmynd, tekin þannig að andlitið snúi beint að myndavél og bæði augu sjáist.\n* Umsækjandi má ekki bera höfuðfat. Þó má heimila slíkt ef umsækjandi fer fram á það af trúarástæðum.\n* Lýsing andlits þarf að vera jöfn og góð.\n* Umsækjandi má ekki bera dökk gleraugu eða gleraugu með speglun.\n* Myndin skal vera jafnlýst, bakgrunnur ljósgrár, hlutlaus og án skugga.\n* Ljósmyndin þarf að vera prentuð á ljósmyndapappír og 35x45mm að stærð.',
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
  overviewPickupPost: {
    id: 'dl.application:overview.pickupPost',
    defaultMessage: 'Sent heim í pósti',
    description: 'By mail',
  },
  overviewPickupDistrict: {
    id: 'dl.application:overview.pickupDistrict',
    defaultMessage: 'Sækja á afhendingarstað',
    description: 'Pickup location',
  },
  overviewPaymentChargeWithDelivery: {
    id: 'dl.application:overview.paymentChargeWithDelivery',
    defaultMessage: 'Greiðsla (sendingarkostnaður innifalinn)',
    description: 'Cost',
  },
  selectDistrictCommissionerPickup: {
    id: 'dl.application:selectDistrictCommissionerPickup',
    defaultMessage: 'Veldu afhendingarstað',
    description: 'Pickup for district commissioner',
  },
  districtCommissionerPickupPlaceholder: {
    id: 'dl.application:districtCommisionerPickupPlaceholder',
    defaultMessage: 'Veldu sýslumannsembætti',
    description: 'Choose district commissioner',
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
  informationFullName: {
    id: 'dl.application:informationFullName',
    defaultMessage: 'Nafn',
    description: 'Full Name',
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
  applicationForRenewalLicenseTitle: {
    id: 'dl.application:applicationForRenewalLicenseTitle',
    defaultMessage: 'Endurnýjun ökuskírteina fyrir 65 ára og eldri',
    description: 'Option title for selecting to renew driving license',
  },
  applicationForRenewalLicenseDescription: {
    id: 'dl.application:applicationForRenewalLicenseDescription',
    defaultMessage:
      'Umsókn um endurnýjun ökuréttinda í B flokki (fólksbifreið), fyrir 65 ára og eldri.',
    description: 'Option description for selecting to renew driving license',
  },
  applicationForBFullDescription: {
    id: 'dl.application:applicationForBFullDescription',
    defaultMessage: 'Umsókn um fullnaðarréttindi í B flokki (fólksbifreið)',
    description: 'Option description for selecting to renew driving license',
  },
  countryDirectionsTitle: {
    id: 'dl.application:countryDirectionsTitle',
    defaultMessage: 'Leiðbeiningar',
    description:
      'Title of the section that explains the next steps when they have a driving license in a different country',
  },
  phoneNumberTitle: {
    id: 'dl.application:phoneNumberTitle',
    defaultMessage: 'Símanúmer',
    description: 'Phone number',
  },
  photoSelectionTitle: {
    id: 'dl.application:photoSelection.title',
    defaultMessage: 'Mynd í ökuskírteini',
    description: 'Photo selection section title',
  },
  photoSelectionDescription: {
    id: 'dl.application:photoSelection.description',
    defaultMessage:
      'Hér fyrir neðan eru upplýsingar um þær myndir sem hægt er að nota í ökuskírteinið.',
    description: 'Photo selection section description',
  },
  usePassportImage: {
    id: 'dl.application:photoSelection.usePassportImage#markdown',
    defaultMessage:
      'Ég staðfesti að nota núverandi mynd úr vegabréfa- og skilríkjaskrá í ökuskírteinið',
    description: 'Use photo from national registry',
  },
  useDriversLicenseImage: {
    id: 'dl.application:photoSelection.useDriversLicenseImage#markdown',
    defaultMessage:
      'Ég staðfesti að nota núverandi mynd úr ökuskírteinaskrá í ökuskírteinið',
    description: 'Use photo from driving license registry',
  },
  healthCertificateTitle: {
    id: 'dl.application:healthCertificate.title',
    defaultMessage: 'Læknisvottorð',
    description: 'Health certificate title',
  },
  healthCertificateDescription: {
    id: 'dl.application:healthCertificate.description',
    defaultMessage:
      'Þú þarft að hlaða inn læknisvottorði vegna heilbrigðisyfirlýsingar.',
    description: 'Health certificate upload description',
  },
  healthCertificateUploadHeader: {
    id: 'dl.application:healthCertificate.uploadHeader',
    defaultMessage: 'Dragðu læknisvottorð hingað til að hlaða upp',
    description: 'Health certificate upload header',
  },
  healthCertificateUploadDescription: {
    id: 'dl.application:healthCertificate.uploadDescription',
    defaultMessage:
      'Tekið er við skjölum með endingunum: .pdf, .jpg, .jpeg, .png',
    description: 'Health certificate upload format description',
  },
  healthCertificateUploadButtonLabel: {
    id: 'dl.application:healthCertificate.uploadButtonLabel',
    defaultMessage: 'Velja skjöl til að hlaða upp',
    description: 'Health certificate upload button label',
  },
  overviewHealthCertificateUploaded: {
    id: 'dl.application:overview.healthCertificateUploaded',
    defaultMessage: 'Læknisvottorð hlaðið upp',
    description: 'Uploaded health certificate',
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
  examplePaymentPendingFieldError: {
    id: 'dl.application:example.waitingForPaymentError',
    defaultMessage: 'Villa kom upp við að sækja upplýsingar um greiðslu',
    description: 'An error came up while getting payment information',
  },
  forwardingToPayment: {
    id: 'dl.application:forwardingToPayment',
    defaultMessage: 'Sendi þig áfram á greiðsluveitu...',
    description: 'Forwarding you to payment handler...',
  },
  paymentPendingDescription: {
    id: 'dl.application:paymentPendingDescription',
    defaultMessage: 'Augnablik meðan beðið er eftir staðfestingu',
    description: 'Please wait until the payment is confirmed',
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
  healthRemarksTitle: {
    id: 'dl.application:healthRemarksTitle',
    defaultMessage: 'Athugið',
    description: 'Alert message title for health remarks on driving license',
  },
  healthRemarksDescription: {
    id: 'dl.application:healthRemarksDescriptionV2',
    defaultMessage:
      'Ef tákntala vegna heilsufars er skráð á núverandi ökuskírteini, skal ávallt skila læknisvottorði jafnvel þótt öllum heilbrigðisspurningum sé svarað neitandi í þessari umsókn. Tákntölur eru m.a. notaðar fyrir gleraugu/sjónleiðréttingu, sérútbúin ökutæki o.fl.',
    description: 'Alert message for health remarks on driving license',
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
      'Þú þarft að hafa búið að minnsta kosti 185 daga af síðustu 365 dögum á Íslandi til að geta sótt um ökuskírteini.',
    description: 'requirement unmet api returned false',
  },
  currentLocalResidencyDescription: {
    id: 'dl.application:requirementunmet.currentLocalResidencyDescription',
    defaultMessage:
      'Þú þarft að hafa búsetu á Íslandi til að geta sótt um fullnaðarskírteini.',
    description: 'requirement unmet api returned false',
  },
  // Used by both BE and redesigned 65+ flows when no usable photo (Þjóðskrá
  // facial photo or RLS quality photo) is available.
  beLicenseQualityPhotoTitle: {
    id: 'dl.application:requirementunmet.beLicenseQualityPhotoTitle',
    defaultMessage: 'Gæðavottuð mynd',
    description:
      'requirement unmet api returned false for an unspecified reason',
  },
  beLicenseQualityPhotoDescription: {
    id: 'dl.application:requirementunmet.beLicenseQualityPhotoDescriptionV2',
    defaultMessage:
      'Ef hvorki er hægt að nota mynd sem uppfyllir skilyrði úr skilríkjaskrá né ökutækjaskrá, verður þú að koma með passamynd á ljósmyndapappír (4,5 cm x 3,5 cm) til næsta sýslumannsembættis og skila inn umsókn á staðnum. Ef fyrra ökuskírteini var gefið út fyrir júlí 2013 þarf að uppfæra myndina.',
    description: 'BE quality photo requirement description',
  },
  noExtendedDrivingLicenseTitle: {
    id: 'dl.application:requirementunmet.noExtendedDrivingLicenseTitle',
    defaultMessage: 'Ekki hægt að sækja um endurnýjun á 65+ ökuskírteini.',
    description: 'requirement unmet 65 plus renewal',
  },
  noExtendedDrivingLicenseDescription: {
    id: 'dl.application:requirementunmet.noExtendedDrivingLicenseDescription#markdown',
    defaultMessage: 'Ekki hægt að sækja um endurnýjun á 65+ ökuskírteini.',
    description: 'requirement unmet 65 plus renewal',
  },
})
