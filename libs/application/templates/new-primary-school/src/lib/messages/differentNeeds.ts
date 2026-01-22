import { defineMessages } from 'react-intl'

export const differentNeedsMessages = {
  shared: defineMessages({
    sectionTitle: {
      id: 'nps.application:differentNeeds.shared.sectionTitle',
      defaultMessage: 'Ólíkar þarfir',
      description: 'Different needs',
    },
  }),
  language: defineMessages({
    title: {
      id: 'nps.application:differentNeeds.language.title',
      defaultMessage: 'Tungumál barnsins',
      description: "The child's languages",
    },
    description: {
      id: 'nps.application:differentNeeds.language.description',
      defaultMessage:
        'Til að hægt sé að koma til móts við þarfir barnsins þarf skólinn að vita hvaða tungumál eru töluð í nærumhverfi þess. Veldu þau tungumál, eitt eða fleiri sem töluð eru dagsdaglega á heimilinu í samskiptum við eða í kringum barn.',
      description:
        "In order to meet the child's needs, the school needs to know what languages are spoken in its surroundings. Select one or more languages that are spoken daily in the home when communicating with or around a child.",
    },
    languageEnvironmentTitle: {
      id: 'nps.application:differentNeeds.language.languageEnvironmentTitle',
      defaultMessage:
        'Hvað á best við í tilfelli barnsins og tungumála sem notuð eru í daglegu lífi fjölskyldunnar?',
      description:
        "What best describes the child's daily language environment?",
    },
    languageEnvironment: {
      id: 'nps.application:differentNeeds.language.languageEnvironment',
      defaultMessage: 'Tungumálaumhverfi',
      description: 'Language environment',
    },
    languageEnvironmentPlaceholder: {
      id: 'nps.application:differentNeeds.language.languageEnvironmentPlaceholder',
      defaultMessage: 'Veldu það sem best á við',
      description: 'Choose the most appropriate',
    },
    selectedLanguagesDescription: {
      id: 'nps.application:differentNeeds.language.selectedLanguagesDescription',
      defaultMessage:
        'Raðaðu tungumálunum eftir því hvaða tungumál er mest er notað. Það sem er mest notað er nr. 1 og svo koll af kolli.',
      description:
        'Arrange the languages according to which language is most frequently used. What is most used is number 1 and so on.',
    },
    languageSelectionTitle: {
      id: 'nps.application:differentNeeds.language.languageSelectionTitle',
      defaultMessage: 'Tungumál {index}',
      description: 'Language {index}',
    },
    addLanguage: {
      id: 'nps.application:differentNeeds.language.addLanguage',
      defaultMessage: 'Bæta við tungumáli',
      description: 'Add language',
    },
    removeLanguage: {
      id: 'nps.application:differentNeeds.language.removeLanguage',
      defaultMessage: 'Fjarlægja tungumál',
      description: 'Remove language',
    },
    preferredLanguageTitle: {
      id: 'nps.application:differentNeeds.language.preferredLanguageTitle',
      defaultMessage:
        'Á hvaða tungumáli sem þú hefur valið, finnst barninu sjálfu best að tjá sig á?',
      description:
        'Of the chosen languages, in which language does your child feel most comfortable expressing themselves?',
    },
    signLanguage: {
      id: 'nps.application:differentNeeds.language.signLanguage',
      defaultMessage: 'Notar barnið táknmál?',
      description: 'Does the child use sign language?',
    },
  }),
  healthProtection: defineMessages({
    subSectionTitle: {
      id: 'nps.application:differentNeeds.healthProtection.subSectionTitle',
      defaultMessage: 'Heilsuvernd',
      description: 'Health protection',
    },
    description: {
      id: 'nps.application:differentNeeds.healthProtection.description',
      defaultMessage:
        'Heilsuvernd skólabarna er hluti af heilsugæslunni og framhald af ung- og smábarnavernd. Til að skólahjúkrunarfræðingur geti sinnt heilsuvernd skólabarns, haft umsjón með umönnun þess þegar svo ber við og veitt starfsfólki skólans viðeigandi fræðslu og ráðgjöf um rétt viðbrögð, er mikilvægt að hann hafi nauðsynlegar upplýsingar um heilsu barnsins.',
      description:
        'Health protection for school children is part of the healthcare system and follows from child health care. For the school nurse to be able to provide health protection for the school child, manage their care when needed, and provide appropriate education and advice to school staff on the right responses, it is important that they have necessary information about the childs health.',
    },
    allergiesAndIntolerances: {
      id: 'nps.application:differentNeeds.healthProtection.allergiesAndIntolerances',
      defaultMessage:
        'Er barnið með ofnæmi eða óþol sem starfsfólk skóla þarf að vera meðvitað um?',
      description:
        'Does the child have any allergies or intolerances that school staff need to be aware of?',
    },
    hasFoodAllergiesOrIntolerances: {
      id: 'nps.application:differentNeeds.healthProtection.hasFoodAllergiesOrIntolerances',
      defaultMessage: 'Barnið er með fæðuofnæmi eða -óþol',
      description: 'The child has food allergies or intolerances',
    },
    typeOfFoodAllergiesOrIntolerances: {
      id: 'nps.application:differentNeeds.healthProtection.typeOfFoodAllergiesOrIntolerances',
      defaultMessage: 'Tegund fæðuofnæmis eða -óþols',
      description: 'Type of food allergies or intolerances',
    },
    typeOfFoodAllergiesOrIntolerancesPlaceholder: {
      id: 'nps.application:differentNeeds.healthProtection.typeOfFoodAllergiesOrIntolerancesPlaceholder',
      defaultMessage: 'Veldu tegund fæðuofnæmis eða -óþols',
      description: 'Select type of food allergies or intolerances',
    },
    hasOtherAllergies: {
      id: 'nps.application:differentNeeds.healthProtection.hasOtherAllergies',
      defaultMessage: 'Barnið er með annað ofnæmi',
      description: 'The child has other allergies',
    },
    typeOfOtherAllergies: {
      id: 'nps.application:differentNeeds.healthProtection.typeOfOtherAllergies',
      defaultMessage: 'Tegund ofnæmis',
      description: 'Type of allergies',
    },
    typeOfOtherAllergiesPlaceholder: {
      id: 'nps.application:differentNeeds.healthProtection.typeOfOtherAllergiesPlaceholder',
      defaultMessage: 'Veldu tegund ofnæmis',
      description: 'Select type of allergies',
    },
    allergiesCertificateAlertMessage: {
      id: 'nps.application:differentNeeds.healthProtection.allergiesCertificateAlertMessage',
      defaultMessage:
        'Athugið að skóli getur óskað eftir vottorði til staðfestingar á ofnæmi.',
      description:
        'Please note that the school may request a certificate to confirm allergies.',
    },
    usesEpiPen: {
      id: 'nps.application:differentNeeds.healthProtection.usesEpiPen',
      defaultMessage:
        'Þarf barnið að hafa tiltækan adrenalínpenna (epi-pen) vegna ofnæmis?',
      description:
        'Does the child need to have an epi-pen available for allergies?',
    },
    hasConfirmedMedicalDiagnoses: {
      id: 'nps.application:differentNeeds.healthProtection.hasConfirmedMedicalDiagnoses',
      defaultMessage:
        'Er barnið með staðfesta læknisfræðilega greiningu sem skólinn þarf að kunna að bregðast rétt við?',
      description:
        'Does the child have a confirmed medical diagnosis that the school needs to know how to respond to correctly?',
    },
    hasConfirmedMedicalDiagnosesDescription: {
      id: 'nps.application:differentNeeds.healthProtection.hasConfirmedMedicalDiagnosesDescription',
      defaultMessage:
        'Hér er átt við greiningar eins og flogaveiki, sykursýki eða blóðstorknunarsjúkdóm',
      description:
        'This refers to diagnoses such as epilepsy, diabetes, or blood clotting disorders',
    },
    requestsMedicationAdministration: {
      id: 'nps.application:differentNeeds.healthProtection.requestsMedicationAdministration',
      defaultMessage:
        'Er óskað eftir aðstoð við barn vegna lyfjagjafar á skólatíma?',
      description:
        'Is assistance requested for a child due to medication administration during school hours?',
    },
    requestsMedicationAdministrationTooltip: {
      id: 'nps.application:differentNeeds.healthProtection.requestsMedicationAdministrationTooltip',
      defaultMessage:
        'Í fæstum tilvikum geta börn borið ábyrgð á lyfjatöku sinni. Þar skiptir þó aldur og lyfjategund máli. Ábyrgðin er forráðamanna en hjúkrunarfræðingar og starfsmenn skóla aðstoða við lyfjatökuna. Meginreglan er sú að barn á aðeins að fá lyf á skólatíma sem forráðamenn hafa komið með í skólann og óskað eftir að barnið fái.',
      description:
        'In most cases, children cannot be responsible for taking their own medication. However, age and type of medication matter. The responsibility lies with the guardians, but nurses and school staff assist with medication administration. The main rule is that a child should only receive medication at school that the guardians have brought to the school and requested the child to take.',
    },
    schoolNurseAlertMessage: {
      id: 'nps.application:differentNeeds.healthProtection.schoolNurseAlertMessage',
      defaultMessage:
        'Skólahjúkrunarfræðingur mun setja sig í samband við þig til að tryggja rétta skráningu upplýsinga og miðlun þeirra til starfsfólks skóla.',
      description:
        'The school nurse will contact you to ensure proper recording of information and its dissemination to school staff.',
    },
  }),
  support: defineMessages({
    subSectionTitle: {
      id: 'nps.application:differentNeeds.support.subSectionTitle',
      defaultMessage: 'Stuðningur',
      description: 'Support',
    },
    description: {
      id: 'nps.application:differentNeeds.support.description#markdown',
      defaultMessage:
        'Börn eru eins ólík og þau eru mörg. Sum börn þurfa á stuðningi að halda til að líða betur og nýta styrkleika sína sem best. Stuðningur við barn í skólastarfi er veittur af stoðþjónustu skóla og hefur það að markmiðið að tryggja að sérhvert barn fái rétta aðstoð, á réttum tíma, frá réttum aðila. \n\nEf barnið þitt er með greiningu um fötlun, þroskafrávik, langvinn veikindi eða alvarlegan sjúkdóm sem gætu haft áhrif á skólagöngu þess, þá sér núverandi skóli barns um að miðla þeim upplýsingum áfram til þess skóla sem sótt er um í.',
      description:
        'Children are as different as they are many. Some children need support to feel better and make the most of their strengths. Support in school is provided by the school’s support services and aims to ensure that every child receives the right help, at the right time, from the right person. \n\nIf your child has been diagnosed with a disability, developmental delay, chronic illness, or serious medical condition that could affect their schooling, their current school is responsible for passing that information on to the school you are applying to.',
    },
    enrollmentDescription: {
      id: 'nps.application:differentNeeds.support.enrollmentDescription#markdown',
      defaultMessage:
        'Börn eru eins ólík og þau eru mörg. Sum börn þurfa á stuðningi að halda til að líða betur og nýta styrkleika sína sem best. Stuðningur við barn í skólastarfi er veittur af stoðþjónustu skóla og hefur það að markmiðið að tryggja að sérhvert barn fái rétta aðstoð, á réttum tíma, frá réttum aðila. \n\nEf barnið þitt er með greiningu um fötlun, þroskafrávik, langvinn veikindi eða alvarlegan sjúkdóm sem gætu haft áhrif á skólagöngu þess, þá sér núverandi leikskóli barns um að miðla þeim upplýsingum áfram til þess skóla sem sótt er um í.',
      description:
        'Children are as different as they are many. Some children need support to feel better and make the most of their strengths. Support in school is provided by the school’s support services and aims to ensure that every child receives the right help, at the right time, from the right person. \n\nIf your child has been diagnosed with a disability, developmental delay, chronic illness, or serious medical condition that could affect their schooling, their current nursery is responsible for passing that information on to the school you are applying to.',
    },
    hasDiagnoses: {
      id: 'nps.application:differentNeeds.support.hasDiagnoses',
      defaultMessage:
        'Hafa farið fram skimanir eða greiningar á þroska eða stöðu barnsins í núverandi skóla?',
      description:
        'Have any assessments or diagnoses been conducted on the development or status of the child in the current school?',
    },
    enrollmentHasDiagnoses: {
      id: 'nps.application:differentNeeds.support.enrollmentHasDiagnoses',
      defaultMessage:
        'Hafa farið fram skimanir eða greiningar á þroska eða stöðu barnsins í núverandi leikskóla?',
      description:
        'Have any assessments or diagnoses been conducted on the development or status of the child in the current nursery?',
    },
    hasHadSupport: {
      id: 'nps.application:differentNeeds.support.hasHadSupport',
      defaultMessage:
        'Hefur nemandinn áður notið sérkennslu eða stuðnings í skóla?',
      description:
        'Has the student previously received special education or support in school?',
    },
    enrollmentHasHadSupport: {
      id: 'nps.application:differentNeeds.support.enrollmentHasHadSupport',
      defaultMessage:
        'Hefur nemandinn áður notið sérkennslu eða stuðnings í leikskóla?',
      description:
        'Has the student previously received special education or support in nursery?',
    },
    hasWelfareContact: {
      id: 'nps.application:differentNeeds.support.hasWelfareContact',
      defaultMessage: 'Hefur barnið verið með tengilið farsældar?',
      description: 'Has the child had a welfare contact person?',
    },
    hasWelfarePrimarySchoolContactDescription: {
      id: 'nps.application:differentNeeds.support.hasWelfarePrimarySchoolContactDescription',
      defaultMessage:
        'Tengiliður farsældar er sá aðili innan grunnskólans sem veitir upplýsingar og leiðbeiningar og hefur verið foreldrum innan handar við að sækja um þjónustu fyrir barnið sitt.',
      description:
        'The welfare contact person is the individual within the primary school who provides information and guidance, and has assisted parents in applying for services for their child.',
    },
    hasWelfareNurserySchoolContactDescription: {
      id: 'nps.application:differentNeeds.support.hasWelfareNurserySchoolContactDescription',
      defaultMessage:
        'Tengiliður farsældar er sá aðili innan leikskólans sem veitir upplýsingar og leiðbeiningar og hefur verið foreldrum innan handar við að sækja um þjónustu fyrir barnið sitt.',
      description:
        'The welfare contact person is the individual within the nursery who provides information and guidance, and has assisted parents in applying for services for their child.',
    },
    welfareContactName: {
      id: 'nps.application:differentNeeds.support.welfareContactName',
      defaultMessage: 'Nafn tengiliðs',
      description: 'Contact name',
    },
    welfareContactEmail: {
      id: 'nps.application:differentNeeds.support.welfareContactEmail',
      defaultMessage: 'Netfang tengiliðs',
      description: 'Contact email',
    },
    hasIntegratedServices: {
      id: 'nps.application:differentNeeds.support.hasIntegratedServices',
      defaultMessage: 'Hefur barnið verið með samþætta þjónustu?',
      description: 'Has the child had integrated services?',
    },
    hasIntegratedServicesDescription: {
      id: 'nps.application:differentNeeds.support.hasIntegratedServicesDescription',
      defaultMessage:
        'Foreldri hefur óskað eftir og gefið leyfi fyrir því að aðilar sem koma að stuðningi við barnið tali saman og deili upplýsingum sem hjálpað geta barni sín á milli.',
      description:
        "The parent has requested and given permission for the parties involved in the child's support to communicate and share information that can help the child.",
    },
    hasCaseManager: {
      id: 'nps.application:differentNeeds.support.hasCaseManager',
      defaultMessage: 'Hefur barnið verið með málastjóra?',
      description: 'Has the child had a case manager?',
    },
    hasCaseManagerDescription: {
      id: 'nps.application:differentNeeds.support.hasCaseManagerDescription',
      defaultMessage:
        'Málastjóri er sá aðili á vegum sveitarfélagsins sem tilnefndur hefur verið til að stýra stuðningsteymi barnsins og styðja við fjölskylduna.',
      description:
        "A case manager is the person appointed by the municipality to lead the child's support team and support the family.",
    },
    caseManagerName: {
      id: 'nps.application:differentNeeds.support.caseManagerName',
      defaultMessage: 'Nafn málastjóra',
      description: 'Case manager name',
    },
    caseManagerEmail: {
      id: 'nps.application:differentNeeds.support.caseManagerEmail',
      defaultMessage: 'Netfang málastjóra',
      description: 'Case manager email address',
    },
    internationalSchoolAlertMessage: {
      id: 'nps.application:differentNeeds.support.internationalSchoolAlertMessage#markdown',
      defaultMessage:
        'Ef umsókn þín er samþykkt mun verða óskað eftir upplýsingum um námsárangur síðustu tveggja ára, stöðluð próf og upplýsingar um aðrar þarfir.',
      description:
        'If your application is accepted, the school will ask you to send report cards from the last two years, external standardized test results and special needs documentation.',
    },
    alertMessage: {
      id: 'nps.application:differentNeeds.support.alertMessage#markdown',
      defaultMessage:
        'Við flutning barns milli leik- og/eða grunnskóla sjá stjórnendur skólanna til þess að persónuupplýsingum um barnið sem nauðsynlegar eru fyrir velferð og aðlögun þess í nýjum skóla, sé miðlað með tryggum og öruggum hætti. \n\nPersónuupplýsingar geta verið:\n\na. Almennar upplýsingar um félagslega stöðu og þroska barna.\n\nb. Læknisfræðilegar, sálfræðilegar og sérkennslufræðilegar greiningar eða aðrar greiningar og sérúrræði fyrir barn.\n\nc. Sérkennsluumsóknir, námsáætlanir vegna sérúrræða, einstaklingsnámskrár og aðrar bakgrunnsupplýsingar sem að gagni geta komið fyrir velferð og aðlögun barns í skólanum.\n\nd. Prófeinkunnir og vitnisburðir barns, mætingar og/eða agabrot\n\ne. Hverskonar skrifleg eða stafræn gögn svo sem skýrslur, greinargerðir og umsagnir er varða velferð og skólagöngu barns.',
      description:
        "When a child transfers between nursery and/or primary schools, school administrators ensure that personal information about the child that is necessary for their well-being and adjustment to the new school is communicated in a secure and safe manner. \n\nPersonal data can be: \n\na. General information about the social status and development of children. \n\nb. Medical, psychological, and special education assessments or other evaluations and specialized interventions for a child. \n\nc. Applications for special education, educational plans related to specialized support, individualized learning programs, and other background information that may be useful for the welfare and adaptation of a child in school.\n\nd. The child's exam results and testimonials, attendance, and/or disciplinary infractions.\n\ne. Any kind of written or digital data such as reports, statements, and evaluations concerning the welfare and schooling of the child.",
    },
    requestingMeeting: {
      id: 'nps.application:differentNeeds.support.requestingMeeting',
      defaultMessage:
        'Ef þú telur að grunnskólinn þurfi nánari upplýsingar um þarfir barnsins getur þú óskað eftir samtali. Skólinn mun setja sig í samband við þig, þegar nær dregur fyrsta skóladegi',
      description:
        "If you believe that the primary school needs more information about the child's needs, you can request a meeting. The school will contact you when the first day of school approaches.",
    },
    requestingMeetingDescription: {
      id: 'nps.application:differentNeeds.support.requestingMeetingDescription',
      defaultMessage: 'Óska eftir samtali við skóla',
      description: 'Request meeting with the school',
    },
  }),
  attachments: defineMessages({
    subSectionTitle: {
      id: 'nps.application:attachments.subSectionTitle',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    description: {
      id: 'nps.application:attachments.description#markdown',
      defaultMessage:
        'Til þess að skólinn geti metið hvort að úrræðið sem sótt er um henti barni og sé líklegt til að skila tilætluðum árangri, þarf forsjáraðili að skila nauðsynlegum gögnum með umsókn. \n\nFrá viðurkenndum greiningaraðilum: \n\n* Staðfest greining á fötlun barns eða staðfesting á að barnið sé í greiningarferli \n\n* Staðlað mat á stuðningsþörf barns (s.s. SIS-mat) eða staðfesting á að barnið sé í greiningarferli \n\nFrá núverandi skóla barns: \n\n* Þjónustuáætlun eða eftir atvikum stuðningsáætlun barns \n\n* Einstaklingsnámskrá barns \n\n* Skýrsla frá núverandi skóla sem felur í sér: \n\n * Mat á náms- og félagslegri stöðu barns og líðan þess \n\n * Lýsing á styrkleikum barns og verndandi þáttum \n\n * Ástæður þess af hverju skólinn telji sig ekki geta mætt þörfum barnsins \n\n * Hvaða stuðningur hafi verið veittur eða aðgerðum hafi verið beitt \n\n * Hvernig unnið hafi verið með barn að öðru leiti og hvaða árangri það hafi skilað \n\n * Óskir foreldra og barns að teknu tilliti til aldurs og þroska þess',
      description:
        'In order for the school to be able to assess whether the resource applied for is suitable for a child and is likely to deliver the desired results, the guardian must submit the necessary documentation with the application. \n\nFrom an accredited diagnostician: \n\n* Confirmation of the diagnosis of the child’s disability or confirmation that the child is in the process of diagnosis \n\n* A standardised assessment of a child’s support needs (a SIS evaluation) or confirmation that the child is in the diagnostic process \n\nFrom the child’s current school: \n\n* A service plan or, if needed, the child’s support plan \n\n* A report from the current school that includes: \n\n * Assessment of a child’s academic and social status and well-being \n\n * A description of the child’s strength and protective factors \n\n * The reasons why the school does not believe they can meet the child’s needs \n\n * What support has been provided or actions taken \n\n * What other measures have been tried with the child and what results have been achieved \n\n * The wishes of the parents and the child, taking into account the child’s age and development',
    },
    attachmentButton: {
      id: 'nps.application:attachments.attachmentButton',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'nps.application:attachments.attachmentHeader',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'nps.application:attachments.attachmentDescription',
      defaultMessage:
        'Tekið er við skjölum með endingu: .pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png',
      description:
        'The following document types are accepted: .pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png',
    },
    attachmentMaxSizeError: {
      id: 'nps.application:attachments.attachmentMaxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    electronicAttachmentOption: {
      id: 'nps.application:attachments.electronicAttachmentOption',
      defaultMessage: 'Öll gögn eru hengd við þessa umsókn sem fylgiskjöl.',
      description:
        'All documents will be attached and sent with the application.',
    },
    paperAttachmentOption: {
      id: 'nps.application:attachments.paperAttachmentOption',
      defaultMessage:
        'Öllum gögnum verður skilað til skólaþjónustu þess sveitarfélags sem rekur úrræðið, með öðrum leiðum.',
      description:
        'All documents will be submitted to the municipality’s school service by other means.',
    },
    electronicAndPaperAttachmentOption: {
      id: 'nps.application:attachments.electronicAndPaperAttachmentOption',
      defaultMessage:
        'Hluti gagnanna eru hengd við þessa umsókn sem fylgiskjöl. Öðrum gögnum verður skilað til skólaþjónustu þess sveitarfélags sem rekur úrræðið, eftir öðrum leiðum.',
      description:
        'Some documents will be attached and sent with the application. Other documents will be submitted to the municipality’s school service by other means.',
    },
  }),
  specialEducationSupport: defineMessages({
    description: {
      id: 'nps.application:differentNeeds.specialEducationSupport.description',
      defaultMessage:
        'Börn eru eins ólík og þau eru mörg. Sum börn þurfa á stuðningi að halda til að líða betur í skólanum og nýta styrkleika sína sem best í námi. Stuðningur við barn hefur það að markmiði að styðja við þroska þess, efla færni og þar með lífsgæði. Til að skólinn geti mætt námslegum þörfum barnsins er því mikilvægt að hann hafi upplýsingar um hvaða stuðning og þjónustu barnið hefur notið fram til þessa.',
      description:
        'Children are as different as they come. Some children need encouragement to do well in school and to make the most of their abilities. The purpose of child support is to support a child’s development, develop skills and thus improve their quality of life. In order for the school to meet the child’s educational needs, it is therefore important that it has information about the support and services that the child has received so far.',
    },
    hasWelfareContact: {
      id: 'nps.application:differentNeeds.specialEducationSupport.hasWelfareContact',
      defaultMessage: 'Er barnið með tengilið farsældar?',
      description: 'Does your child have a welfare contact person?',
    },
    hasCaseManager: {
      id: 'nps.application:differentNeeds.specialEducationSupport.hasCaseManager',
      defaultMessage: 'Er barnið með málastjóra?',
      description: 'Does your child have a case manager?',
    },
    hasIntegratedServices: {
      id: 'nps.application:differentNeeds.specialEducationSupport.hasIntegratedServices',
      defaultMessage: 'Er barnið með samþætta þjónustu í þágu farsældar?',
      description: 'Does your child have integrated welfare services?',
    },
    hasAssessmentOfSupportNeeds: {
      id: 'nps.application:differentNeeds.specialEducationSupport.hasAssessmentOfSupportNeeds',
      defaultMessage: 'Liggur fyrir staðlað mat á stuðningsþörf barns?',
      description:
        'Is there a standardised assessment of the child’s support needs?',
    },
    hasAssessmentOfSupportNeedsDescription: {
      id: 'nps.application:differentNeeds.specialEducationSupport.hasAssessmentOfSupportNeedsDescription',
      defaultMessage:
        'Sérfræðingar Ráðgjafar- og greiningarstöðvar sjá um framkvæmd SIS-mats fyrir börn á landinu öllu nema þau sem eru með lögheimili í Reykjavík. Í Reykjavík framkvæma sérfræðingar matið á þjónustumiðstöðvum, hjá Barnavernd Reykjavíkur, á heimili og/eða á öðrum vettvangi barns.',
      description:
        'Specialists from the Consulting and Analysis Centre are responsible for the implementation of the SIS-evaluation for children nationwide, except for those whose legal domicile is in Reykjavík. In Reykjavík, specialists carry out the assessment at service centres, at the offices of Reykjavík Child Protection Services, in the child’s home and/or different venues suitable for the child.',
    },
    isAssessmentOfSupportNeedsInProgress: {
      id: 'nps.application:differentNeeds.specialEducationSupport.isAssessmentOfSupportNeedsInProgress',
      defaultMessage: 'Er mat á stuðningsþörf barns í ferli?',
      description:
        'Is an assessment of the child’s need for support in progress?',
    },
    supportNeedsAssessmentBy: {
      id: 'nps.application:differentNeeds.specialEducationSupport.supportNeedsAssessmentBy',
      defaultMessage: 'Hver framkvæmdi matið á stuðningsþörf barns?',
      description:
        'Who carried out the assessment of the child’s support needs?',
    },
    evaluationProvider: {
      id: 'nps.application:differentNeeds.specialEducationSupport.evaluationProvider',
      defaultMessage: 'Matsaðili',
      description: 'Evaluation provider',
    },
    hasConfirmedDiagnosis: {
      id: 'nps.application:differentNeeds.specialEducationSupport.hasConfirmedDiagnosis',
      defaultMessage:
        'Liggur fyrir staðfest greining á vanda barns eða fötlun frá viðurkenndum greiningaraðila?',
      description:
        'Does the child have a confirmed diagnosis of a problem or disability from an authorised diagnostician?',
    },
    isDiagnosisInProgress: {
      id: 'nps.application:differentNeeds.specialEducationSupport.isDiagnosisInProgress',
      defaultMessage:
        'Er barn í greiningarferli hjá viðurkenndum greiningaraðila?',
      description:
        'Is the child in the process of diagnosis with an authorised diagnostician?',
    },
    atWhichDiagnostician: {
      id: 'nps.application:differentNeeds.specialEducationSupport.atWhichDiagnostician',
      defaultMessage: 'Hjá hvaða greiningaraðila?',
      description: 'At which diagnostician?',
    },
    diagnostician: {
      id: 'nps.application:differentNeeds.specialEducationSupport.diagnostician',
      defaultMessage: 'Greiningaraðili',
      description: 'Diagnostician',
    },
    hasOtherSpecialists: {
      id: 'nps.application:differentNeeds.specialEducationSupport.hasOtherSpecialists',
      defaultMessage: 'Hafa aðrir fagaðilar komið að stuðningi við barnið?',
      description:
        'Have other specialists been involved in the child’s support?',
    },
    hasOtherSpecialistsDescription: {
      id: 'nps.application:differentNeeds.specialEducationSupport.hasOtherSpecialistsDescription',
      defaultMessage:
        'Með fagaðilum er átt við sérfræðinga, innan eða utan skólaþjónustu sveitarfélagsins, sem veitt hafa barninu eða foreldrum stuðning og sem þekkja því sérstaklega til stöðu þess.',
      description:
        'Specialists refer to professionals, within or outside the municipality’s school service, who have provided support to the child or their parents and who have a special knowledge of the child’s situation.',
    },
    atWhichSpecialist: {
      id: 'nps.application:differentNeeds.specialEducationSupport.atWhichSpecialist',
      defaultMessage: 'Hjá hvaða fagaðila?',
      description: 'At which specialist?',
    },
    specialists: {
      id: 'nps.application:differentNeeds.specialEducationSupport.specialists',
      defaultMessage: 'Fagaðilar',
      description: 'Specialists',
    },
    hasReceivedServicesFromMunicipality: {
      id: 'nps.application:differentNeeds.specialEducationSupport.hasReceivedServicesFromMunicipality',
      defaultMessage:
        'Hefur barnið eða fjölskyldan þegið þjónustu frá sveitarfélaginu þar sem lögheimilið er skráð?',
      description:
        'Has your child or the family received services from the municipality in which your legal domicile is registered?',
    },
    hasReceivedServicesFromMunicipalityDescription: {
      id: 'nps.application:differentNeeds.specialEducationSupport.hasReceivedServicesFromMunicipalityDescription',
      defaultMessage:
        'Með þjónustu er átt við úrræði sem þjónustumiðstöð, velferðarþjónusta eða barnavernd fer með.',
      description:
        'Services refer to resources provided by a service centre, welfare services or child protective services',
    },
    whichService: {
      id: 'nps.application:differentNeeds.specialEducationSupport.whichService',
      defaultMessage: 'Hvaða þjónustu?',
      description: 'Which service?',
    },
    hasReceivedChildAndAdolescentPsychiatryServices: {
      id: 'nps.application:differentNeeds.specialEducationSupport.hasReceivedChildAndAdolescentPsychiatryServices',
      defaultMessage:
        'Hefur barnið fengið þjónustu hjá Barna- og unglingageðdeild?',
      description:
        'Has the child received services at the Child and Adolescent Psychiatry Department?',
    },
    whichChildAndAdolescentPsychiatryDepartment: {
      id: 'nps.application:differentNeeds.specialEducationSupport.whichChildAndAdolescentPsychiatryDepartment',
      defaultMessage: 'Hvaða barna- og unglingageðdeild?',
      description: 'Which Child and Adolescent Psychiatry Department?',
    },
    childAndAdolescentPsychiatryDepartment: {
      id: 'nps.application:differentNeeds.specialEducationSupport.childAndAdolescentPsychiatryDepartment',
      defaultMessage: 'Barna og unglingageðdeild',
      description: 'Child and Adolescent Psychiatry Department',
    },
    childAndAdolescentPsychiatryServicesReceived: {
      id: 'nps.application:differentNeeds.specialEducationSupport.childAndAdolescentPsychiatryServicesReceived',
      defaultMessage:
        'Hvernig þjónustu hefur barnið fengið hjá Barna- og unglingageðdeild?',
      description:
        'What kind of services has the child received at the Child and Adolescent Psychiatry Department?',
    },
    isOnWaitlistForServices: {
      id: 'nps.application:differentNeeds.specialEducationSupport.isOnWaitlistForServices',
      defaultMessage: 'Er barnið á biðlista eftir þjónustu?',
      description: 'Is the child currently on a waitlist for services?',
    },
    hasBeenReportedToChildProtectiveServices: {
      id: 'nps.application:differentNeeds.specialEducationSupport.hasBeenReportedToChildProtectiveServices',
      defaultMessage: 'Hafa mál barnsins verið tilkynnt til barnaverndar?',
      description:
        'Has the child’s case been reported to the child protective services?',
    },
    isCaseOpenWithChildProtectiveServices: {
      id: 'nps.application:differentNeeds.specialEducationSupport.isCaseOpenWithChildProtectiveServices',
      defaultMessage: 'Er málið opið hjá barnavernd í dag?',
      description: 'Is the case currently open with child protective services?',
    },
    selectAllThatAppliesPlaceholder: {
      id: 'nps.application:differentNeeds.specialEducationSupport.selectAllThatAppliesPlaceholder',
      defaultMessage: 'Veldu allt það sem á við',
      description: 'Select all that applies',
    },
    selectWhatIsAppropriatePlaceholder: {
      id: 'nps.application:differentNeeds.specialEducationSupport.selectWhatIsAppropriatePlaceholder',
      defaultMessage: 'Veldu það sem á við',
      description: 'Select what is appropriate',
    },
    service: {
      id: 'nps.application:differentNeeds.specialEducationSupport.service',
      defaultMessage: 'Þjónusta',
      description: 'Service',
    },
  }),
  terms: defineMessages({
    subSectionTitle: {
      id: 'nps.application:differentNeeds.terms.subSectionTitle',
      defaultMessage: 'Skilmálar',
      description: 'Terms',
    },
    description: {
      id: 'nps.application:differentNeeds.terms.description#markdown',
      defaultMessage:
        'Í umsókninni felst þríhliða samkomulag milli forsjáraðila, heimaskóla barns og þess skóla sem tekur tímabundið við barni. \n\nAllir aðilar skuldbinda sig til að vinna saman að velferð barns með það að markmiði að tryggja farsæla endurkomu þess í heimaskóla. Í því felst meðal annars að taka þátt í samstarfi um úrlausnir fyrir barnið, viðhalda virkum samskiptum milli allra aðila, fara eftir markmiðum og áætlun eftir bestu getu, og taka þátt í endurmati á stöðu mála.',
      description:
        'The application includes a tripartite agreement between the custodians, the child’s home school and the school that temporarily accepts the child. \n\nAll parties commit to working together on the welfare of the child, with the aim of ensuring a successful return to their home school. This includes participating in collaborative solutions for the child, maintaining active communication between all parties, following objectives and plans to the best of their ability, and participating in the reassessment of the situation.',
    },
    checkbox: {
      id: 'nps.application:differentNeeds.terms.checkbox',
      defaultMessage:
        'Með því að haka hér við staðfesta forsjáraðilar sinn hluta samkomulagsins.',
      description:
        'By checking this box custodians confirm their part in the above agreement.',
    },
  }),
  childCircumstances: defineMessages({
    subSectionTitle: {
      id: 'nps.application:differentNeeds.childCircumstances.subSectionTitle',
      defaultMessage: 'Aðstæður barns',
      description: "Child's circumstances",
    },
    description: {
      id: 'nps.application:differentNeeds.childCircumstances.description#markdown',
      defaultMessage:
        'Til að geta metið betur þörf barns fyrir úrræðið sem sótt er um kann að vera þörf á því að afla frekari upplýsinga á umsóknartímanum um aðstæður barnsins í nærumhverfi þess.\n\nUpplýsingar um aðstæður barns geta falið í sér viðkvæmar persónuupplýsingar, svo sem upplýsingar um heilsufar, og upplýsingar sem geta talist viðkvæms eðlis, svo sem upplýsingar um fjölskylduhagi eða félagslegan vanda barns og háttsemi.\n\nAllar athuganir eru gerðar í samráði við þjónustuteymi eða stuðningsteymi barns. Ef ræða þarf við sérfræðinga utan skólans verður forsjáraðila gefinn kostur á að hafa áhrif á val þeirra. Þá verða niðurstöður athuganna og álits kynntar forsjáraðila áður en endanleg ákvörðun er tekin.\n\nTil að uppfylla skyldur okkar samkvæmt lögum um persónuvernd og vinnslu persónuupplýsinga og reglugerð um stuðning við nemendur með sérþarfir í grunnskóla þurfum við að afla samþykkis foreldra áður en frekari upplýsinga er aflað.    \n\nBiðjum við þig að staðfesta að þú hafir kynnt þér efni þetta og veita samþykki þitt fyrir framangreindri vinnslu persónuupplýsinga í þeim tilgangi sem hér að neðan er lýst.',
      description:
        'In order to better assess a child’s need for the resources applied for, it may be necessary to gather more information during the application process regarding the child’s circumstances in his or her immediate environment.\n\nInformation on the child’s circumstances may include sensitive personal information, such as health information, and information that may be considered sensitive in nature, such as information on the child’s family history or social problems and behaviour.\n\nAll checks are carried out in consultation with the child’s service or support team. If experts outside the school are needed, the guardian will be given the opportunity to influence their choice. The results of the observations and opinions will be presented to the guardian before the final decision is made.\n\nIn order to comply with our legal obligations regarding data protection and the processing of personal information, as well as, regulations regarding the support of pupils with special needs in primary education, we need to obtain parental consent before obtaining any further information.\n\nWe ask you to confirm that you have familiarised yourself with this material and give your consent to the aforementioned processing of personal data for the purposes described below.',
    },
    onSiteObservation: {
      id: 'nps.application:differentNeeds.childCircumstances.onSiteObservation',
      defaultMessage:
        'Áður en afstaða er tekin til umsóknarinnar kann að vera þörf á því að meta frekar aðstæður barns með vettvangsathugun.',
      description:
        'Before a decision is made on the application, there may be a need to further assess the childs situation with an on-site observation.',
    },
    approveOnsiteObservation: {
      id: 'nps.application:differentNeeds.childCircumstances.approveOnsiteObservation',
      defaultMessage:
        'Ég samþykki að fagráð eða aðili í umboði þess, framkvæmi athugun á barni og aðstæðum þess í núverandi skóla og skrái niðurstöðurnar.',
      description:
        'I approve that a professional council or an authorized representative conducts an observation of the child and their situation in the current school and records the findings.',
    },
    onSiteObservationAdditionalInfo: {
      id: 'nps.application:differentNeeds.childCircumstances.onSiteObservationAdditionalInfo',
      defaultMessage:
        'Einnig kann að vera þörf á því að afla frekari gagna frá sérfræðingum í þeim tilgangi að upplýsa betur um aðstæður barns í kjölfar vettvangsathugunar.',
      description:
        'There may also be a need to obtain further information from specialists in order to better understand the childs situation following the on-site observation.',
    },
    approveOnSiteObservationAdditionalInfo: {
      id: 'nps.application:differentNeeds.childCircumstances.approveOnSiteObservationAdditionalInfo',
      defaultMessage:
        'Ég samþykki að fagráð eða aðili í umboði þess, afli eftir þörfum frekari upplýsinga um barnið mitt í kjölfar vettvangsathugunar.',
      description:
        'I approve that a professional council or an authorized representative obtains further information about my child as needed following the on-site observation.',
    },
    callInExpert: {
      id: 'nps.application:differentNeeds.childCircumstances.callInExpert',
      defaultMessage:
        'Þá kann að vera nauðsynlegt að kalla til sérfræðinga utan skólans í fötlun barns og námi og skólagöngu fatlaðra barna, eða eftir atvikum barna með tilfinninga- og/eða hegðunarvanda.',
      description:
        'It may then be necessary to call in experts outside the school regarding the childs disability and education, or as the case may be, children with emotional and/or behavioral difficulties.',
    },
    approveCallInExpert: {
      id: 'nps.application:differentNeeds.childCircumstances.approveCallInExpert',
      defaultMessage:
        'Ég samþykki að fagráð eða aðili í umboði þess, sæki ráðgjöf sérfræðinga utan skólans í námi og skólagöngu barnsins míns, fötlun eða eftir atvikum vanda þess.',
      description:
        'I approve that a professional council or an authorized representative seeks advice from experts outside the school regarding my childs education and schooling, disability, or as the case may be, their difficulties.',
    },
    childViews: {
      id: 'nps.application:differentNeeds.childCircumstances.childViews',
      defaultMessage:
        'Loks er mikilvægt að kanna afstöðu barns og gefa því færi á að tjá sig um viðhorf sín til nýrra gagna sem fagráð kann að hafa safnað og mögulegrar skólavistar, með hliðstjón af aldri og þroska þess.',
      description:
        'Finally, it is important to explore the childs perspective and give them the opportunity to express their views on the new data that a professional council may have collected and possible school placement, taking into account their age and maturity.',
    },
    approveChildViews: {
      id: 'nps.application:differentNeeds.childCircumstances.approveChildViews',
      defaultMessage:
        'Ég samþykki að fagráð eða aðili í umboði þess, afli upplýsinga um viðhorf barnsins sjálfs til nýrra gagna sem safnað hefur verið og mögulegrar skólavistar í þeim skóla sem sótt er um.',
      description:
        'I agree that the professional council, or a party acting on its behalf, may obtain information about the childs own attitude towards the new data that has been collected and possible school placement at the school applied for.',
    },
  }),
  payer: defineMessages({
    subSectionTitle: {
      id: 'nps.application:differentNeeds.payer.subSectionTitle',
      defaultMessage: 'Greiðandi',
      description: 'Payer',
    },
    title: {
      id: 'nps.application:differentNeeds.payer.title',
      defaultMessage: 'Hver greiðir fyrir skólavist barnsins?',
      description: 'Who pays the child’s school fees',
    },
    description: {
      id: 'nps.application:differentNeeds.payer.description',
      defaultMessage:
        'Forsjáraðilar sem sækja um sjálfstætt starfandi skóla fyrir barn sitt, þurfa að gera ráð fyrir því að greiða gjöld sem eru sérstök fyrir þann skóla. Þetta geta verið skráningargjöld, foreldragjöld, efnisgjöld eða önnur gjöld sem eru óháð greiðslu sveitarfélaganna til skólanna sjálfra. Vinsamlegast skráðu hver verður greiðandi viðbótargjalda fyrir barnið þitt.',
      description:
        'Guardians applying for an independent school for their child, must expect to pay fees specific to that school. This refers to the payment of fees such as enrolment fees, parent association fees, materials fees or other fees that are independent of the payments the school receives from the municipality. Please register who will be the payer of the additional school fees for your child.',
    },
    optionApplicant: {
      id: 'nps.application:differentNeeds.payer.optionApplicant',
      defaultMessage: 'Umsækjandi',
      description: 'Applicant',
    },
    optionOther: {
      id: 'nps.application:differentNeeds.payer.optionOther',
      defaultMessage: 'Annar',
      description: 'Other',
    },
    information: {
      id: 'nps.application:differentNeeds.payer.information',
      defaultMessage: 'Upplýsingar um greiðanda',
      description: 'Payer information',
    },
    informationDescription: {
      id: 'nps.application:differentNeeds.payer.informationDescription',
      defaultMessage:
        'Greiðandi verður beðinn um að samþykkja greiðsluþátttöku áður en umsókn er send inn.',
      description:
        'The payer will be asked to confirm the payment participation before the application is submitted.',
    },
  }),
}
