import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const newPrimarySchoolMessages: MessageDir = {
  // Messages shared across the New Primary School application templates
  shared: defineMessages({
    applicationName: {
      id: 'nps.application:application.name',
      defaultMessage: 'Umsókn í nýjan grunnskóla',
      description: 'Application for a new primary school',
    },
    institution: {
      id: 'nps.application:institution.name',
      defaultMessage: 'Sveitarfélög',
      description: 'Municipalities',
    },
    formTitle: {
      id: 'nps.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    alertTitle: {
      id: 'nps.application:alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
    yes: {
      id: 'nps.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'nps.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    date: {
      id: 'nps.application:date',
      defaultMessage: 'Dagsetning',
      description: 'Date',
    },
    datePlaceholder: {
      id: 'nps.application:date.placeholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Select date',
    },
    fullName: {
      id: 'nps.application:full.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'nps.application:nationalId',
      defaultMessage: 'Kennitala',
      description: 'National id',
    },
    email: {
      id: 'nps.application:email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    municipality: {
      id: 'nps.application:municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
    municipalityPlaceholder: {
      id: 'nps.application:municipality.placeholder',
      defaultMessage: 'Veldu sveitarfélag',
      description: 'Select municipality',
    },
    postalCode: {
      id: 'nps.application:postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal code',
    },
    address: {
      id: 'nps.application:address',
      defaultMessage: 'Heimilisfang',
      description: 'Address',
    },
    phoneNumber: {
      id: 'nps.application:phoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    relation: {
      id: 'nps.application:relation',
      defaultMessage: 'Tengsl',
      description: 'Relation',
    },
    relationPlaceholder: {
      id: 'nps.application:relation.placeholder',
      defaultMessage: 'Veldu tengsl',
      description: 'Select relation',
    },
    school: {
      id: 'nps.application:school',
      defaultMessage: 'Skóli',
      description: 'School',
    },
    schoolPlaceholder: {
      id: 'nps.application:school.placeholder',
      defaultMessage: 'Veldu skóla',
      description: 'Select school',
    },
  }),

  pre: defineMessages({
    externalDataSection: {
      id: 'nps.application:external.data.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    externalDataSubSection: {
      id: 'nps.application:external.data.sub.section',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection',
    },
    externalDataDescription: {
      id: 'nps.application:external.data.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'The following information will be retrieved electronically',
    },
    nationalRegistryInformationTitle: {
      id: 'nps.application:prerequisites.national.registry.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    nationalRegistryInformationSubTitle: {
      id: 'nps.application:prerequisites.national.registry.subtitle',
      defaultMessage: 'Upplýsingar um þig, maka og börn.',
      description: 'Information about you, spouse and children.',
    },
    userProfileInformationTitle: {
      id: 'nps.application:prerequisites.userprofile.title',
      defaultMessage: 'Upplýsingar af mínum síðum á Ísland.is',
      description: 'Information from My Pages at Ísland.is',
    },
    userProfileInformationSubTitle: {
      id: 'nps.application:prerequisites.userprofile.subtitle',
      defaultMessage:
        'Upplýsingar um netfang og símanúmer eru sóttar á mínar síður á Ísland.is.',
      description:
        'Information about email address and phone number will be retrieved from My Pages at Ísland.is.',
    },
    childInformationTitle: {
      id: 'nps.application:prerequisites.child.information.title',
      defaultMessage: 'Upplýsingar frá Miðstöð menntunar og skólaþjónustu',
      description:
        'Information from the Directorate of Education and School Services',
    },
    childInformationSubTitle: {
      id: 'nps.application:prerequisites.child.information.subtitle',
      defaultMessage:
        'Upplýsingar frá núverandi skóla barns. Upplýsingar um barn og ólíkar þarfir þess.',
      description:
        "Information from the child's current school. Information about the child and their different needs.",
    },
    checkboxProvider: {
      id: 'nps.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description:
        'I understand that the above information will be collected during the application process',
    },
    startApplication: {
      id: 'nps.application:prerequisites.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },

    // Children
    childrenSubSectionTitle: {
      id: 'nps.application:prerequisites.children.sub.section.title',
      defaultMessage: 'Börn',
      description: 'Children',
    },
    childrenDescription: {
      id: 'nps.application:prerequisites.childrenDescription#markdown',
      defaultMessage: `Samkvæmt uppflettingu í Þjóðskrá hefur þú forsjá með eftirfarandi barni/börnum. Ef þú sérð ekki barnið þitt hér, þá bendum við þér að hafa samband við Þjóðskrá. \n\nAthugaðu að einungis er hægt að sækja um fyrir eitt barn í einu. Ef skrá á tvö börn svo sem tvíbura er hægt að fara beint í að skrá annað barn þegar búið er að skrá það fyrra.`,
      description: `According to Registers Iceland, you have custody of the following child/children. If you do not see your child here, please contact Registers Iceland. \n\nPlease note that you can only apply for one child at a time. If you want to register two children, such as twins, you can proceed to register the second child directly after completing the registration for the first one.`,
    },
    childrenRadioTitle: {
      id: 'nps.application:prerequisites.childrenRadioTitle',
      defaultMessage: 'Veldu barn fyrir umsóknina',
      description: 'Select child for the application',
    },
  }),

  childrenNParents: defineMessages({
    sectionTitle: {
      id: 'nps.application:childrenNParents.section.title',
      defaultMessage: 'Börn og foreldrar',
      description: 'Children and parents',
    },

    // Child information
    childInfoSubSectionTitle: {
      id: 'nps.application:childrenNParents.child.info.sub.section.title',
      defaultMessage: 'Upplýsingar um barn',
      description: 'Information about child',
    },
    childInfoDescription: {
      id: 'nps.application:childrenNParents.child.info.description',
      defaultMessage:
        'Athugaðu hvort upplýsingarnar séu réttar áður en þú heldur áfram.',
      description: 'Check that the information is correct before proceeding.',
    },
    childInfoPreferredName: {
      id: 'nps.application:childrenNParents.child.info.preferred.name',
      defaultMessage: 'Valið nafn',
      description: 'Preferred name',
    },
    childInfoPronouns: {
      id: 'nps.application:childrenNParents.child.info.pronouns',
      defaultMessage: 'Fornafn',
      description: 'Pronoun',
    },
    childInfoPronounsPlaceholder: {
      id: 'nps.application:childrenNParents.child.info.pronouns.placeholder',
      defaultMessage: 'Veldu fornafn',
      description: 'Select pronoun',
    },
    differentPlaceOfResidence: {
      id: 'nps.application:childrenNParents.child.info.different.place.of.residence',
      defaultMessage: 'Er dvalarstaður barns annað en skráð lögheimili?',
      description:
        "Is the child's place of residence different from the registered legal domicile?",
    },
    childInfoPlaceOfResidence: {
      id: 'nps.application:childrenNParents.child.info.place.of.residence',
      defaultMessage: 'Dvalarstaður barns',
      description: "Child's place of residence",
    },

    // Parents/guardians
    parentsSubSectionTitle: {
      id: 'nps.application:childrenNParents.parents.sub.section.title',
      defaultMessage: 'Foreldrar/forsjáraðilar',
      description: 'Parents/guardians',
    },
    otherParent: {
      id: 'nps.application:childrenNParents.otherParent',
      defaultMessage: 'Upplýsingar um foreldri/forsjáraðila 2',
      description: 'Information about parent/guardian 2',
    },
    parent: {
      id: 'nps.application:childrenNParents.parent',
      defaultMessage: 'Upplýsingar um foreldri/forsjáraðila 1',
      description: 'Information about parent/guardian 1',
    },
    parentsDescription: {
      id: 'nps.application:childrenNParents.parents.description',
      defaultMessage:
        'Upplýsingar um foreldra/forsjáraðila eru sóttar úr Þjóðskrá og af Mínum síðum á Island.is. Athugaðu hvort símanúmer og netföng séu rétt skráð áður en þú heldur áfram.',
      description:
        'Information about parents/guardians is retrieved from Registers Iceland and from My Pages on Ísland.is. Check that phone numbers and email addresses are entered correctly before proceeding.',
    },

    // Contacts
    contactsSubSectionTitle: {
      id: 'nps.application:childrenNParents.contacts.sub.section.title',
      defaultMessage: 'Tengiliðir',
      description: 'Contacts',
    },
    contactsTitle: {
      id: 'nps.application:childrenNParents.contacts.title',
      defaultMessage: 'Tengiliðir barns',
      description: "The child's contacts",
    },
    contactsDescription: {
      id: 'nps.application:childrenNParents.contacts.description',
      defaultMessage:
        'Skráðu að minnsta kosti einn tengilið sem má hafa samband við ef ekki næst í forsjáraðila barnsins. Þú getur bætt við allt að fjórum tengiliðum. Vinsamlegast látið tengiliði vita af skráningunni.',
      description:
        "List at least one contact person who can be contacted if the child's guardian cannot be reached. You can add up to four contacts. Please inform the contacts of the registration.",
    },
    contactsRegistrationTitle: {
      id: 'nps.application:childrenNParents.contacts.registration.title',
      defaultMessage: 'Skráning tengiliðs',
      description: 'Registration of a contact',
    },
    contactsAddContact: {
      id: 'nps.application:childrenNParents.contacts.add.contact',
      defaultMessage: 'Bæta við tengilið',
      description: 'Add a contact',
    },
    contactsRegisterContact: {
      id: 'nps.application:childrenNParents.contacts.register.contact',
      defaultMessage: 'Skrá tengilið',
      description: 'Register contact',
    },
    contactsDeleteContact: {
      id: 'nps.application:childrenNParents.contacts.delete.contact',
      defaultMessage: 'Eyða tengilið',
      description: 'Remove contact',
    },
  }),

  primarySchool: defineMessages({
    sectionTitle: {
      id: 'nps.application:primary.school.section.title',
      defaultMessage: 'Grunnskóli',
      description: 'Primary school',
    },

    // Reason for application
    reasonForApplicationSubSectionTitle: {
      id: 'nps.application:primary.school.reason.for.application.sub.section.title',
      defaultMessage: 'Ástæða umsóknar',
      description: 'Reason for application',
    },
    reasonForApplicationDescription: {
      id: 'nps.application:primary.school.reason.for.application.description',
      defaultMessage:
        'Barn á alltaf rétt á skólavist í sínum hverfisskóla. Séu ástæður umsóknar aðrar en flutningur lögheimilis getur verið að skólinn sjái sér ekki fært að taka á móti barninu. Það fer eftir aðstæðum í skólanum hverju sinni, svo sem rými.',
      description:
        'A child always has the right to attend school in his district school. If the reasons for the application are other than a change of legal residence, the school may not be able to accept the child. It depends on the situation in the school each time, such as space.',
    },
    reasonForApplicationPlaceholder: {
      id: 'nps.application:primary.school.reason.for.application.placeholder',
      defaultMessage: 'Veldu ástæðu',
      description: 'Select reason',
    },
    registerNewDomicileAlertMessage: {
      id: 'nps.application:primary.school.register.new.domicile.alert.message',
      defaultMessage: 'Minnum þig á að skrá nýtt lögheimili í Þjóðskrá.',
      description:
        'We remind you to register your new domicile in Registers Iceland.',
    },
    country: {
      id: 'nps.application:primary.school.country',
      defaultMessage: 'Til hvaða lands er verið að flytja?',
      description: 'What country are you moving to?',
    },
    countryPlaceholder: {
      id: 'nps.application:primary.school.country.placeholder',
      defaultMessage: 'Veldu land',
      description: 'Select a country',
    },

    // Siblings
    siblingsSubSectionTitle: {
      id: 'nps.application:primary.school.siblings.sub.section.title',
      defaultMessage: 'Systkini',
      description: 'Siblings',
    },
    siblingsTitle: {
      id: 'nps.application:primary.school.siblings.title',
      defaultMessage: 'Systkini í sama grunnskóla',
      description: 'Siblings in the same primary school',
    },
    siblingsRegistrationTitle: {
      id: 'nps.application:primary.school.siblings.registration.title',
      defaultMessage: 'Skráning systkinis',
      description: 'Registration of a sibling',
    },
    siblingsAddRelative: {
      id: 'nps.application:primary.school.siblings.add.relative',
      defaultMessage: 'Bæta við systkini',
      description: 'Add a sibling',
    },
    siblingsRegisterRelative: {
      id: 'nps.application:primary.school.siblings.register.relative',
      defaultMessage: 'Skrá systkini',
      description: 'Register sibling',
    },
    siblingsDeleteRelative: {
      id: 'nps.application:primary.school.siblings.delete.relative',
      defaultMessage: 'Eyða systkini',
      description: 'Remove sibling',
    },

    // Current school
    currentSchoolSubSectionTitle: {
      id: 'nps.application:primary.school.current.school.sub.section.title',
      defaultMessage: 'Upplýsingar um núverandi skóla',
      description: 'Information about current school',
    },
    currentSchoolInfo: {
      id: 'nps.application:primary.school.current.school.info',
      defaultMessage: 'Núverandi skóli',
      description: 'Current school',
    },
    grade: {
      id: 'nps.application:primary.school.grade',
      defaultMessage: 'Bekkur',
      description: 'Grade',
    },
    currentGrade: {
      id: 'nps.application:primary.school.current.grade',
      defaultMessage: '{grade}. bekkur',
      description: '{grade} grade',
    },

    // Apply to a new school
    newSchoolSubSectionTitle: {
      id: 'nps.application:primary.school.new.school.sub.section.title',
      defaultMessage: 'Nýr skóli',
      description: 'New school',
    },

    // Starting school
    startingSchoolSubSectionTitle: {
      id: 'nps.application:primary.school.starting.school.sub.section.title',
      defaultMessage: 'Byrjar í skóla',
      description: 'Starting school',
    },
    startingSchoolTitle: {
      id: 'nps.application:primary.school.starting.school.title',
      defaultMessage: 'Hvenær óskar þú eftir að barnið byrji í nýjum skóla?',
      description: 'When do you wish the child to start in a new school?',
    },
    startingSchoolDescription: {
      id: 'nps.application:primary.school.starting.school.description',
      defaultMessage:
        'Við viljum taka vel á móti skólabarninu. Til þess að getað undirbúið komu þess þá biðjum við þig að velja dagsetningu fyrir fyrsta skóladaginn.',
      description:
        'We want to properly welcome your child to the school. To prepare for their arrival, please select a date for the first school day.',
    },
  }),

  differentNeeds: defineMessages({
    sectionTitle: {
      id: 'nps.application:different.needs.section.title',
      defaultMessage: 'Ólíkar þarfir',
      description: 'Different needs',
    },

    // Language
    languageSubSectionTitle: {
      id: 'nps.application:different.needs.language.sub.section.title',
      defaultMessage: 'Tungumál',
      description: 'Language',
    },
    languageTitle: {
      id: 'nps.application:different.needs.language.title',
      defaultMessage: 'Tungumál barnsins',
      description: "The child's languages",
    },
    languageDescription: {
      id: 'nps.application:different.needs.language.description',
      defaultMessage:
        'Til að hægt sé að koma til móts við þarfir barnsins þarf skólinn að vita hvaða tungumál eru töluð í nærumhverfi þess. Veldu þau tungumál, eitt eða fleiri sem töluð eru dagsdaglega á heimilinu í samskiptum við eða í kringum barn.',
      description:
        "In order to meet the child's needs, the school needs to know which languages ​​are spoken in their immediate environment. Choose the languages, one or more, that are spoken daily at home in communication with or around a child.",
    },
    childNativeLanguage: {
      id: 'nps.application:different.needs.child.native.language',
      defaultMessage: 'Hvert er móðurmál barnsins?',
      description: "What is the child's native language?",
    },
    otherLanguagesSpokenDaily: {
      id: 'nps.application:different.needs.other.languages.spoken.daily',
      defaultMessage:
        'Eru önnur tungumál en móðurmál töluð daglega á heimili barnsins?',
      description:
        "Are languages ​​other than the native language spoken daily in the child's home?",
    },
    languagePlaceholder: {
      id: 'nps.application:different.needs.language.placeholder',
      defaultMessage: 'Veldu tungumál',
      description: 'Choose a language',
    },
    icelandicNotSpokenAroundChild: {
      id: 'nps.application:different.needs.icelandic.not.spoken.around.child',
      defaultMessage: 'Það er ekki töluð íslenska í nærumhverfi barnsins',
      description:
        "Icelandic is not spoken in the child's immediate environment",
    },

    // Free school meal
    freeSchoolMealSubSectionTitle: {
      id: 'nps.application:different.needs.free.school.meal.sub.section.title',
      defaultMessage: 'Gjaldfrjáls skólamáltíð',
      description: 'Free school meal ',
    },
    freeSchoolMealDescription: {
      id: 'nps.application:different.needs.free.school.meal.description',
      defaultMessage:
        'Barninu stendur til boða gjaldfrjáls skólamáltíð. Til þess að skólinn geti mætt fæðuþörfum barnsins á sama tíma og spornað er við matarsóun þurfum við upplýsingar er varða matarumhverfi barnsins.',
      description:
        "The child is entitled to a free school meal. In order for the school to be able to meet the child's nutritional needs while at the same time preventing food waste, we need information about the child's food environment.",
    },
    acceptFreeSchoolLunch: {
      id: 'nps.application:different.needs.free.school.meal.accept.free.school.lunch',
      defaultMessage:
        'Viltu þiggja gjaldfrjálsa máltíð í hádeginu fyrir barnið þitt?',
      description:
        'Would you like to accept a free school lunch for your child?',
    },
    hasSpecialNeeds: {
      id: 'nps.application:different.needs.free.school.meal.has.special.needs',
      defaultMessage:
        'Er barnið með sérþarfir sem óskað er eftir að tekið sé tillit til?',
      description:
        'Does the child have special needs that you wish to be taken into account?',
    },
    specialNeedsType: {
      id: 'nps.application:different.needs.free.school.meal.special.needs.type',
      defaultMessage: 'Tegund',
      description: 'Type',
    },
    specialNeedsTypePlaceholder: {
      id: 'nps.application:different.needs.free.school.meal.special.needs.type.placeholder',
      defaultMessage: 'Veldu tegund',
      description: 'Select type',
    },
    foodAllergiesAlertMessage: {
      id: 'nps.application:different.needs.free.school.meal.food.allergies.alert.message',
      defaultMessage: 'Spurt er um matarofnæmi undir ofnæmi og óþól',
      description:
        'Food allergies are addressed in the allergies and intolerances section',
    },

    // Allergies and intolerances
    allergiesAndIntolerancesSubSectionTitle: {
      id: 'nps.application:different.needs.allergies.and.intolerances.sub.section.title',
      defaultMessage: 'Ofnæmi og óþol',
      description: 'Allergies and intolerances',
    },
    allergiesAndIntolerancesDescription: {
      id: 'nps.application:different.needs.allergies.and.intolerances.description',
      defaultMessage:
        'Er barnið með ofnæmi eða óþol sem starfsfólk skóla þarf að vera meðvitað um?',
      description:
        'Does the child have any allergies or intolerances that school staff need to be aware of?',
    },
    hasFoodAllergiesOrIntolerances: {
      id: 'nps.application:different.needs.allergies.and.intolerances.has.food.allergies.or.intolerances',
      defaultMessage: 'Barnið er með fæðuofnæmi eða -óþol',
      description: 'The child has food allergies or intolerances',
    },
    typeOfFoodAllergiesOrIntolerances: {
      id: 'nps.application:different.needs.allergies.and.intolerances.type.of.food.allergies.or.intolerances',
      defaultMessage: 'Tegund fæðuofnæmis eða -óþols',
      description: 'Type of food allergies or intolerances',
    },
    typeOfFoodAllergiesOrIntolerancesPlaceholder: {
      id: 'nps.application:different.needs.allergies.and.intolerances.type.of.food.allergies.or.intolerances.placeholder',
      defaultMessage: 'Veldu tegund fæðuofnæmis eða -óþols',
      description: 'Select type of food allergies or intolerances',
    },
    hasOtherAllergies: {
      id: 'nps.application:different.needs.allergies.and.intolerances.has.other.allergies',
      defaultMessage: 'Barnið er með annað ofnæmi',
      description: 'The child has other allergies',
    },
    typeOfOtherAllergies: {
      id: 'nps.application:different.needs.allergies.and.intolerances.type.of.other.allergies',
      defaultMessage: 'Tegund ofnæmis',
      description: 'Type of allergies',
    },
    typeOfOtherAllergiesPlaceholder: {
      id: 'nps.application:different.needs.allergies.and.intolerances.type.of.other.allergies.placeholder',
      defaultMessage: 'Veldu tegund ofnæmis',
      description: 'Select type of allergies',
    },
    allergiesCertificateAlertMessage: {
      id: 'nps.application:different.needs.allergies.and.intolerances.allergies.certificate.alert.message',
      defaultMessage:
        'Athugið að skóli getur óskað eftir vottorði til staðfestingar á ofnæmi.',
      description:
        'Please note that the school may request a certificate to confirm allergies.',
    },
    usesEpiPen: {
      id: 'nps.application:different.needs.allergies.and.intolerances.uses.epi.pen',
      defaultMessage:
        'Þarf barnið að hafa tiltækan adrenalínpenna (epi-pen) vegna ofnæmis?',
      description:
        'Does the child need to have an epi-pen available for allergies?',
    },
    hasConfirmedMedicalDiagnoses: {
      id: 'nps.application:different.needs.allergies.and.intolerances.has.confirmed.medical.diagnoses',
      defaultMessage:
        'Hefur barnið staðfestar læknisfræðilegar greiningar sem mikilvægt er að skólinn kunni að bregðast rétt við?',
      description:
        'Does the child have confirmed medical diagnoses that are important for the school to be able to respond appropriately?',
    },
    hasConfirmedMedicalDiagnosesDescription: {
      id: 'nps.application:different.needs.allergies.and.intolerances.has.confirmed.medical.diagnoses.description',
      defaultMessage:
        'Hér er átt við greiningar eins og flogaveiki, sykursýki eða blóðstorknunarsjúkdóm',
      description:
        'This refers to diagnoses such as epilepsy, diabetes, or blood clotting disorders.',
    },
    requestMedicationAssistance: {
      id: 'nps.application:different.needs.allergies.and.intolerances.request.medication.assistance',
      defaultMessage:
        'Er óskað eftir aðstoð við barn vegna lyfjagjafar á skólatíma?',
      description:
        'Is assistance requested for a child due to medication administration during school hours?',
    },
    schoolNurseAlertMessage: {
      id: 'nps.application:different.needs.allergies.and.intolerances.school.nurse.alert.message',
      defaultMessage:
        'Skólahjúkrunarfræðingur mun setja sig í samband við þig til að tryggja rétta skráningu upplýsinga og miðlun þeirra til starfsfólks skóla.',
      description:
        'The school nurse will contact you to ensure proper recording of information and its dissemination to school staff.',
    },

    // Support
    supportSubSectionTitle: {
      id: 'nps.application:different.needs.support.sub.section.title',
      defaultMessage: 'Stuðningur',
      description: 'Support',
    },
    supportDescription: {
      id: 'nps.application:different.needs.support.description',
      defaultMessage:
        'Ef barnið þitt er með greiningu um fötlun, þroskafrávik, langvinn veikindi eða alvarlegan sjúkdóm sem gætu haft áhrif á skólagöngu þess, þá sér núverandi skóli barns um að miðla þeim upplýsingum áfram til þess skóla sem sótt er um í.',
      description:
        "If your child has a diagnosis of a disability, developmental disorder, chronic illness or serious illness that could affect their schooling, the child's current school will forward that information to the school they are applying to.",
    },
    developmentalAssessment: {
      id: 'nps.application:different.needs.developmental.assessment',
      defaultMessage:
        'Hafa farið fram skimanir eða greiningar á þroska eða stöðu barnsins í núverandi skóla?',
      description:
        'Have any assessments or diagnoses been conducted on the development or status of the child in the current school?',
    },
    specialSupport: {
      id: 'nps.application:different.needs.special.support',
      defaultMessage:
        'Hefur nemandinn áður notið sérkennslu eða stuðnings í skóla?',
      description:
        'Has the student previously received special education or support in school?',
    },
    requestMeeting: {
      id: 'nps.application:different.needs.request.meeting',
      defaultMessage:
        'Ef þú telur að grunnskólinn þurfi nánari upplýsingar um þarfir barnsins getur þú óskað eftir samtali. Skólinn mun setja sig í samband við þig, þegar nær dregur fyrsta skóladegi',
      description:
        "If you believe that the primary school needs more information about the child's needs, you can request a meeting. The school will contact you when the first day of school approaches.",
    },
    requestMeetingDescription: {
      id: 'nps.application:different.needs.request.meeting.info',
      defaultMessage: 'Óska eftir samtali við skóla',
      description: 'Request meeting with the school',
    },
  }),

  overview: defineMessages({
    sectionTitle: {
      id: 'nps.application:overview.section.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    overviewDescription: {
      id: 'nps.application:overview.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    child: {
      id: 'nps.application:overview.child',
      defaultMessage: 'Barn',
      description: 'Child',
    },
    submitButton: {
      id: 'nps.application:overview.submit.button',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application',
    },
    editButton: {
      id: 'nps.application:overview.edit.button',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    parents: {
      id: 'nps.application:overview.parents',
      defaultMessage: 'Foreldri/forsjáraðili',
      description: 'Parent/guardian',
    },
    nativeLanguage: {
      id: 'nps.application:overview.native.language',
      defaultMessage: 'Móðurmál barnsins',
      description: "The child's native language",
    },
    icelandicSpokenAroundChild: {
      id: 'nps.application:overview.icelandic.spoken.around.child',
      defaultMessage: 'Íslenska er töluð í nærumhverfi barnsins',
      description: "Icelandic is spoken in the child's immediate environment",
    },
    schoolTitle: {
      id: 'nps.application:overview.school.title',
      defaultMessage: 'Upplýsingar um valinn/nýjan skóla',
      description: 'Information about selected/new school',
    },
    selectedSchool: {
      id: 'nps.application:overview.selected.school',
      defaultMessage: 'Valinn skóli',
      description: 'Selected school',
    },
    foodAllergiesOrIntolerances: {
      id: 'nps.application:overview.food.allergies.or.intolerances',
      defaultMessage: 'Fæðuofnæmi eða -óþol',
      description: 'Food allergies or intolerances',
    },
    otherAllergies: {
      id: 'nps.application:overview.other.allergies',
      defaultMessage: 'Annað ofnæmi',
      description: 'Other allergies',
    },
    usesEpiPen: {
      id: 'nps.application:overview.uses.epi.pen',
      defaultMessage: 'Notar adrenalínpenna (epi-pen) vegna ofnæmis',
      description: 'Uses an epi-pen for allergies',
    },
  }),

  conclusion: defineMessages({
    sectionTitle: {
      id: 'nps.application:conclusion.section.title',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    expandableDescription: {
      id: 'nps.application:conclusion.expandable.description#markdown',
      defaultMessage:
        'Sveitarfélagið og skólinn munu taka afstöðu til umsóknarinnar og svara þér eins fljótt og auðið er.\n\nÁður en afstaða er tekin kann að vera þörf á því að afla frekari gagna í þeim tilgangi að upplýsa betur um aðstæður barns og/eða forsjáraðila. Mun þá sveitarfélagið eða skólinn setja sig í samband við þig.\n\nEf umsókn um nýjan skóla er samþykkt, verður forsjáraðili og barn boðað til móttökuviðtals.',
      description:
        "The municipality and the school will make a decision on the application and will respond to you as quickly and easily as possible.\n\nBefore a decision is made, there may be a need to gather further information in order to provide better information about the child's and/or guardian's circumstances. The municipality or the school will then contact you.\n\nIf the application for a new school is approved, the guardian and child will be invited to an admission interview.",
    },
  }),
}

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'nps.application:inReview.form.title',
    defaultMessage: 'Umsókn í nýjan grunnskóla',
    description: 'Application for a new primary school',
  },
})

export const statesMessages = defineMessages({
  draftDescription: {
    id: 'nps.application:draft.description',
    defaultMessage: 'Þú hefur útbúið drög að umsókn.',
    description: 'You have create a draft application.',
  },
  applicationSent: {
    id: 'nps.application:application.sent.title',
    defaultMessage: 'Umsókn hefur verið send.',
    description: 'The application has been sent',
  },
  applicationSentDescription: {
    id: 'nps.application:application.sent.description',
    defaultMessage: 'Hægt er að breyta umsókn',
    description: 'It is possible to edit the application',
  },
})

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'nps.application:error.phone.number',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  nationalId: {
    id: 'nps.application:error.national.id',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'National id must be valid',
  },
  contactsRequired: {
    id: 'nps.application:error.contacts.required',
    defaultMessage: 'Nauðsynlegt er að bæta við a.m.k einum tengilið',
    description: 'You must add at least one contact',
  },
  siblingsRequired: {
    id: 'nps.application:error.siblings.required',
    defaultMessage: 'Nauðsynlegt er að bæta við a.m.k einu systkini',
    description: 'You must add at least one sibling',
  },
  languagesRequired: {
    id: 'nps.application:error.languages.required',
    defaultMessage: 'Það þarf að velja a.m.k eitt tungumál',
    description: 'At least one language must be selected',
  },
  noChildrenFoundTitle: {
    id: 'nps.application:error.no.children.found.title',
    defaultMessage: 'Því miður ert þú ekki með skráð barn á grunnskólaaldri',
    description:
      'Unfortunately, you do not have a child registered at primary school age',
  },
  noChildrenFoundMessage: {
    id: 'nps.application:error.no.children.found.message#markdown',
    defaultMessage:
      'Eingöngu sá sem er með lögheimilisforsjá hefur heimild til að sækja um fyrir barn. \n\nÞjóðskrá skráir hver eða hverjir teljast foreldrar barns og hver fari með forsjárskyldur þess. Upplýsingar um skráningu forsjár og lögheimilisforeldris má nálgast hér: [Foreldrar og forsjá | Þjóðskrá (skra.is)](https://www.skra.is/folk/skraning-barns/foreldrar-og-forsja/)\n\nUpplýsingum um tengsl á milli barna og foreldra auk forsjáraðila eru einnig aðgengilegar á [Mínum síðum á Ísland.is](https://island.is/minarsidur)',
    description:
      'Only the person who has legal custody has the authority to apply for a child.\n\nThe National Registry records who or which individuals are considered to be the parents of a child and who has custody responsibilities. Information on registering custody and legal guardianship can be found here: [Parents and Custody | National Registry (skra.is)](https://www.skra.is/folk/skraning-barns/foreldrar-og-forsja/)\n\nInformation about the relationship between children and parents, as well as custody authorities, is also available on [My Pages on Ísland.is](https://island.is/minarsidur)',
  },
  foodAllergiesOrIntolerancesRequired: {
    id: 'nps.application:error.food.allergies.or.intolerances.required',
    defaultMessage: 'Það þarf að velja a.m.k eitt fæðuofnæmi eða -óþol',
    description: 'At least one food allergy or intolerance must be selected',
  },
  otherAllergiesRequired: {
    id: 'nps.application:error.other.allergies.required',
    defaultMessage: 'Það þarf að velja a.m.k eitt ofnæmi',
    description: 'At least one allergy must be selected',
  },
})
