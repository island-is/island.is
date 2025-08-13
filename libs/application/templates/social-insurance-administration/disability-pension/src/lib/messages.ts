import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const disabilityPensionFormMessage: MessageDir = {
  shared: defineMessages({
    formTitle: {
      id: 'dp.application:title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    applicationTitle: {
      id: 'dp.application:application.title',
      defaultMessage: 'Umsókn um örorkulífeyri',
      description: 'Application for disability pension',
    },
    year: {
      id: 'dp.application:shared.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    chooseYear: {
      id: 'dp.application:shared.chooseYear',
      defaultMessage: 'Veldu ár',
      description: 'Select year',
    },
    month: {
      id: 'dp.application:shared.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    chooseMonth: {
      id: 'dp.application:shared.chooseMonth',
      defaultMessage: 'Veldu mánuð',
      description: 'Select month',
    },
  }),
  disabilityPensionCertificate: defineMessages({
    sectionTitle: {
      id: 'db.application:disability.pension.certificate.section.title',
      defaultMessage: 'Grunnvottorð / Vottorð um örorku',
      description: 'Certificate for Disability Pension',
    },
    description: {
      id: 'db.application:disability.pension.certificate.description',
      defaultMessage:
        'Forsenda fyrir greiðslum er að heilsubrestur einstaklings sé afleiðing af sjúkdómi, slysi eða áfalli. Grunnvottorð þarf að innihalda staðfestingu þess efnis.',
      description:
        'The prerequisite for payments is that the person’s health issues is the result of illness, accident or trauma. The Certificate for Sickness and Rehabilitation must contain confirmation to that effect.',
    },

    // Managed by
    managedBy: {
      id: 'db.application:disability.pension.certificate.managed.by',
      defaultMessage: 'Utanumhaldandi',
      description: 'Managed by',
    },
    managedByLocation: {
      id: 'db.application:disability.pension.certificate.managed.by.location',
      defaultMessage: 'Starfsstöð',
      description: 'Location',
    },

    // Information
    information: {
      id: 'db.application:disability.pension.certificate.information',
      defaultMessage: 'Upplýsingar',
      description: 'Information',
    },
    informationDateOfLastExamination: {
      id: 'db.application:disability.pension.certificate.information.date.of.last.examination',
      defaultMessage: 'Dagsetning síðustu skoðunar',
      description: 'Date of last examination',
    },
    informationDateOfCertificate: {
      id: 'db.application:disability.pension.certificate.information.date.of.certificate',
      defaultMessage: 'Dagsetning vottorðs',
      description: 'Date of certificate',
    },
    informationIncapacitatedDate: {
      id: 'db.application:disability.pension.certificate.information.incapacitated.date',
      defaultMessage:
        'Dagsetning þegar umsækjandi varð óvinnufær vegna núverandi heilsuvanda',
      description:
        'Date when the applicant became incapacitated due to current health problems',
    },
    informationICDAnalysis: {
      id: 'db.application:disability.pension.certificate.information.ICD.analysis',
      defaultMessage:
        'ICD greiningar sem valda megin heilsuvanda / óvinnufærni',
      description:
        'ICD analysis causing the main health issue / incapacitation',
    },
    informationOtherICDAnalysis: {
      id: 'db.application:disability.pension.certificate.information.other.ICD.analysis',
      defaultMessage:
        'Aðrar ICD greiningar sem valda heilsuvanda / óvinnufærni',
      description: 'Other ICD analysis causing health issue / incapacitation',
    },
    informationMedicalHistory: {
      id: 'db.application:disability.pension.certificate.information.medical.history',
      defaultMessage: 'Fyrri heilsufarssaga',
      description: 'Previous medical history',
    },
    informationCurrentStatus: {
      id: 'db.application:disability.pension.certificate.information.current.status',
      defaultMessage: 'Staða umsækjanda í dag',
      description: 'Applicant current status',
    },

    // Physical impairment
    physicalImpairment: {
      id: 'db.application:disability.pension.certificate.physical.impairment',
      defaultMessage: 'Líkamlegur vandi',
      description: 'Physical impairment',
    },
    physicalImpairmentTooltip: {
      id: 'db.application:disability.pension.certificate.physical.impairment.tooltip',
      defaultMessage:
        'Líkamlegur vandi vísar til skerðinga eða truflana á líkamlegri starfsemi eða uppbyggingu líkamans. Vandinn getur stafað af sjúkdómum, meiðslum eða öðrum líkamlegum áföllum. Slíkur vandi getur haft áhrif á hreyfigetu, líkamsstöðu, skynjun, kraft, verki eða aðra líkamlega eiginleika og þannig takmarkað getu einstaklings til að sinna daglegum athöfnum.',
      description:
        'A physical impairment refers to problem or disruption of the physical function or body structure. The impairment may be caused by illness, injury or other physical trauma. Such impairment may affect mobility, posture, sensation, strength, pain or other physical abilities and thus limit the person’s ability to perform daily activities.',
    },
    physicalImpairmentAffect: {
      id: 'db.application:disability.pension.certificate.physical.impairment.affect',
      defaultMessage: 'Hversu mikið hefur líkamlegur vandi áhrif á daglegt líf',
      description: 'How much does the physical impairment affect daily life',
    },
    physicalImpairmentExplanation: {
      id: 'db.application:disability.pension.certificate.physical.impairment.explanation',
      defaultMessage: 'Nánari útskýringar varðandi líkamlegan vanda',
      description: 'Further explanation of the physical impairment',
    },

    // Mental impairment
    mentalImpairment: {
      id: 'db.application:disability.pension.certificate.mental.impairment',
      defaultMessage: 'Andlegur vandi',
      description: 'Mental impairment',
    },
    mentalImpairmentTooltip: {
      id: 'db.application:disability.pension.certificate.mental.impairment.tooltip',
      defaultMessage:
        'Andlegur vandi vísar til skerðinga eða frávika í starfsemi hugans eða tilfinningalífs. Vandinn getur stafað af sjúkdómum, meiðslum eða öðrum áföllum. Slíkur vandi nær meðal annars til skynjunar, jafnvægis í tilfinningalífi, einbeitingu, minni, samskipta- eða aðlögunarhæfni og þannig takmarkað getu einstaklings til að sinna daglegum athöfnum.',
      description:
        'Mental impairment refers to problems or deviation in the functionality of the mind or emotions. The impairment may be caused by illness, injury or other trauma. Such impairments include problems with sensation, emotional balance, focus, memory, communication or adjustment, and thus limit the person’s ability to perform daily activities.',
    },
    mentalImpairmentAffect: {
      id: 'db.application:disability.pension.certificate.mental.impairment.affect',
      defaultMessage: 'Hversu mikið hefur andlegur vandi áhrif á daglegt líf',
      description: 'How much does the mental impairment affect daily life',
    },
    mentalImpairmentExplanation: {
      id: 'db.application:disability.pension.certificate.mental.impairment.explanation',
      defaultMessage: 'Nánari útskýringar varðandi andlegan vanda',
      description: 'Further explanation of the mental impairment',
    },

    // Activity and participation impairment
    activityAndParticipationImpairment: {
      id: 'db.application:disability.pension.certificate.activity.and.participation.impairment',
      defaultMessage: 'Virkni- og þátttökuvandi',
      description: 'Activity and participation impairment',
    },
    activityAndParticipationImpairmentTooltip: {
      id: 'db.application:disability.pension.certificate.activity.and.participation.impairment.tooltip',
      defaultMessage:
        'Virkni og þátttöku vandi vísar til getu við að taka þátt í samfélaginu og sinna daglegum athöfnum. Vandinn getur stafað af sjúkdómum, meiðslum, öðrum áföllum og umhverfisþáttum. Slíkur vandi getur falið í sér takmarkanir á getu til að sinna eða uppfylla hlutverk í fjölskyldu, tómstundum, námi, vinnu eða öðrum félagslegum aðstæðum.',
      description:
        'Activity and participation impairment refers to the ability to participate in society and carry out daily activities. The impairment may be caused by illness, injury, other trauma or environmental factors. Such impairment may include limitations in the ability to perform or fulfil roles within a family, leisure, study, work or other social settings.',
    },
    activityAndParticipationImpairmentAffect: {
      id: 'db.application:disability.pension.certificate.activity.and.participation.impairment.affect',
      defaultMessage:
        'Hversu mikið hefur virkni- og þátttökuvandi áhrif á daglegt líf',
      description:
        'How much does the activity and participation impairment affect daily life',
    },
    activityAndParticipationImpairmentExplanation: {
      id: 'db.application:disability.pension.certificate.activity.and.participation.impairment.explanation',
      defaultMessage: 'Nánari útskýringar varðandi virkni- og þátttökuvanda',
      description:
        'Further explanation of the activity and participation impairment',
    },

    // Main impairment
    mainImpairment: {
      id: 'db.application:disability.pension.certificate.main.impairment',
      defaultMessage: 'Megin vandi',
      description: 'Main impairment',
    },
    mainImpairmentExplanation: {
      id: 'db.application:disability.pension.certificate.main.impairment.explanation',
      defaultMessage: 'Annað varðandi megin vanda',
      description: 'Further information on main impairment',
    },

    // Application for medical and rehabilitation payments
    application: {
      id: 'db.application:disability.pension.certificate.application',
      defaultMessage: 'Sótt er um sjúkra- og endurhæfingargreiðslur',
      description: 'Application for medical and rehabilitation payments',
    },
    applicationStartOfTreatment: {
      id: 'db.application:disability.pension.certificate.application.start.of.treatment',
      defaultMessage: 'Upphaf meðferðar',
      description: 'Start of treatment',
    },
    applicationEstimatedEndOfTreatment: {
      id: 'db.application:disability.pension.certificate.application.estimated.end.of.treatment',
      defaultMessage: 'Áætluð lok meðferðar',
      description: 'Estimated end of treatment',
    },
    applicationEstimatedTimeUnclear: {
      id: 'db.application:disability.pension.certificate.application.estimated.time.unclear',
      defaultMessage: 'Óljóst',
      description: 'Unclear',
    },
    applicationEstimatedTime: {
      id: 'db.application:disability.pension.certificate.application.estimated.time',
      defaultMessage: 'Áætluð tímalengd',
      description: 'Estimated time',
    },
    applicationEstimatedTimeMonths: {
      id: 'db.application:disability.pension.certificate.application.estimated.time.months',
      defaultMessage: '{months} mánuðir',
      description: '{months} months',
    },
  }),
  prerequisites: defineMessages({
    title: {
      id: 'dp.application:prerequisites.title',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    checkboxLabel: {
      id: 'dp.application:prerequisites.checkboxLabel',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description: 'Checkbox label for sharing data',
    },
    organizationDataTitle: {
      id: 'dp.application:prerequisites.organizationDataTitle',
      defaultMessage: 'Upplýsingar frá stofnunum',
      description: 'Organization data title',
    },
    organizationDataText: {
      id: 'dp.application:prerequisites.organizationDataText',
      defaultMessage:
        'Upplýsingar um þig, maka og börn frá Þjóðskrá, RSK, Útlendingastofnun, Vinnumálastofnun og Sjúkratryggingum Íslands.',
      description: 'Organization data text',
    },
    myPagesTitle: {
      id: 'dp.application:prerequisites.myPagesTitle',
      defaultMessage: 'Upplýsingar af mínum síðum Ísland.is',
      description: 'My pages title',
    },
    myPagesText: {
      id: 'dp.application:prerequisites.myPagesText',
      defaultMessage: 'Upplýsingar um símanúmer og netfang.',
      description: 'My pages text',
    },
    healthDataTitle: {
      id: 'dp.application:prerequisites.healthDataTitle',
      defaultMessage: 'Upplýsingar frá heilbrigðisstofnun',
      description: 'Health data title',
    },
    healthDataText: {
      id: 'dp.application:prerequisites.healthDataText',
      defaultMessage: 'Upplýsingar um læknisvottorð vegna örorku.',
      description: 'Health data text',
    },
    rehabilitationTitle: {
      id: 'dp.application:prerequisites.rehabilitationTitle',
      defaultMessage:
        'Upplýsingar frá þjónustuaðila, endurhæfingar- eða meðferðaraðila',
      description: 'Rehabilitation information title',
    },
    rehabilitationText: {
      id: 'dp.application:prerequisites.rehabilitationText#markdown',
      defaultMessage:
        'Tryggingastofnun sækir þjónustulokaskýrslu og færnimat til þjónustuaðila sem sér um __endurhæfingu eða meðferð__.',
      description: 'Rehabilitation information text',
    },
    incomeTitle: {
      id: 'dp.application:prerequisites.incomeTitle',
      defaultMessage: 'Upplýsingar um tekjur og aðstæður',
      description: 'Income information title',
    },
    incomeText: {
      id: 'dp.application:prerequisites.incomeText#markdown',
      defaultMessage:
        'Í sumum tilfellum þarf Tryggingastofnun að sækja tekjuupplýsingar til Innheimtustofnunar sveitarfélaga, lífeyrissjóða, stéttarfélaga og RSK til að ákvarða réttindi.',
      description: 'Income information text',
    },
    dataFetchTitle: {
      id: 'dp.application:prerequisites.dataFetchTitle',
      defaultMessage: 'Gagnaöflun og meðferð persónuupplýsinga',
      description: 'Data fetch title',
    },
    dataFetchText: {
      id: 'dp.application:prerequisites.dataFetchText#markdown',
      defaultMessage:
        'Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna hér.\n\nEf tekjur eða aðrar aðstæður þínar breytast verður þú að láta Tryggingastofnun vita þar sem það getur haft áhrif á greiðslur þínar.\n\nRangar eða ófullnægjandi upplýsingar geta haft áhrif á afgreiðslu umsóknarinnar og hugsanlega leitt til endurkröfu eða annara viðurlaga.\n\nEf umsókn kemur frá erlendri stofnun  getur Tryggingastofnun óskað eftir frekari gögnum frá þeirri stofnunn.\n\nAuk þess getur tryggingastofnun haft samband við erlendar stofnanir ef þú telur þig eiga réttindi í öðru EES- landi, Bandaríkjunum eða Kanada, vegna réttinda þinna þar fyrir þina hönd.',
      description: 'Data fetch text',
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
      defaultMessage:
        'Vinsamlegast farið yfir netfang og símanúmer til að tryggja að þær upplýsingar séu réttar. Netfangi er breytt hér. Athugið að ef að aðrar upplýsingar eru ekki réttar þarft þú að hafa samband við Þjóðskrá og fara fram á breytingu.',
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
  personalInfo: defineMessages({
    nationalId: {
      id: 'dp.application:basicInfo.personalInfo.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: 'dp.application:basicInfo.personalInfo.address',
      defaultMessage: 'Heimilisfang',
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
      id: 'dp.application:paymentInfo.notice#markdown',
      defaultMessage: `Allar þínar greiðslur frá Tryggingastofnun eru greiddar inná bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inná þann reikning. \n\n
Mikilvægt er að bankaupplýsingarnar séu réttar. Gott er að hafa sambvand við viðskiptabanka sinn til að ganga úr skugga um að upplýsingarnar séu réttar ásamt því að fá upplýsingar um ÍBAN-númer og SWIFT-númer. \n\n
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
      defaultMessage:
        'Ef þú ert með erlendan bankareikning sér Tryggingastofnun um að millifæra greiðslur. Greiðslurnar samræmast milliríkjasamningi Íslands við EES, Bandaríkin og Kanada og verður reikningur því að vera skráður í þeim löndum (?). Millifærslur á erlenda reikninga fara í gegnum viðskiptabanka til erlendra banka, sem getur falið í sér kostnað vegna millifærslu. Einnig getur það falið í sér gengistap. Því er almennt dýrara að fá lífeyrisgreiðslur greiddar inn á erlendan reikning . ',
      description: 'TODO',
    },
    bank: {
      id: 'dp.application:paymentInfo.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
    bankAddress: {
      id: 'dp.application:paymentInfo.bankAddress',
      defaultMessage: 'Heimilisfang banka',
      description: 'Bank address',
    },
    personalAllowanceLabel: {
      id: 'dp.application:paymentInfo.personalAllowanceLabel',
      defaultMessage: 'Persónuafsláttur',
      description: 'Personal allowance',
    },
    personalAllowance: {
      id: 'dp.application:paymentInfo.personalAllowance',
      defaultMessage: 'Vilt þú nýta þér persónuafsláttinn þinn?',
      description: 'Do you want to use your personal allowance',
    },
    personalAllowanceRatio: {
      id: 'dp.application:paymentInfo.personalAllowanceRatio',
      defaultMessage: 'Hlutfall',
      description: 'Personal allowance ratio',
    },
    taxationLevel: {
      id: 'dp.application:paymentInfo.taxationLevel',
      defaultMessage: 'Skattþrep',
      description: 'Taxation level',
    },
    taxationLevelOptionOne: {
      id: 'dp.application:paymentInfo.taxationLevelOptionOne',
      defaultMessage:
        'Ég vil að viðeigandi skattþrep sé reiknað út frá öðrum tekjum sem ég er með',
      description: 'Taxation level option 1',
    },
    taxationLevelOptionTwo: {
      id: 'dp.application:paymentInfo.taxationLevelOptionTwo',
      defaultMessage:
        'Ég vil að miðað sé við Skattþrep 1 í útreikningum staðgreiðslu (31,45% af tekjum: 0 - 409.986 kr.)',
      description: 'Taxation level option 2',
    },
    taxationLevelOptionThree: {
      id: 'dp.application:paymentInfo.taxationLevelOptionThree',
      defaultMessage:
        'Ég vil að miðað sé við Skattþrep 2 í útreikningum staðgreiðslu (37,95% af tekjum: 409.986 - 1.151.012 kr.)',
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
    instructionsBullets: {
      id: 'dp.application:incomePlan.instructionsBullets#markdown',
      defaultMessage:
        '* Á næstu síðu er að finna tillögu að tekjuáætlun. Þar getur þú breytt upphæðum og bætt við tekjum. \n\n* Skrá skal heildartekjur fyrir skatt í tekjuáætlun. \n\n* Fjármagnstekjur eru sameignlegar hjá hjónum/sambúðarfólki og skal skrá heildar fjármagnstekjur hjóna/sambúðarfólks í tekjuáætlun.\n\n* Ef maki er á lífeyri verða greiðslur hans einnig endurreiknaðar ef fjármagnstekjum er breytt.\n\n* Heimilt er að skrá atvinnutekjur á þá mánuði sem þeirra er aflað. Reiknast þá þær atvinnutekjur eingöngu í þeim mánuði. Vakin er athygli á að það þarf að haka sérstaklega við þann kost að óska eftir mánaðarskiptingu atvinnutekna í tekjuáætlun.\n\n* Laun / lífeyrisgreiðslur skal skrá í þeim gjaldmiðli sem þau eru greidd.\n\n* Það er á ábyrgð umsækjanda að tekjuáætlun sé rétt og að nauðsynlegar upplýsingar liggi fyrir til að hægt sé að ákvarða réttar greiðslur.',
      description: 'Instructions for recording income plan',
    },
    instructionsLink: {
      id: 'dp.application:incomePlan.instructionsLink#markdown',
      defaultMessage:
        '[Tekjuáætlun - Upplýsingar um tekjur lífeyrisþega | Ísland.is](https://island.is/tekjuaaetlun-tr-upplysingar-um-tekjur-lifeyristhega/vinna-med-lifeyri)',
      description: 'Instructions for recording income plan',
    },
    incomeType: {
      id: 'dp.application:incomePlan.incomeType',
      defaultMessage: 'Tekjutegund',
      description: 'Income type',
    },
    yearlyIncome: {
      id: 'dp.application:incomePlan.yearlyIncome',
      defaultMessage: 'Tekjur á ári',
      description: 'Yearly income',
    },
    currency: {
      id: 'dp.application:incomePlan.currency',
      defaultMessage: 'Gjaldmiðill',
      description: 'Currency',
    },
  }),
  disabilityEvaluation: defineMessages({
    title: {
      id: 'dp.application:disabilityEvaluation.title',
      defaultMessage: 'Sótt um örorkumat hjá lífeyrissjóði',
      description: 'Applied for disability evaluation at pension fund',
    },
    description: {
      id: 'dp.application:disabilityEvaluation.description#markdown',
      defaultMessage:
        'Þeir sem eiga rétt á örorkulífeyri hjá lífeyrissjóði þurfa að sækja um þau réttindi áður en greiðslur frá TR geta hafist, nóg er að sækja um hjá einum lífeyrissjóði. TR sækir upplýsingar til lífeyrissjóða um hvort réttindi séu til staðar og hvort búið sé að sækja um.',
      description: 'Description for disability evaluation process',
    },
    appliedBeforeTitle: {
      id: 'dp.application:disabilityEvaluation.appliedBeforeTitle',
      defaultMessage: 'Hefur þú sótt um örorkumat hjá lífeyrissjóði?',
      description:
        'Have you applied for disability evaluation at pension fund?',
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
    noInfo: {
      id: 'dp.application:disabilityEvaluation.noInfo',
      defaultMessage:
        'Vakin er athygli á því að þeir sem eiga rétt á örorkulífeyri frá lífeyrissjóðum þurfa að sækja um þau hjá viðkomandi lífeyrissjóði. TR sækir upplýsingar til lífeyrissjóða um hvort réttindi séu til staðar og hvort búið sé að sækja um.',
      description: 'Information if no is answered',
    },
  }),
  disabilityPeriod: defineMessages({
    title: {
      id: 'dp.application:disabilityPeriod.title',
      defaultMessage: 'Sækja aftur í tímann',
      description: 'From what time are you applying for payments?',
    },
    description: {
      id: 'dp.application:disabilityPeriod.description',
      defaultMessage:
        'Hægt er að sækja um greiðslur í allt að 2 ár afturvikt, athygli er vakin á að gögn þurfa að rökstyðja afturvirkar greiðslur.',
      description: 'Description for disability period',
    },

    chooseDate: {
      id: 'dp.application:disabilityPeriod.chooseDate',
      defaultMessage: 'Veldu dagsetningu sem þú vilt hefja töku örorku',
      description: 'Select date',
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
      defaultMessage: 'Hefur þú búið erlendis?',
      description: 'Lived abroad',
    },
    livedAbroadDescription: {
      id: 'dp.application:employmentParticipation.livedAbroadDescription',
      defaultMessage:
        'Rangar eða ófullnægjandi upplýsingar geta haft áhrif á afgreiðslu umsóknarinnar og hugsanlega leitt til endurkröfu eða annarra viðurlaga.',
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
      defaultMessage: 'Kennitala í landi',
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
      defaultMessage:
        'Færðu greiðslur frá öðru landi vegna heilsubrests eða óvinnufærni?',
      description: 'TODO',
    },
    abroadPaymentsDescription: {
      id: 'dp.application:employmentParticipation.abroadPaymentsDescription',
      defaultMessage:
        'Rangar eða ófullnægjandi upplýsingar geta haft áhrif á afgreiðslu umsóknarinnar og hugsanlega leitt til endurkröfu eða annarra viðurlaga.',
      description: 'TODO',
    },
    abroadPaymentsTableTitle: {
      id: 'dp.application:employmentParticipation.abroadPaymentsTableTitle',
      defaultMessage: 'Hvaðan hefur þú fengið greiðslur?',
      description: 'Where have you received payments from?',
    },
  }),
  selfEvaluation: defineMessages({
    backgroundTitle: {
      id: 'dp.application:selfEvaluation.backgroundTitle',
      defaultMessage: 'Bakgrunnur',
      description: 'Background',
    },
    backgroundDescription: {
      id: 'dp.application:selfEvaluation.backgroundDescription',
      defaultMessage: 'Bakgrunnsupplýsingar',
      description: 'Background',
    },
    questionFormTitle: {
      id: 'dp.application:selfEvaluation.questionFormTitle',
      defaultMessage: 'Bakgrunnur og aðstæður',
      description: 'TODO',
    },
    title: {
      id: 'dp.application:selfEvaluation.title',
      defaultMessage: 'Sjálfsmat',
      description: 'Self evaluation',
    },
    description: {
      id: 'dp.application:selfEvaluation.description',
      defaultMessage:
        'Vinsamlegast svaraðu eftir bestu getu og í samræmi við núverandi stöðu. Ef þú þarft aðstoð við að svara þá er í lagi að fá hjálp, helst frá einhverjum sem þekkir þig vel.',
      description: 'TODO',
    },
    assistance: {
      id: 'dp.application:selfEvaluation.assistance',
      defaultMessage: 'Ég fæ aðstoð við að svara sjálfsmatinu',
      description: 'TODO',
    },
  }),
  capabilityImpairment: defineMessages({
    tabTitle: {
      id: 'dp.application:capabilityImpairment.tabTitle',
      defaultMessage: 'Skerðing á færni',
      description: 'Work capability impairment',
    },
    title: {
      id: 'dp.application:capabilityImpairment.title',
      defaultMessage: 'Færnisskerðing',
      description: 'Work capability impairment',
    },
    description: {
      id: 'dp.application:capabilityImpairment.description',
      defaultMessage:
        'Þessi hluti inniheldur spurningar um hvernig þú upplifir eigin færni í daglegu lífi og starfi. Hér getur verið um að ræða líkamlega, andlega eða félagslega þætti sem geta haft áhrif á getu þína til að sinna daglegum athöfnum, starfi og frístundum. \n\n Hafðu í huga að um er að ræða umfangsmikinn lista yfir atriði sem eiga ekki endilega við þig. Því er mikilvægt að þú metir hvernig þú upplifir stöðuna eins og hún er núna, ekki hvernig hún var áður eða hvernig þú vilt að hún verði.',
      description:
        'Here you can describe in more detail the problem that affects your work capacity.',
    },
  }),
  extraInfo: defineMessages({
    tabTitle: {
      id: 'dp.application:extraInfo.tabTitle',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional information',
    },
    title: {
      id: 'dp.application:extraInfo.title',
      defaultMessage: 'Athugasemd',
      description: 'Comment',
    },
    description: {
      id: 'dp.application:extraInfo.description',
      defaultMessage:
        'Hafir þú athugasemd sem þú vilt koma á framfæri, skrifaðu hana hér',
      description: 'TODO',
    },
    placeholder: {
      id: 'dp.application:extraInfo.placeholder',
      defaultMessage: 'Skrifaðu athugasemd hér',
      description: 'TODO',
    },
    noExtraInfo: {
      id: 'dp.application:extraInfo.noExtraInfo',
      defaultMessage: 'Engar athugasemdir',
      description: 'No additional information',
    },
  }),
  overview: defineMessages({
    title: {
      id: 'dp.application:overview.tabTitle',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    description: {
      id: 'dp.application:overview.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'TODO',
    },
    sendInApplication: {
      id: 'dp.application:overview.sendInApplication',
      defaultMessage: 'Senda inn umsókn',
      description: 'Send application',
    },
  }),
  disabilityCertificate: defineMessages({
    tabTitle: {
      id: 'dp.application:disabilityCertificate.tabTitle',
      defaultMessage: 'Grunnvottorð',
      description: 'TODO',
    },
    title: {
      id: 'dp.application:disabilityCertificate.title',
      defaultMessage: 'Grunnvottorð / Vottorð um örorku',
      description: 'TODO',
    },
    disabilityTitle: {
      id: 'dp.application:disabilityCertificate.disabilityTitle',
      defaultMessage: 'Vottorð um örorku',
      description: 'Disability certificate',
    },
    description: {
      id: 'dp.application:disabilityCertificate.description',
      defaultMessage:
        'Forsenda fyrir greiðslum er að heilsubrestur einstaklings sé afleiðing af sjúkdómi, slysi eða áfalli. Grunnvottorð þarf að innihalda staðfestingu þess efnis.',
      description: 'TODO',
    },
    certificateAvailable: {
      id: 'dp.application:disabilityCertificate.certificateAvailable',
      defaultMessage: 'Til staðar er vottorð um örorku',
      description: 'Disability certificate is available',
    },
    certificateNotAvailable: {
      id: 'dp.application:disabilityCertificate.certificateNotAvailable',
      defaultMessage: 'Ekki er til staðar vottorð um örorku',
      description: 'Disability certificate is not available',
    },
  }),
  questions: defineMessages({
    maritalStatusTitle: {
      id: 'dp.application:selfEvaluation.questions.maritalStatus.title',
      defaultMessage: 'Hver er hjúskaparstaða þín?',
      description: 'What is your marital status?',
    },
    maritalStatusSingle: {
      id: 'dp.application:selfEvaluation.questions.maritalStatus.single',
      defaultMessage: 'Einhleyp/ur',
      description: 'Single',
    },
    maritalStatusInRelationship: {
      id: 'dp.application:selfEvaluation.questions.maritalStatus.inRelationship',
      defaultMessage: 'Í sambandi',
      description: 'In relationship',
    },
    maritalStatusMarried: {
      id: 'dp.application:selfEvaluation.questions.maritalStatus.married',
      defaultMessage: 'Í hjónabandi/sambúð',
      description: 'Married',
    },
    maritalStatusDivorced: {
      id: 'dp.application:selfEvaluation.questions.maritalStatus.divorced',
      defaultMessage: 'Fráskilin(n)',
      description: 'Divorced',
    },
    maritalStatusWidowed: {
      id: 'dp.application:selfEvaluation.questions.maritalStatus.widowed',
      defaultMessage: 'Ekkja/Ekkill',
      description: 'Widowed',
    },
    maritalStatusUnknown: {
      id: 'dp.application:selfEvaluation.questions.maritalStatus.unknown',
      defaultMessage: 'Óupplýst',
      description: 'Unknown',
    },
    residenceTitle: {
      id: 'dp.application:selfEvaluation.questions.residence.title',
      defaultMessage: 'Í hvernig húsnæði býrð þú?',
      description: 'What type of housing do you live in?',
    },
    residenceOwnHome: {
      id: 'dp.application:selfEvaluation.questions.residence.ownHome',
      defaultMessage: 'Í eigin húsnæði',
      description: 'In own home',
    },
    residenceRentalMarket: {
      id: 'dp.application:selfEvaluation.questions.residence.rentalMarket',
      defaultMessage: 'Í leiguhúsnæði á almennum markaði',
      description: 'In rental housing on the general market',
    },
    residenceSocialHousing: {
      id: 'dp.application:selfEvaluation.questions.residence.socialHousing',
      defaultMessage: 'Í félagslegri leiguíbúð',
      description: 'In social rental housing',
    },
    residenceHomeless: {
      id: 'dp.application:selfEvaluation.questions.residence.homeless',
      defaultMessage: 'Er húsnæðislaus',
      description: 'Is homeless',
    },
    residenceWithFamily: {
      id: 'dp.application:selfEvaluation.questions.residence.withFamily',
      defaultMessage: 'Í húsnæði foreldar/ættingja',
      description: 'In parents/relatives housing',
    },
    residenceOther: {
      id: 'dp.application:selfEvaluation.questions.residence.other',
      defaultMessage: 'Annað, hvað?',
      description: 'Other, what?',
    },
    childrenCountTitle: {
      id: 'dp.application:selfEvaluation.questions.childrenCount.title',
      defaultMessage:
        'Hversu mörg börn (eigin og/eða stjúp- og fósturbörn) eru á heimili þínu að jafnaði?',
      description:
        'How many children (own and/or step- and foster children) are in your household on average?',
    },
    numberOfChildren: {
      id: 'dp.application:selfEvaluation.questions.childrenCount.numberOfChildren',
      defaultMessage: 'Fjöldi barna',
      description: 'Number of children',
    },
    childrenCountZero: {
      id: 'dp.application:selfEvaluation.questions.childrenCount.zero',
      defaultMessage: 'Engin börn',
      description: 'Zero children',
    },
    childrenCountOne: {
      id: 'dp.application:selfEvaluation.questions.childrenCount.one',
      defaultMessage: '1',
      description: 'One child',
    },
    childrenCountTwo: {
      id: 'dp.application:selfEvaluation.questions.childrenCount.two',
      defaultMessage: '2',
      description: 'Two children',
    },
    childrenCountThree: {
      id: 'dp.application:selfEvaluation.questions.childrenCount.three',
      defaultMessage: '3',
      description: 'Three children',
    },
    childrenCountFour: {
      id: 'dp.application:selfEvaluation.questions.childrenCount.four',
      defaultMessage: '4',
      description: 'Four children',
    },
    childrenCountFive: {
      id: 'dp.application:selfEvaluation.questions.childrenCount.five',
      defaultMessage: '5',
      description: 'Five children',
    },
    childrenCountSixOrMore: {
      id: 'dp.application:selfEvaluation.questions.childrenCount.sixOrMore',
      defaultMessage: '6+',
      description: 'Six or more children',
    },
    icelandicCapabilityTitle: {
      id: 'dp.application:selfEvaluation.questions.icelandicCapability.title',
      defaultMessage: 'Hversu gott vald hefur þú á íslensku/ensku?',
      description: 'How good is your command of Icelandic/English?',
    },
    icelandicCapabilityPoor: {
      id: 'dp.application:selfEvaluation.questions.icelandicCapability.poor',
      defaultMessage: 'Ekki gott vald',
      description: 'Not good command',
    },
    icelandicCapabilityFair: {
      id: 'dp.application:selfEvaluation.questions.icelandicCapability.fair',
      defaultMessage: 'Sæmilegt',
      description: 'Fair',
    },
    icelandicCapabilityGood: {
      id: 'dp.application:selfEvaluation.questions.icelandicCapability.good',
      defaultMessage: 'Gott',
      description: 'Good',
    },
    icelandicCapabilityVeryGood: {
      id: 'dp.application:selfEvaluation.questions.icelandicCapability.veryGood',
      defaultMessage: 'Mjög gott',
      description: 'Very good',
    },
    languageTitle: {
      id: 'dp.application:selfEvaluation.questions.language.title',
      defaultMessage: 'Hvert er móðurmál þitt / þitt aðaltungumál?',
      description: 'What is your native language / main language?',
    },
    languageIcelandic: {
      id: 'dp.application:selfEvaluation.questions.language.icelandic',
      defaultMessage: 'Íslenska',
      description: 'Icelandic',
    },
    languagePolish: {
      id: 'dp.application:selfEvaluation.questions.language.polish',
      defaultMessage: 'Pólska',
      description: 'Polish',
    },
    languageEnglish: {
      id: 'dp.application:selfEvaluation.questions.language.english',
      defaultMessage: 'Enska',
      description: 'English',
    },
    languageLithuanian: {
      id: 'dp.application:selfEvaluation.questions.language.lithuanian',
      defaultMessage: 'Litháenska',
      description: 'Lithuanian',
    },
    languageRomanian: {
      id: 'dp.application:selfEvaluation.questions.language.romanian',
      defaultMessage: 'Rúmenska',
      description: 'Romanian',
    },
    languageCzechSlovak: {
      id: 'dp.application:selfEvaluation.questions.language.czechSlovak',
      defaultMessage: 'Tékkneska / Slóvakíska',
      description: 'Czech / Slovak',
    },
    languagePortuguese: {
      id: 'dp.application:selfEvaluation.questions.language.portuguese',
      defaultMessage: 'Portúgalska',
      description: 'Portuguese',
    },
    languageSpanish: {
      id: 'dp.application:selfEvaluation.questions.language.spanish',
      defaultMessage: 'Spænska',
      description: 'Spanish',
    },
    languageThai: {
      id: 'dp.application:selfEvaluation.questions.language.thai',
      defaultMessage: 'Tælenska',
      description: 'Thai',
    },
    languageFilipino: {
      id: 'dp.application:selfEvaluation.questions.language.filipino',
      defaultMessage: 'Filippseyska (Tagalog)',
      description: 'Filipino (Tagalog)',
    },
    languageUkrainian: {
      id: 'dp.application:selfEvaluation.questions.language.ukrainian',
      defaultMessage: 'Úkraínska',
      description: 'Ukrainian',
    },
    languageArabic: {
      id: 'dp.application:selfEvaluation.questions.language.arabic',
      defaultMessage: 'Arabíska',
      description: 'Arabic',
    },
    languageOther: {
      id: 'dp.application:selfEvaluation.questions.language.other',
      defaultMessage: 'Annað',
      description: 'Other',
    },
    languageOtherSpecify: {
      id: 'dp.application:selfEvaluation.questions.language.otherSpecify',
      defaultMessage: 'Annað, hvað?',
      description: 'Specify which language',
    },
    employmentStatusTitle: {
      id: 'dp.application:selfEvaluation.questions.employmentStatus.title',
      defaultMessage: 'Hver er staða þín á vinnumarkaði?',
      description: 'What is your status in the job market?',
    },
    employmentStatusNeverEmployed: {
      id: 'dp.application:selfEvaluation.questions.employmentStatus.neverEmployed',
      defaultMessage: 'Hef aldrei verið í launuðu starfi',
      description: 'Have never been in paid employment',
    },
    employmentStatusSelfEmployed: {
      id: 'dp.application:selfEvaluation.questions.employmentStatus.selfEmployed',
      defaultMessage: 'Sjálfstætt starfandi',
      description: 'Self-employed',
    },
    employmentStatusFullTimeEmployee: {
      id: 'dp.application:selfEvaluation.questions.employmentStatus.fullTimeEmployee',
      defaultMessage: 'Launþegi í fullu starfi',
      description: 'Full-time employee',
    },
    employmentStatusPartTimeEmployee: {
      id: 'dp.application:selfEvaluation.questions.employmentStatus.partTimeEmployee',
      defaultMessage: 'Launþegi í hlutastarfi',
      description: 'Part-time employee',
    },
    employmentStatusInEducation: {
      id: 'dp.application:selfEvaluation.questions.employmentStatus.inEducation',
      defaultMessage: 'Er í námi',
      description: 'In education',
    },
    employmentStatusJobSeekingRegistered: {
      id: 'dp.application:selfEvaluation.questions.employmentStatus.jobSeekingRegistered',
      defaultMessage: 'Í atvinnuleit (á skrá hjá VMST)',
      description: 'Job seeking (registered with VMST)',
    },
    employmentStatusJobSeekingNotRegistered: {
      id: 'dp.application:selfEvaluation.questions.employmentStatus.jobSeekingNotRegistered',
      defaultMessage: 'Í atvinnuleit (ekki á skrá hjá VMST)',
      description: 'Job seeking (not registered with VMST)',
    },
    employmentStatusVoluntaryWork: {
      id: 'dp.application:selfEvaluation.questions.employmentStatus.voluntaryWork',
      defaultMessage: 'Í sjálfboðavinnu/vinnuprófun',
      description: 'In voluntary work/work trial',
    },
    employmentStatusNoParticipationHealthDisability: {
      id: 'dp.application:selfEvaluation.questions.employmentStatus.noParticipationHealthDisability',
      defaultMessage:
        'Engin þátttaka á vinnumarkaði vegna heilsubrests eða fötlunar',
      description:
        'No participation in job market due to health issues or disability',
    },
    employmentStatusOther: {
      id: 'dp.application:selfEvaluation.questions.employmentStatus.other',
      defaultMessage: 'Annað',
      description: 'Other',
    },
    employmentStatusOtherWhat: {
      id: 'dp.application:selfEvaluation.questions.employmentStatus.otherWhat',
      defaultMessage: 'Annað, hvað?',
      description: 'Other, what?',
    },
    previousEmploymentTitle: {
      id: 'dp.application:selfEvaluation.questions.previousEmployment.title',
      defaultMessage: 'Hefur þú verið í launuðu starfi áður?',
      description: 'Have you been in paid employment before?',
    },
    previousEmploymentWhen: {
      id: 'dp.application:selfEvaluation.questions.previousEmployment.when',
      defaultMessage: 'Hvenær varst þú síðast í launuðu starfi?',
      description: 'When were you in paid employment?',
    },
    previousEmploymentField: {
      id: 'dp.application:selfEvaluation.questions.previousEmployment.field',
      defaultMessage: 'Í hvaða starfsgrein starfaðir þú síðast?',
      description: 'In what profession did you work last?',
    },
    chooseProfession: {
      id: 'dp.application:selfEvaluation.questions.chooseProfession',
      defaultMessage: 'Veldu starfsgrein',
      description: 'Choose profession',
    },
    profession: {
      id: 'dp.application:selfEvaluation.questions.profession',
      defaultMessage: 'Starfsgrein',
      description: 'Profession',
    },
    educationLevelTitle: {
      id: 'dp.application:selfEvaluation.questions.educationLevel.title',
      defaultMessage: 'Hvað er hæsta námsstig sem þú hefur lokið?',
      description: 'What is the highest level of education you have completed?',
    },
    employmentCapabilityTitle: {
      id: 'dp.application:selfEvaluation.questions.employmentCapability.title',
      defaultMessage:
        'Hvernig metur þú starfsgetu þína í dag ef 0 er engin starfsgeta og 100 full starfsgeta?',
      description:
        'How do you rate your work capacity today if 0 is no work capacity and 100 is full work capacity?',
    },
    employmentCapabilityLabel: {
      id: 'dp.application:selfEvaluation.questions.employmentCapability.label',
      defaultMessage: 'Starfsgeta (0-100)',
      description: 'Work capacity (0-100)',
    },
    employmentImportanceTitle: {
      id: 'dp.application:selfEvaluation.questions.employmentImportance.title',
      defaultMessage: 'Hversu mikilvægt er fyrir þig að vera í vinnu?',
      description: 'How important is it for you to be in employment?',
    },
    employmentImportanceNotImportantAtAll: {
      id: 'dp.application:selfEvaluation.questions.employmentImportance.notImportantAtAll',
      defaultMessage: 'Alls ekki mikilvægt',
      description: 'Not important at all',
    },
    employmentImportanceNotImportant: {
      id: 'dp.application:selfEvaluation.questions.employmentImportance.notImportant',
      defaultMessage: 'Ekki mikilvægt',
      description: 'Not important',
    },
    employmentImportanceNeutral: {
      id: 'dp.application:selfEvaluation.questions.employmentImportance.neutral',
      defaultMessage: 'Hvorki né',
      description: 'Neither',
    },
    employmentImportanceImportant: {
      id: 'dp.application:selfEvaluation.questions.employmentImportance.important',
      defaultMessage: 'Mikilvægt',
      description: 'Important',
    },
    employmentImportanceVeryImportant: {
      id: 'dp.application:selfEvaluation.questions.employmentImportance.veryImportant',
      defaultMessage: 'Mjög mikilvægt',
      description: 'Very important',
    },
    rehabilitationOrTherapyTitle: {
      id: 'dp.application:selfEvaluation.questions.rehabilitationOrTherapy.title',
      defaultMessage:
        'Hefur þú verið í endurhæfingu eða meðferð áður vegna þess vanda sem leiðir til óvinnufærni?',
      description:
        'Have you been in rehabilitation or treatment before due to the problem that leads to disability?',
    },
    biggestIssueTitle: {
      id: 'dp.application:selfEvaluation.questions.biggestIssue.title',
      defaultMessage:
        'Hvað telur þú vera þinn helsta vanda sem leiðir til óvinnufærni?',
      description:
        'What do you consider to be your main problem that leads to disability?',
    },
  }),
  confirmation: defineMessages({
    tabTitle: {
      id: 'dp.application:confirmation.tabTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation tab title',
    },
    title: {
      id: 'dp.application:confirmation.title',
      defaultMessage:
        'Umsókn um örorku hefur verið send og bíður tekjuáætlunar',
      description:
        'Application for disability benefits has been submitted and is awaiting income assessment.',
    },
    successTitle: {
      id: 'dp.application:confirmation.successTitle',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Confirmation',
    },
    successDescription: {
      id: 'dp.application:confirmation.successDescription',
      defaultMessage:
        'Umsókn um örorku hefur verið send til Tryggingastofnunar',
      description: 'Confirmation',
    },
    whatHappensNext: {
      id: 'dp.application:confirmation.whatHappensNext',
      defaultMessage: 'Hvað gerist næst?',
      description: 'What happens next?',
    },
    whatHappensNextOptions: {
      id: 'dp.application:confirmation.whatHappensNextOptions',
      defaultMessage:
        '* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.  \n\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. \n\n*         Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til sjúkra- og endurhæfingarlífeyris. Vinnslutími umsókna um sjúkra- og endurhæfingarlífeyri er allt að fjórar vikur.',
      description: 'What happens next options',
    },
    warningTitle: {
      id: 'dp.application:confirmation.warningTitle',
      defaultMessage: 'Tengdar umsóknir / Réttur til annarra greiðslna',
      description: 'Warning title',
    },
    warningDescription: {
      id: 'dp.application:confirmation.warningDescription#markdown',
      defaultMessage: `Tryggingastofnun vekur athygli þína á því að þú getur átt rétt á greiðslum úr öðrum bótaflokkum sem tengjast heimilisaðstæðum. \n\nSérstaklega er bent á eftirfarandi umsóknir: \n\n* Umsókn um barnalífeyrir \n* Umsókn um heimilisuppbót \n\nTryggingastofnun hvetur þig til að fara í gegnum þessar umsóknir. Þær er hægt að nálgast inni á [tr.is](https://tr.is) og velur þar "Mínar síður". Innskráning fer fram með rafrænum skilríkjum.`,
      description: 'Warning description',
    },
  }),
  errors: defineMessages({
    emptyForeignResidence: {
      id: 'dp.application:errors.foreignResidenceRequired',
      defaultMessage: 'Nauðsynlegt er að bæta við a.m.k einni dvöl erlendis',
      description: 'You must add at least one foreign residence',
    },
    emptyForeignPayments: {
      id: 'dp.application:errors.abroadPaymentsRequired',
      defaultMessage:
        'Nauðsynlegt er að bæta við a.m.k einni greiðslu erlendis',
      description: 'You must add at least one foreign payment',
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
    nationalIdAbroadTooShort: {
      id: 'dp.application:errors.abroadNationalIdTooShort',
      defaultMessage: 'Kennitala í landi verður að vera a.m.k 4 tölustafir',
      description: 'TODO',
    },
    emptyStartDate: {
      id: 'dp.application:errors.startDateRequired',
      defaultMessage: 'Nauðsynlegt er að velja upphaf tímabils',
      description: 'You must select the start of period',
    },
    emptyEndDate: {
      id: 'dp.application:errors.endDateRequired',
      defaultMessage:
        'Nauðsynlegt er að velja enda tímabils, og að dagsetningin sé á eftir upphafsdagsetningu',
      description:
        'You must select the end of period. The end date must be after the start date.',
    },
    emptyPreviousEmploymentWhen: {
      id: 'dp.application:errors.previousEmploymentWhenRequired',
      defaultMessage:
        'Nauðsynlegt er að taka fram hvenær þú varst í launuðu starfi',
      description: 'You must specify when you were in paid employment',
    },
    emptyPreviousEmploymentField: {
      id: 'dp.application:errors.previousEmploymentFieldRequired',
      defaultMessage:
        'Nauðsynlegt er að taka fram hvaða grein þú starfaðir við',
      description: 'You must specify in what profession you worked',
    },
    emptyEmploymentStatus: {
      id: 'dp.application:errors.employmentStatusRequired',
      defaultMessage:
        'Nauðsynlegt er að velja a.m.k einn valkost eða útskýra í texta',
      description:
        'You must select at least one option or provide a description',
    },
    capabilityBetween0And100: {
      id: 'dp.application:errors.capabilityBetween0And100',
      defaultMessage: 'Starfsgeta þarf að vera á bilinu 0-100',
      description: 'Todo',
    },
  }),
}
