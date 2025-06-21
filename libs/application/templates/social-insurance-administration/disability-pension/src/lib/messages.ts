import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const disabilityPensionFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'ol.application:application.title',
      defaultMessage: 'Umsókn um örorkulífeyri',
      description: 'Application for disability pension',
    },
  }),
  prerequisites: defineMessages({
    title: {
      id: 'ol.application:prerequisites.title',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
  }),
  basicInfo: defineMessages({
    title: {
      id: 'ol.application:basicInfo.title',
      defaultMessage: 'Almennar upplýsingar',
      description: 'Basic informatino',
    },
    personalInfo: {
      id: 'ol.application:basicInfo.personalInfo',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Personal information',
    },
    personalInfoInstructions: {
      id: 'ol.application:basicInfo.personalInfoInstructions',
      defaultMessage: 'Vinsamlegast farið yfir netfang og símanúmer til að tryggja að þær upplýsingar séu réttar. Netfangi er breytt hér. Athugið að ef að aðrar upplýsingar eru ekki réttar þarft þú að hafa samband við Þjóðskrá og fara fram á breytingu.',
      description: 'Instructions for personal information',
    },
    paymentInfo: {
      id: 'ol.application:basicInfo.paymentInfo',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    incomePlanInstructionsTitle: {
      id: 'ol.application:basicInfo.incomePlanInstructionsTitle',
      defaultMessage: 'Tekjuáætlun - Leiðbeiningar',
      description: 'Instructions for income plan',
    },
    incomePlanTitle: {
      id: 'ol.application:basicInfo.incomePlanTitle',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income plan',
    },
    disabilityEvaluationTitle: {
      id: 'ol.application:basicInfo.disabilityEvaluationTitle',
      defaultMessage: 'Örorkumat',
      description: 'Disability evaluation',
    },
    employmentParticipationTitle: {
      id: 'ol.application:basicInfo.employmentParticipationTitle',
      defaultMessage: 'Atvinnuþáttaka',
      description: 'Employment participation',
    },
    relatedApplicationsTitle: {
      id: 'ol.application:basicInfo.relatedApplicationsTitle',
      defaultMessage: 'Tengdar umsóknir',
      description: 'Related applications',
    },
  }),
  personalInfo : defineMessages({
    nationalId: {
      id: 'ol.application:basicInfo.personalInfo.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: 'ol.application:basicInfo.personalInfo.address',
      defaultMessage: 'Heimili/póstfang',
      description: 'Address',
    },
    name: {
      id: 'ol.application:basicInfo.personalInfo.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    email: {
      id: 'ol.application:basicInfo.personalInfo.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phone: {
      id: 'ol.application:basicInfo.personalInfo.phone',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    postcode: {
      id: 'ol.application:basicInfo.personalInfo.postCode',
      defaultMessage: 'Póstnúmer',
      description: 'Post code',
    },
    municipality: {
      id: 'ol.application:basicInfo.personalInfo.municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
    maritalStatusTitle: {
      id: 'ol.application:basicInfo.personalInfo.maritalStatusTitle',
      defaultMessage: 'Hjúskaparstaða þín',
      description: 'Your marital status',
    },
    maritalStatus: {
      id: 'ol.application:basicInfo.personalInfo.maritalStatus',
      defaultMessage: 'Hjúskaparstaða',
      description: 'Marital status',
    },
    spouseName: {
      id: 'ol.application:basicInfo.personalInfo.spouseName',
      defaultMessage: 'Nafn maka',
      description: 'Spouse name',
    },
    spouseNationalId: {
      id: 'ol.application:basicInfo.personalInfo.spouseNationalId',
      defaultMessage: 'Kennitala maka',
      description: 'Spouse national ID',
    },
  }),
  paymentInfo: defineMessages({
    title: {
      id: 'ol.application:paymentInfo.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    noticeTitle: {
      id: 'ol.application:paymentInfo.noticeTitle',
      defaultMessage: 'Til athugunar!',
      description: 'Notice title',
    },
    notice: {
      id: 'ol.application:paymentInfo.notice',
      defaultMessage: `Allar þínar greiðslur frá Tryggingastofnun eru greiddar inná bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inná þann reikning.<br/>
      Mikilvægt er að bankaupplýsingarnar séu réttar. Gott er að hafa sambvand við viðskiptabanka sinn til að ganga úr skugga um að upplýsingarnar séu réttar ásamt því að fá upplýsingar um ÍBAN-númer og SWIFT-númer.<br/>
      Vinsamlegast athugið að greiðslur inn á erlenda reiknginga geta tekið 3-4 daga. Banki sem sér um millifærslu leggur á þjónustugjald fyrir millifærslunni.`,
      description: 'TODO',
    },
    accountType: {
      id: 'ol.application:paymentInfo.accountType',
      defaultMessage: 'Tegund reiknings',
      description: 'Account type',
    },
    domesticAccount: {
      id: 'ol.application:paymentInfo.domesticAccount',
      defaultMessage: 'Íslenskur reikningur',
      description: 'Domestic account',
    },
    foreignAccount: {
      id: 'ol.application:paymentInfo.foreignAccount',
      defaultMessage: 'Erlendur reikningur',
      description: 'Foreign account',
    },
    bank: {
      id: 'ol.application:paymentInfo.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
    useDiscount: {
      id: 'ol.application:paymentInfo.useDiscount',
      defaultMessage: 'Vilt þú nýta þér persónuafsláttinn þinn?',
      description: 'Do you want to use your personal discount?',
    },
    taxationLevel: {
      id: 'ol.application:paymentInfo.taxationLevel',
      defaultMessage: 'Skattþrep',
      description: 'Taxation level',
    },
    taxationLevelOptionOne: {
      id: 'ol.application:paymentInfo.taxationLevelOptionOne',
      defaultMessage: 'Ég vil að viðeigandi skattþrep sé reiknað út frá öðrum tekjum sem ég er með',
      description: 'Taxation level option 1',
    },
    taxationLevelOptionTwo: {
      id: 'ol.application:paymentInfo.taxationLevelOptionTwo',
      defaultMessage: 'Ég vil að miðað sé við Skattþrep 1 í útreikningum staðgreiðslu (31,45% af tekjum: 0 - 409.986 kr.)',
      description: 'Taxation level option 2',
    },
    taxationLevelOptionThree: {
      id: 'ol.application:paymentInfo.taxationLevelOptionThree',
      defaultMessage: 'Ég vil að miðað sé við Skattþrep 2 í útreikningum staðgreiðslu (37,95% af tekjum: 409.986 - 1.151.012 kr.)',
      description: 'Taxation level option 3',
    },
    yes: {
      id: 'ol.application:paymentInfo.yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'ol.application:paymentInfo.no',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),
  incomePlan: defineMessages({
    instructionsTitle: {
      id: 'ol.application:incomePlan.instructionsTitle',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income plan',
    },
    instructionsDescription: {
      id: 'ol.application:incomePlan.instructionsDescription',
      defaultMessage: 'Leiðbeiningar um skráningu tekjuáætlunar',
    },
    instructionBullet1: {
      id: 'ol.application:incomePlan.instructionBullet1',
      defaultMessage: '* Skrá skal heildartekjur fyrir skatt í tekjuáætlun.',
      description: 'Total income before tax must be recorded in income plan',
    },
    instructionBullet2: {
      id: 'ol.application:incomePlan.instructionBullet2',
      defaultMessage: '* Fjármagnstekjur eru sameignlegar hjá hjónum/sambúðarfólki og skal skrá heildar fjármagnstekjur hjóna/sambúðarfólks í tekjuáætlun.',
      description: 'Capital income is joint for spouses/cohabitants and total capital income should be recorded',
    },
    instructionBullet3: {
      id: 'ol.application:incomePlan.instructionBullet3',
      defaultMessage: '* Ef maki er á lífeyri verða greiðslur hans einnig endurreiknaðar ef fjármagnstekjum er breytt.',
      description: 'If spouse is on pension, their payments will also be recalculated if capital income changes',
    },
    instructionBullet4: {
      id: 'ol.application:incomePlan.instructionBullet4',
      defaultMessage: '* Heimilt er að skrá atvinnutekjur á þá mánuði sem þeirra er aflað. Reiknast þá þær atvinnutekjur eingöngu í þeim mánuði. Vakin er athygli á að það þarf að haka sérstaklega við þann kost að óska eftir mánaðarskiptingu atvinnutekna í tekjuáætlun.',
      description: 'Employment income can be recorded for specific months when earned, requiring special selection for monthly division',
    },
    instructionBullet5: {
      id: 'ol.application:incomePlan.instructionBullet5',
      defaultMessage: '* Laun / lífeyrisgreiðslur skal skrá í þeim gjaldmiðli sem þau eru greidd.',
      description: 'Wages and pension payments should be recorded in the currency they are paid in',
    },
    instructionBullet6: {
      id: 'ol.application:incomePlan.instructionBullet6',
      defaultMessage: '* Það er á ábyrgð umsækjanda að tekjuáætlun sé rétt og að nauðsynlegar upplýsingar liggi fyrir til að hægt sé að ákvarða réttar greiðslur.',
      description: 'It is the applicants responsibility that income plan is correct and necessary information is available',
    },
  }),
  disabilityEvaluation: defineMessages({
    title: {
      id: 'ol.application:disabilityEvaluation.title',
      defaultMessage: 'Sótt um örorkumat hjá lífeyrissjóði',
      description: 'Applied for disability evaluation at pension fund',
    },
    description: {
      id: 'ol.application:disabilityEvaluation.description',
      defaultMessage: 'Þú þarft að sækja um örorkumat frá lífeyrissjóði og senda staðfestingu á því til Tryggingarstofnunar. Ef þú átt þessa staðfestingu, þá getur þú sett hana inn sem viðhengi hér að neðan. Umsóknarferli þitt um örorkumat getur farið fram þó þú sért ekki búinn að sækja um örorkumat hjá lífeyrissjóði. En greiðslur fyrir örorku geta ekki farið fram fyrr en þessi staðfesting liggur fyrir.',
      description: 'Description for disability evaluation process',
    },
    appliedBeforeTitle: {
      id: 'ol.application:disabilityEvaluation.appliedBeforeTitle',
      defaultMessage: 'Hefur þú sótt um örorkumat hjá lífeyrissjóði?',
      description: 'Have you applied for disability evaluation at pension fund?',
    },
    appliedBeforeDescription: {
      id: 'ol.application:disabilityEvaluation.appliedBeforeDescription',
      defaultMessage: 'Ef þú hefur sótt um örorkumat hjá lífeyrissjóði, þá getur þú sett hana inn sem viðhengi hér að neðan.',
      description: 'If you have applied for disability evaluation at pension fund, you can attach it below',
    },
    fileUploadTitle: {
      id: 'ol.application:disabilityEvaluation.fileUploadTitle',
      defaultMessage: 'Hlaða inn staðfestingu',
      description: 'Upload confirmation',
    },
    uploadButtonLabel: {
      id: 'ol.application:disabilityEvaluation.uploadButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Choose files to upload',
    },
    tabTitle: {
      id: 'ol.application:disabilityEvaluation.tabTitle',
      defaultMessage: 'Örorkumat',
      description: 'Disability evaluation',
    },
    yes: {
      id: 'ol.application:disabilityEvaluation.yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'ol.application:disabilityEvaluation.no',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),
  employmentParticipation: defineMessages({
    tabTitle: {
      id: 'ol.application:employmentParticipation.tabTitle',
      defaultMessage: 'Atvinnuþátttaka',
      description: 'Employment participation',
    },
    title: {
      id: 'ol.application:employmentParticipation.title',
      defaultMessage: 'Atvinnuþátttaka',
      description: 'Employment participation',
    },
    inPaidWorkTitle: {
      id: 'ol.application:employmentParticipation.inPaidWorkTitle',
      defaultMessage: 'Ertu í launuðu starfi?',
      description: 'Are you in paid employment?',
    },
    yes: {
      id: 'ol.application:employmentParticipation.yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'ol.application:employmentParticipation.no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    dontKnow: {
      id: 'ol.application:employmentParticipation.dontKnow',
      defaultMessage: 'Veit ekki',
      description: "Don't know",
    },
    continuedWorkTitle: {
      id: 'ol.application:employmentParticipation.continuedWorkTitle',
      defaultMessage: 'Stefnir þú á áframhaldandi atvinnuþáttöku?',
      description: 'Do you aim for continued employment participation - TODO?',
    },
    continuedWorkQuestion: {
      id: 'ol.application:employmentParticipation.continuedWorkQuestion',
      defaultMessage: 'Stefnir þú á áframhaldandi atvinnuþáttöku?',
      description: 'Do you aim for continued employment participation - TODO?',
    },
  }),
}
