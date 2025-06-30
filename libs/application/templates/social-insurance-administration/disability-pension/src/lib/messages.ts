import { defineMessages, MessageDescriptor } from 'react-intl'
import { remove } from 'winston'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const disabilityPensionFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'dp.application:application.title',
      defaultMessage: 'Umsókn um örorkulífeyri',
      description: 'Application for disability pension',
    },

  }),
  prerequisites: defineMessages({
    title: {
      id: 'dp.application:prerequisites.title',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
  }),
  basicInfo: defineMessages({
    title: {
      id: 'dp.application:basicInfo.title',
      defaultMessage: 'Almennar upplýsingar',
      description: 'Basic information',
    },
    personalInfo: {
      id: 'dp.application:basicInfo.personalInfo',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Personal information',
    },
    personalInfoInstructions: {
      id: 'dp.application:basicInfo.personalInfoInstructions',
      defaultMessage: 'Vinsamlegast farið yfir netfang og símanúmer til að tryggja að þær upplýsingar séu réttar. Netfangi er breytt hér. Athugið að ef að aðrar upplýsingar eru ekki réttar þarft þú að hafa samband við Þjóðskrá og fara fram á breytingu.',
      description: 'Instructions for personal information',
    },
    paymentInfo: {
      id: 'dp.application:basicInfo.paymentInfo',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    incomePlanInstructionsTitle: {
      id: 'dp.application:basicInfo.incomePlanInstructionsTitle',
      defaultMessage: 'Tekjuáætlun - Leiðbeiningar',
      description: 'Instructions for income plan',
    },
    incomePlanTitle: {
      id: 'dp.application:basicInfo.incomePlanTitle',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income plan',
    },
    disabilityEvaluationTitle: {
      id: 'dp.application:basicInfo.disabilityEvaluationTitle',
      defaultMessage: 'Örorkumat',
      description: 'Disability evaluation',
    },
    employmentParticipationTitle: {
      id: 'dp.application:basicInfo.employmentParticipationTitle',
      defaultMessage: 'Atvinnuþáttaka',
      description: 'Employment participation',
    },
    relatedApplicationsTitle: {
      id: 'dp.application:basicInfo.relatedApplicationsTitle',
      defaultMessage: 'Tengdar umsóknir',
      description: 'Related applications',
    },
  }),
  personalInfo : defineMessages({
    nationalId: {
      id: 'dp.application:basicInfo.personalInfo.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: 'dp.application:basicInfo.personalInfo.address',
      defaultMessage: 'Heimili/póstfang',
      description: 'Address',
    },
    name: {
      id: 'dp.application:basicInfo.personalInfo.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    email: {
      id: 'dp.application:basicInfo.personalInfo.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phone: {
      id: 'dp.application:basicInfo.personalInfo.phone',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    postcode: {
      id: 'dp.application:basicInfo.personalInfo.postCode',
      defaultMessage: 'Póstnúmer',
      description: 'Post code',
    },
    municipality: {
      id: 'dp.application:basicInfo.personalInfo.municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
    maritalStatusTitle: {
      id: 'dp.application:basicInfo.personalInfo.maritalStatusTitle',
      defaultMessage: 'Hjúskaparstaða þín',
      description: 'Your marital status',
    },
    maritalStatus: {
      id: 'dp.application:basicInfo.personalInfo.maritalStatus',
      defaultMessage: 'Hjúskaparstaða',
      description: 'Marital status',
    },
    spouseName: {
      id: 'dp.application:basicInfo.personalInfo.spouseName',
      defaultMessage: 'Nafn maka',
      description: 'Spouse name',
    },
    spouseNationalId: {
      id: 'dp.application:basicInfo.personalInfo.spouseNationalId',
      defaultMessage: 'Kennitala maka',
      description: 'Spouse national ID',
    },
  }),
  paymentInfo: defineMessages({
    title: {
      id: 'dp.application:paymentInfo.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    noticeTitle: {
      id: 'dp.application:paymentInfo.noticeTitle',
      defaultMessage: 'Til athugunar!',
      description: 'Notice title',
    },
    notice: {
      id: 'dp.application:paymentInfo.notice',
      defaultMessage: `Allar þínar greiðslur frá Tryggingastofnun eru greiddar inná bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inná þann reikning.<br/>
      Mikilvægt er að bankaupplýsingarnar séu réttar. Gott er að hafa sambvand við viðskiptabanka sinn til að ganga úr skugga um að upplýsingarnar séu réttar ásamt því að fá upplýsingar um ÍBAN-númer og SWIFT-númer.<br/>
      Vinsamlegast athugið að greiðslur inn á erlenda reiknginga geta tekið 3-4 daga. Banki sem sér um millifærslu leggur á þjónustugjald fyrir millifærslunni.`,
      description: 'TODO',
    },
    accountType: {
      id: 'dp.application:paymentInfo.accountType',
      defaultMessage: 'Tegund reiknings',
      description: 'Account type',
    },
    domesticAccount: {
      id: 'dp.application:paymentInfo.domesticAccount',
      defaultMessage: 'Íslenskur reikningur',
      description: 'Domestic account',
    },
    foreignAccount: {
      id: 'dp.application:paymentInfo.foreignAccount',
      defaultMessage: 'Erlendur reikningur',
      description: 'Foreign account',
    },
    foreignAccountNotice: {
      id: 'dp.application:paymentInfo.foreignAccountNotice',
      defaultMessage: 'Ef þú ert með erlendan bankareikning sér Tryggingastofnun um að millifæra greiðslur. Greiðslurnar samræmast milliríkjasamningi Íslands við EES, Bandaríkin og Kanada og verður reikningur því að vera skráður í þeim löndum (?). Millifærslur á erlenda reikninga fara í gegnum viðskiptabanka til erlendra banka, sem getur falið í sér kostnað vegna millifærslu. Einnig getur það falið í sér gengistap. Því er almennt dýrara að fá lífeyrisgreiðslur greiddar inn á erlendan reikning . ',
      description: 'TODO',
    },
    bank: {
      id: 'dp.application:paymentInfo.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
    personalAllowance: {
      id: 'dp.application:paymentInfo.personalAllowance',
      defaultMessage: 'Vilt þú nýta þér persónuafsláttinn þinn?',
      description: 'Do you want to use your personal allowance',
    },
    taxationLevel: {
      id: 'dp.application:paymentInfo.taxationLevel',
      defaultMessage: 'Skattþrep',
      description: 'Taxation level',
    },
    taxationLevelOptionOne: {
      id: 'dp.application:paymentInfo.taxationLevelOptionOne',
      defaultMessage: 'Ég vil að viðeigandi skattþrep sé reiknað út frá öðrum tekjum sem ég er með',
      description: 'Taxation level option 1',
    },
    taxationLevelOptionTwo: {
      id: 'dp.application:paymentInfo.taxationLevelOptionTwo',
      defaultMessage: 'Ég vil að miðað sé við Skattþrep 1 í útreikningum staðgreiðslu (31,45% af tekjum: 0 - 409.986 kr.)',
      description: 'Taxation level option 2',
    },
    taxationLevelOptionThree: {
      id: 'dp.application:paymentInfo.taxationLevelOptionThree',
      defaultMessage: 'Ég vil að miðað sé við Skattþrep 2 í útreikningum staðgreiðslu (37,95% af tekjum: 409.986 - 1.151.012 kr.)',
      description: 'Taxation level option 3',
    },
    yes: {
      id: 'dp.application:paymentInfo.yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'dp.application:paymentInfo.no',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),
  incomePlan: defineMessages({
    instructionsTitle: {
      id: 'dp.application:incomePlan.instructionsTitle',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income plan',
    },
    instructionsDescription: {
      id: 'dp.application:incomePlan.instructionsDescription',
      defaultMessage: 'Leiðbeiningar um skráningu tekjuáætlunar',
      description: 'Instructions for recording income plan',
    },
    instructionBullet1: {
      id: 'dp.application:incomePlan.instructionBullet1',
      defaultMessage: '* Skrá skal heildartekjur fyrir skatt í tekjuáætlun.',
      description: 'Total income before tax must be recorded in income plan',
    },
    instructionBullet2: {
      id: 'dp.application:incomePlan.instructionBullet2',
      defaultMessage: '* Fjármagnstekjur eru sameignlegar hjá hjónum/sambúðarfólki og skal skrá heildar fjármagnstekjur hjóna/sambúðarfólks í tekjuáætlun.',
      description: 'Capital income is joint for spouses/cohabitants and total capital income should be recorded',
    },
    instructionBullet3: {
      id: 'dp.application:incomePlan.instructionBullet3',
      defaultMessage: '* Ef maki er á lífeyri verða greiðslur hans einnig endurreiknaðar ef fjármagnstekjum er breytt.',
      description: 'If spouse is on pension, their payments will also be recalculated if capital income changes',
    },
    instructionBullet4: {
      id: 'dp.application:incomePlan.instructionBullet4',
      defaultMessage: '* Heimilt er að skrá atvinnutekjur á þá mánuði sem þeirra er aflað. Reiknast þá þær atvinnutekjur eingöngu í þeim mánuði. Vakin er athygli á að það þarf að haka sérstaklega við þann kost að óska eftir mánaðarskiptingu atvinnutekna í tekjuáætlun.',
      description: 'Employment income can be recorded for specific months when earned, requiring special selection for monthly division',
    },
    instructionBullet5: {
      id: 'dp.application:incomePlan.instructionBullet5',
      defaultMessage: '* Laun / lífeyrisgreiðslur skal skrá í þeim gjaldmiðli sem þau eru greidd.',
      description: 'Wages and pension payments should be recorded in the currency they are paid in',
    },
    instructionBullet6: {
      id: 'dp.application:incomePlan.instructionBullet6',
      defaultMessage: '* Það er á ábyrgð umsækjanda að tekjuáætlun sé rétt og að nauðsynlegar upplýsingar liggi fyrir til að hægt sé að ákvarða réttar greiðslur.',
      description: 'It is the applicants responsibility that income plan is correct and necessary information is available',
    },
  }),
  disabilityEvaluation: defineMessages({
    title: {
      id: 'dp.application:disabilityEvaluation.title',
      defaultMessage: 'Sótt um örorkumat hjá lífeyrissjóði',
      description: 'Applied for disability evaluation at pension fund',
    },
    description: {
      id: 'dp.application:disabilityEvaluation.description',
      defaultMessage: 'Þú þarft að sækja um örorkumat frá lífeyrissjóði og senda staðfestingu á því til Tryggingarstofnunar. Ef þú átt þessa staðfestingu, þá getur þú sett hana inn sem viðhengi hér að neðan. Umsóknarferli þitt um örorkumat getur farið fram þó þú sért ekki búinn að sækja um örorkumat hjá lífeyrissjóði. En greiðslur fyrir örorku geta ekki farið fram fyrr en þessi staðfesting liggur fyrir.',
      description: 'Description for disability evaluation process',
    },
    appliedBeforeTitle: {
      id: 'dp.application:disabilityEvaluation.appliedBeforeTitle',
      defaultMessage: 'Hefur þú sótt um örorkumat hjá lífeyrissjóði?',
      description: 'Have you applied for disability evaluation at pension fund?',
    },
    appliedBeforeDescription: {
      id: 'dp.application:disabilityEvaluation.appliedBeforeDescription',
      defaultMessage: 'Ef þú hefur sótt um örorkumat hjá lífeyrissjóði, þá getur þú sett hana inn sem viðhengi hér að neðan.',
      description: 'If you have applied for disability evaluation at pension fund, you can attach it below',
    },
    fileUploadTitle: {
      id: 'dp.application:disabilityEvaluation.fileUploadTitle',
      defaultMessage: 'Hlaða inn staðfestingu',
      description: 'Upload confirmation',
    },
    uploadButtonLabel: {
      id: 'dp.application:disabilityEvaluation.uploadButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Choose files to upload',
    },
    tabTitle: {
      id: 'dp.application:disabilityEvaluation.tabTitle',
      defaultMessage: 'Örorkumat',
      description: 'Disability evaluation',
    },
    yes: {
      id: 'dp.application:disabilityEvaluation.yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'dp.application:disabilityEvaluation.no',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),
  employmentParticipation: defineMessages({
    title: {
      id: 'dp.application:employmentParticipation.title',
      defaultMessage: 'Atvinnuþátttaka',
      description: 'Employment participation',
    },
    inPaidWorkTitle: {
      id: 'dp.application:employmentParticipation.inPaidWorkTitle',
      defaultMessage: 'Ertu í launuðu starfi?',
      description: 'Are you in paid employment?',
    },
    yes: {
      id: 'dp.application:employmentParticipation.yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'dp.application:employmentParticipation.no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    dontKnow: {
      id: 'dp.application:employmentParticipation.dontKnow',
      defaultMessage: 'Veit ekki',
      description: "Don't know",
    },
    continuedWorkTitle: {
      id: 'dp.application:employmentParticipation.continuedWorkTitle',
      defaultMessage: 'Stefnir þú á áframhaldandi atvinnuþáttöku?',
      description: 'Do you aim for continued employment participation - TODO?',
    },
    continuedWorkQuestion: {
      id: 'dp.application:employmentParticipation.continuedWorkQuestion',
      defaultMessage: 'Stefnir þú á áframhaldandi atvinnuþáttöku?',
      description: 'Do you aim for continued employment participation - TODO?',
    },
    livedAbroadTitle: {
      id: 'dp.application:employmentParticipation.livedAbroadTitle',
      defaultMessage: 'Búseta erlendis',
      description: 'Lived abroad',
    },
    livedAbroadDescription: {
      id: 'dp.application:employmentParticipation.livedAbroadDescription',
      defaultMessage: 'Hefur þú búið eða unnið erlendis?',
      description: 'Have you lived or worked abroad?',
    },
    livedAbroadQuestion: {
      id: 'dp.application:employmentParticipation.livedAbroadQuestion',
      defaultMessage: 'Hvar hefur þú dvalið og hversu lengi?',
      description: 'Have you lived abroad and how long?',
    },
    country: {
      id: 'dp.application:employmentParticipation.country',
      defaultMessage: 'Land',
      description: 'Country',
    },
    countryPlaceholder: {
      id: 'dp.application:employmentParticipation.countryPlaceholder',
      defaultMessage: 'Veldu land',
      description: 'Select country',
    },
    abroadNationalId: {
      id: 'dp.application:employmentParticipation.abroadNationalId',
      defaultMessage: 'Kennitala erlendis',
      description: 'National ID abroad',
    },
    period: {
      id: 'dp.application:employmentParticipation.period',
      defaultMessage: 'Tímabil',
      description: 'Period',
    },
    periodStart: {
      id: 'dp.application:employmentParticipation.periodStart',
      defaultMessage: 'Upphafsdagur',
      description: 'Start date',
    },
    periodStartPlaceholder: {
      id: 'dp.application:employmentParticipation.periodStartPlaceholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Select date',
    },
    periodEnd: {
      id: 'dp.application:employmentParticipation.periodEnd',
      defaultMessage: 'Lokadagur',
      description: 'End date',
    },
    periodEndPlaceholder: {
      id: 'dp.application:employmentParticipation.periodEndPlaceholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Select date',
    },
    addCountry: {
      id: 'dp.application:employmentParticipation.addCountry',
      defaultMessage: 'Bæta við landi',
      description: 'Add country',
    },
    save: {
      id: 'dp.application:employmentParticipation.save',
      defaultMessage: 'Vista',
      description: 'Save',
    },
    remove: {
      id: 'dp.application:employmentParticipation.remove',
      defaultMessage: 'Fjarlægja ',
      description: 'Remove',
    },
    abroadPaymentsTitle: {
      id: 'dp.application:employmentParticipation.abroadPaymentsTitle',
      defaultMessage: 'Færðu greiðslur frá öðru landi vegna heilsubrests eða óvinnufærni?',
      description: 'TODO',
    },
    abroadPaymentsDescription: {
      id: 'dp.application:employmentParticipation.abroadPaymentsDescription',
      defaultMessage: 'Rangar eða ófullnægjandi upplýsingar geta haft áhrif á afgreiðslu umsóknarinnar og hugsanlega leitt til endurkröfu eða annarra viðurlaga.',
      description: 'TODO',
    },
  }),
  backgroundInfo: defineMessages({
    title: {
      id: 'dp.application:backgroundInfo.title',
      defaultMessage: 'Bakgrunnur',
      description: 'Background',
    },
    description: {
      id: 'dp.application:backgroundInfo.description',
      defaultMessage: 'Bakgrunnsupplýsingar',
      description: 'Background information',
    },
  }),
  selfEvaluation: defineMessages({
    title: {
      id: 'dp.application:selfEvaluation.title',
      defaultMessage: 'Sjálfsmat',
      description: 'Self evaluation',
    },
  }),
  errors: defineMessages({
    emptyForeignResidence: {
      id: 'dp.application:errors.foreignResidenceRequired',
      defaultMessage: 'Nauðsynlegt er að bæta við a.m.k einni dvöl erlendis',
      description: 'You must add at least one foreign residence',
    },
    emptyCountry: {
      id: 'dp.application:errors.countryRequired',
      defaultMessage: 'Nauðsynlegt er að velja land',
      description: 'You must add at least one country',
    },
    emptyNationalId: {
      id: 'dp.application:errors.abroadNationalIdRequired',
      defaultMessage: 'Nauðsynlegt er að slá inn kennitölu í viðeigandi landi.',
      description: 'You must supply a foreign national id',
    },
    emptyStartDate: {
      id: 'dp.application:errors.startDateRequired',
      defaultMessage: 'Nauðsynlegt er að velja upphaf tímabils',
      description: 'You must select the start of period',
    },
    emptyEndDate: {
      id: 'dp.application:errors.endDateRequired',
      defaultMessage: 'Nauðsynlegt er að velja enda tímabils, og að dagsetningin sé á eftir upphafsdagsetningu',
      description: 'You must select the end of period. The end date must be after the start date.',
    },
  }),
}
