import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const newPrimarySchoolMessages: MessageDir = {
  // Messages shared across the New Primary School application templates
  shared: defineMessages({
    applicationName: {
      id: 'dess.nps.application:application.name',
      defaultMessage: 'Umsókn í nýjan grunnskóla',
      description: 'Application for a new primary school',
    },
    institution: {
      id: 'dess.nps.application:institution.name',
      defaultMessage: 'Sveitarfélög',
      description: 'Municipalities',
    },
    formTitle: {
      id: 'dess.nps.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    alertTitle: {
      id: 'dess.nps.application:alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
    yes: {
      id: 'dess.nps.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'dess.nps.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    date: {
      id: 'dess.nps.application:date',
      defaultMessage: 'Dagsetning',
      description: 'Date',
    },
    datePlaceholder: {
      id: 'dess.nps.application:date.placeholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Select date',
    },
    fullName: {
      id: 'dess.nps.application:full.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'dess.nps.application:nationalId',
      defaultMessage: 'Kennitala',
      description: 'National id',
    },
    email: {
      id: 'dess.nps.application.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    municipality: {
      id: 'dess.nps.application:municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
    municipalityPlaceholder: {
      id: 'dess.nps.application:municipality.placeholder',
      defaultMessage: 'Veldu sveitarfélag',
      description: 'Select municipality',
    },
    postalCode: {
      id: 'dess.nps.application:postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal code',
    },
    address: {
      id: 'dess.nps.application:address',
      defaultMessage: 'Heimilisfang',
      description: 'Address',
    },
    phoneNumber: {
      id: 'dess.nps.application:phoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'Phonenumber',
    },
    relation: {
      id: 'dess.nps.application:relation',
      defaultMessage: 'Tengsl',
      description: 'Relation',
    },
    relationPlaceholder: {
      id: 'dess.nps.application:relation.placeholder',
      defaultMessage: 'Veldu tengsl',
      description: 'Select relation',
    },
    school: {
      id: 'dess.nps.application:school',
      defaultMessage: 'Skóli',
      description: 'School',
    },
    schoolPlaceholder: {
      id: 'dess.nps.application:school.placeholder',
      defaultMessage: 'Veldu skóla',
      description: 'Select school',
    },
    male: {
      id: 'dess.nps.application:gender.male',
      defaultMessage: 'Karlkyns',
      description: 'Male',
    },
    female: {
      id: 'dess.nps.application:gender.female',
      defaultMessage: 'Kvenkyns',
      description: 'Female',
    },
    otherGender: {
      id: 'dess.nps.application:gender.other',
      defaultMessage: 'Kynsegin/Annað',
      description: 'non-binary/Other',
    },
  }),

  pre: defineMessages({
    externalDataSection: {
      id: 'dess.nps.application:external.data.section',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection',
    },
    externalDataDescription: {
      id: 'dess.nps.application:external.data.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'The following information will be retrieved electronically',
    },
    nationalRegistryInformationTitle: {
      id: 'dess.nps.application:prerequisites.national.registry.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    nationalRegistryInformationSubTitle: {
      id: 'dess.nps.application:prerequisites.national.registry.subtitle',
      defaultMessage: 'Upplýsingar um þig.',
      description: 'Information about you.',
    },
    userProfileInformationTitle: {
      id: 'dess.nps.application:prerequisites.userprofile.title',
      defaultMessage: 'Upplýsingar af mínum síðum á Ísland.is',
      description: 'Information from My Pages at Ísland.is',
    },
    userProfileInformationSubTitle: {
      id: 'dess.nps.application:prerequisites.userprofile.subtitle',
      defaultMessage:
        'Upplýsingar um netfang og símanúmer eru sóttar á mínar síður á Ísland.is.',
      description:
        'Information about email address and phone number will be retrieved from My Pages at Ísland.is.',
    },
    checkboxProvider: {
      id: 'dess.nps.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description:
        'I understand that the above information will be collected during the application process',
    },
    startApplication: {
      id: 'dess.nps.application:prerequisites.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  childrenNParents: defineMessages({
    sectionTitle: {
      id: 'dess.nps.application:childrenNParents.section.title',
      defaultMessage: 'Börn og foreldrar',
      description: 'Children and parents',
    },

    // Children
    childrenSubSectionTitle: {
      id: 'dess.nps.application:childrenNParents.children.sub.section.title',
      defaultMessage: 'Börn',
      description: 'Children',
    },
    childrenDescription: {
      id: 'dess.nps.application:childrenNParents.childrenDescription#markdown',
      defaultMessage: `Samkvæmt uppflettingu í Þjóðskrá hefur þú forsjá með eftirfarandi barni/börnum. Ef þú sérð ekki barnið þitt hér, þá bendum við þér að hafa samband við Þjóðskrá. \n\nAthugaðu að einungis er hægt að sækja um fyrir eitt barn í einu. Ef skrá á tvö börn svo sem tvíbura er hægt að fara beint í að skrá annað barn þegar búið er að skrá það fyrra.`,
      description: `According to the Registers Iceland database you have the following children. If you do not see your child in this process, please contact the Registers Iceland. \n\nPlease note that you can only apply for one child at a time. If you have two children, such as twins, you can proceed to register the second child directly after completing the registration for the first one.`,
    },
    childrenRadioTitle: {
      id: 'dess.nps.application:childrenNParents.childrenRadioTitle',
      defaultMessage: 'Veldu barn fyrir umsóknina',
      description: 'Select child for the application',
    },

    // Child information
    childInfoSubSectionTitle: {
      id: 'dess.nps.application:childrenNParents.child.info.sub.section.title',
      defaultMessage: 'Upplýsingar um barn',
      description: 'Information about child',
    },
    childInfoTitle: {
      id: 'dess.nps.application:childrenNParents.child.info.title',
      defaultMessage: 'Upplýsingar um barn',
      description: 'Information about child',
    },
    childInfoDescription: {
      id: 'dess.nps.application:childrenNParents.child.info.description',
      defaultMessage:
        'Athugaðu hvort upplýsingarnar séu réttar áður en þú heldur áfram.',
      description: 'Check that the information is correct before proceeding.',
    },
    childInfoChosenName: {
      id: 'dess.nps.application:childrenNParents.child.info.chosen.name',
      defaultMessage: 'Valið nafn',
      description: 'Preferred name',
    },
    childInfoGender: {
      id: 'dess.nps.application:childrenNParents.child.info.gender',
      defaultMessage: 'Kyn',
      description: 'Gender',
    },
    childInfoGenderPlaceholder: {
      id: 'dess.nps.application:childrenNParents.child.info.gender.placeholder',
      defaultMessage: 'Veldu kyn',
      description: 'Select gender',
    },
    differentPlaceOfResidence: {
      id: 'dess.nps.application:childrenNParents.child.info.different.place.of.residence',
      defaultMessage: 'Er dvalarstaður barns annað en skráð lögheimili?',
      description:
        "Is the child's place of residence different from the registered legal domicile?",
    },
    childInfoPlaceOfResidence: {
      id: 'dess.nps.application:childrenNParents.child.info.place.of.residence',
      defaultMessage: 'Dvalarstaður barns',
      description: "Child's place of residence",
    },

    // Parents/guardians
    parentsSubSectionTitle: {
      id: 'dess.nps.application:childrenNParents.parents.sub.section.title',
      defaultMessage: 'Foreldrar/forsjáraðilar',
      description: 'Parents/guardians',
    },
    otherParent: {
      id: 'dess.nps.application:childrenNParents.otherParent',
      defaultMessage: 'Upplýsingar um foreldri/forsjáraðila 2',
      description: 'Information about parent/guardian 2',
    },
    parent: {
      id: 'dess.nps.application:childrenNParents.parent',
      defaultMessage: 'Upplýsingar um foreldri/forsjáraðila 1',
      description: 'Information about parent/guardian 1',
    },
    parentsDescription: {
      id: 'dess.nps.application:childrenNParents.parents.description',
      defaultMessage:
        'Upplýsingar um foreldra og forsjáraðila eru sóttar í Þjóðskrá. Athugaðu hvort símanúmer og netföng séu rétt skráð áður en þú heldur áfram.',
      description:
        'Information about parents and guardians is retrieved from the National Register. Check that phone numbers and email addresses are entered correctly before proceeding.',
    },

    // Relatives
    relativesSubSectionTitle: {
      id: 'dess.nps.application:childrenNParents.relatives.sub.section.title',
      defaultMessage: 'Aðstandendur',
      description: 'Relatives',
    },
    relativesTitle: {
      id: 'dess.nps.application:childrenNParents.relatives.title',
      defaultMessage: 'Aðstandendur barnsins',
      description: "The child's relatives",
    },
    relativesDescription: {
      id: 'dess.nps.application:childrenNParents.relatives.description',
      defaultMessage:
        'Skráðu að minnsta kosti einn tengilið sem má hafa samband við ef ekki næst í foreldra/forsjáraðila barnsins. Þú getur bætt við allt að sex aðstandendum. Vinsamlegast látið aðstandendur vita af skráningunni.',
      description:
        "List at least one contact person who can be contacted if the child's parents/guardian cannot be reached. You can add up to six relatives. Please inform the relatives of the registration.",
    },
    relativesRegistrationTitle: {
      id: 'dess.nps.application:childrenNParents.relatives.registration.title',
      defaultMessage: 'Skráning aðstandanda',
      description: 'Registration of a relative',
    },
    relativesAddRelative: {
      id: 'dess.nps.application:childrenNParents.relatives.add.relative',
      defaultMessage: 'Bæta við aðstandanda',
      description: 'Add a relative',
    },
    relativesRegisterRelative: {
      id: 'dess.nps.application:childrenNParents.relatives.register.relative',
      defaultMessage: 'Skrá aðstandanda',
      description: 'Register relative',
    },
    relativesDeleteRelative: {
      id: 'dess.nps.application:childrenNParents.relatives.delete.relative',
      defaultMessage: 'Eyða aðstandanda',
      description: 'Remove relative',
    },
    relativesRelationGrandparent: {
      id: 'dess.nps.application:childrenNParents.relatives.relation.grandparent',
      defaultMessage: 'Afi/amma',
      description: 'Grandparent',
    },
    relativesRelationSibling: {
      id: 'dess.nps.application:childrenNParents.relatives.relation.sibling',
      defaultMessage: 'Systkini',
      description: 'Sibling',
    },
    relativesRelationStepparent: {
      id: 'dess.nps.application:childrenNParents.relatives.relation.stepparent',
      defaultMessage: 'Stjúpforeldri',
      description: 'Stepparent',
    },
    relativesRelationRelative: {
      id: 'dess.nps.application:childrenNParents.relatives.relation.relative',
      defaultMessage: 'Frændfólk',
      description: 'Relative',
    },
    relativesRelationFriendOrOther: {
      id: 'dess.nps.application:childrenNParents.relatives.relation.friend.or.other',
      defaultMessage: 'Vinafólk/annað',
      description: 'Friend/other',
    },
    relativesCanPickUpChild: {
      id: 'dess.nps.application:childrenNParents.relatives.can.pick.up.child',
      defaultMessage: 'Má sækja barn í skólann',
      description: 'Can pick up the child from school',
    },
    relativesCanPickUpChildTableHeader: {
      id: 'dess.nps.application:childrenNParents.relatives.can.pick.up.child.table.header',
      defaultMessage: 'Má sækja barn',
      description: 'Can pick up the child',
    },
  }),

  primarySchool: defineMessages({
    sectionTitle: {
      id: 'dess.nps.application:primary.school.section.title',
      defaultMessage: 'Grunnskóli',
      description: 'Primary school',
    },

    // Reason for application
    reasonForApplicationSubSectionTitle: {
      id: 'dess.nps.application:primary.school.reason.for.application.sub.section.title',
      defaultMessage: 'Ástæða umsóknar',
      description: 'Reason for application',
    },
    reasonForApplicationDescription: {
      id: 'dess.nps.application:primary.school.reason.for.application.description',
      defaultMessage:
        'Barn á alltaf rétt á skólavist í sínum hverfisskóla. Séu ástæður umsóknar aðrar en flutningur lögheimilis getur verið að skólinn sjái sér ekki fært að taka á móti barninu. Það fer eftir aðstæðum í skólanum hverju sinni, svo sem rými.',
      description:
        'A child always has the right to attend school in his neighborhood school. If the reasons for the application are other than a change of legal residence, the school may not be able to accept the child. It depends on the situation in the school each time, such as space.',
    },
    reasonForApplicationPlaceholder: {
      id: 'dess.nps.application:primary.school.reason.for.application.placeholder',
      defaultMessage: 'Veldu ástæðu',
      description: 'Select reason',
    },
    transferOfLegalDomicile: {
      id: 'dess.nps.application:primary.school.transfer.of.legal.domicile',
      defaultMessage: 'Flutningur lögheimilis',
      description: 'Transfer of legal domicile',
    },
    studyStayForParents: {
      id: 'dess.nps.application:primary.school.study.stay.for.parents',
      defaultMessage: 'Námsdvöl foreldra',
      description: 'Study stay for parents',
    },
    parentsParliamentaryMembership: {
      id: 'dess.nps.application:primary.school.parents.parliamentary.membership',
      defaultMessage: 'Þingmennska foreldris',
      description: "Parent's parliamentary membership",
    },
    temporaryFoster: {
      id: 'dess.nps.application:primary.school.temporary.foster',
      defaultMessage: 'Tímabundið fóstur',
      description: 'Temporary foster',
    },
    expertService: {
      id: 'dess.nps.application:primary.school.expert.service',
      defaultMessage: 'Sérfræðiþjónusta',
      description: 'Expert service',
    },
    sickly: {
      id: 'dess.nps.application:primary.school.sickly',
      defaultMessage: 'Sjúkralega',
      description: 'Sickly',
    },
    livesInTwoHomes: {
      id: 'dess.nps.application:primary.school.lives.in.two.homes',
      defaultMessage: 'Býr á tveimur heimilum',
      description: 'Lives in two homes',
    },
    movingAbroad: {
      id: 'dess.nps.application:primary.school.moving.abroad',
      defaultMessage: 'Flutningur erlendis',
      description: 'Moving abroad',
    },
    otherReasons: {
      id: 'dess.nps.application:primary.school.other.reasons',
      defaultMessage: 'Aðrar ástæður',
      description: 'Other reasons',
    },
    registerNewDomicileAlertMessage: {
      id: 'dess.nps.application:primary.school.register.new.domicile.alert.message',
      defaultMessage: 'Minnum þig á að skrá nýtt lögheimili í Þjóðskrá.',
      description:
        'We remind you to register your new domicile in the National Registry.',
    },
    country: {
      id: 'dess.nps.application:primary.school.country',
      defaultMessage: 'Til hvaða lands er verið að flytja?',
      description: 'What country are you moving to?',
    },
    countryPlaceholder: {
      id: 'dess.nps.application:primary.school.country.placeholder',
      defaultMessage: 'Veldu land',
      description: 'Select a country',
    },

    // Siblings
    siblingsSubSectionTitle: {
      id: 'dess.nps.application:primary.school.siblings.sub.section.title',
      defaultMessage: 'Systkini',
      description: 'Siblings',
    },
    siblingsTitle: {
      id: 'dess.nps.application:primary.school.siblings.title',
      defaultMessage: 'Systkini í sama grunnskóla',
      description: 'Siblings in the same primary school',
    },
    siblingsRegistrationTitle: {
      id: 'dess.nps.application:primary.school.siblings.registration.title',
      defaultMessage: 'Skráning systkinis',
      description: 'Registration of a sibling',
    },
    siblingsAddRelative: {
      id: 'dess.nps.application:primary.school.siblings.add.relative',
      defaultMessage: 'Bæta við systkini',
      description: 'Add a sibling',
    },
    siblingsRegisterRelative: {
      id: 'dess.nps.application:primary.school.siblings.register.relative',
      defaultMessage: 'Skrá systkini',
      description: 'Register sibling',
    },
    siblingsDeleteRelative: {
      id: 'dess.nps.application:primary.school.siblings.delete.relative',
      defaultMessage: 'Eyða systkini',
      description: 'Remove sibling',
    },
    siblingsRelationSibling: {
      id: 'dess.nps.application:primary.school.siblings.relation.sibling',
      defaultMessage: 'Alsystkini',
      description: 'Sibling',
    },
    halfSiblingsRelationSibling: {
      id: 'dess.nps.application:primary.school.siblings.relation.half.sibling',
      defaultMessage: 'Hálfsystkini',
      description: 'Half sibling',
    },
    stepSiblingsRelationSibling: {
      id: 'dess.nps.application:primary.school.siblings.relation.step.sibling',
      defaultMessage: 'Stjúpsystkini',
      description: 'Step sibling',
    },

    // Apply to a new school
    newSchoolSubSectionTitle: {
      id: 'dess.nps.application:primary.school.new.school.sub.section.title',
      defaultMessage: 'Nýr skóli',
      description: 'New school',
    },

    // Starting school
    startingSchoolSubSectionTitle: {
      id: 'dess.nps.application:primary.school.starting.school.sub.section.title',
      defaultMessage: 'Byrjar í skóla',
      description: 'Starting school',
    },
    startingSchoolTitle: {
      id: 'dess.nps.application:primary.school.starting.school.title',
      defaultMessage: 'Hvenær óskar þú eftir að barnið byrji í nýjum skóla?',
      description: 'When do you wish the child to start in a new school?',
    },
    startingSchoolDescription: {
      id: 'dess.nps.application:primary.school.starting.school.description',
      defaultMessage:
        'Við viljum taka vel á móti skólabarninu. Til þess að getað undirbúið komu þess þá biðjum við þig að velja dagsetningu fyrir fyrsta skóladaginn.',
      description:
        'We want to welcome the schoolchild properly. To be able to prepare for its arrival, please select a date for the first school day.',
    },
  }),

  differentNeeds: defineMessages({
    sectionTitle: {
      id: 'dess.nps.application:different.needs.section.title',
      defaultMessage: 'Ólíkar þarfir',
      description: 'Different needs',
    },

    // Language
    languageSubSectionTitle: {
      id: 'dess.nps.application:different.needs.language.sub.section.title',
      defaultMessage: 'Tungumál',
      description: 'Language',
    },
    languageTitle: {
      id: 'dess.nps.application:different.needs.language.title',
      defaultMessage: 'Tungumál barnsins',
      description: "The child's languages",
    },
    languageDescription: {
      id: 'dess.nps.application:different.needs.language.description',
      defaultMessage:
        'Til að hægt sé að koma til móts við þarfir barnsins þarf skólinn að vita hvaða tungumál eru töluð í nærumhverfi þess. Veldu þau tungumál, eitt eða flerir sem töluð eru dagsdaglega á heimilinu í samskiptum við eða í kringum barn.',
      description:
        "In order to meet the child's needs, the school needs to know which languages ​​are spoken in their immediate environment. Choose the languages, one or more, that are spoken daily at home in communication with or around a child.",
    },
    childNativeLanguage: {
      id: 'dess.nps.application:different.needs.child.native.language',
      defaultMessage: 'Hvert er móðurmál barnsins?',
      description: "What is the child's native language?",
    },
    otherLanguagesSpokenDaily: {
      id: 'dess.nps.application:different.needs.other.languages.spoken.daily',
      defaultMessage:
        'Eru önnur tungumál en móðurmál töluð daglega á heimili barnsins?',
      description:
        "Are languages ​​other than the native language spoken daily in the child's home?",
    },
    languagePlaceholder: {
      id: 'dess.nps.application:different.needs.language.placeholder',
      defaultMessage: 'Veldu tungumál',
      description: 'Choose a language',
    },
    icelandicNotSpokenAroundChild: {
      id: 'dess.nps.application:different.needs.icelandic.not.spoken.around.child',
      defaultMessage: 'Það er ekki töluð íslenska í nærumhverfi barnsins',
      description:
        "Icelandic is not spoken in the child's immediate environment",
    },

    // Allergies and intolerances
    allergiesAndIntolerancesSubSectionTitle: {
      id: 'dess.nps.application:different.needs.allergies.and.intolerances.sub.section.title',
      defaultMessage: 'Ofnæmi og óþol',
      description: 'Allergies and intolerances',
    },
    foodAllergiesAndIntolerancesTitle: {
      id: 'dess.nps.application:different.needs.food.allergies.and.intolerances.title',
      defaultMessage: 'Fæðuofnæmi og -óþol',
      description: 'Food allergies and intolerances',
    },
    foodAllergiesAndIntolerancesDescription: {
      id: 'dess.nps.application:different.needs.food.allergies.and.intolerances.description',
      defaultMessage:
        'Er barnið með fæðuofnæmi eða -óþol sem starfsfólk skóla þarf að vera meðvitað um?',
      description:
        'Does the child have food allergies or intolerances that the school staff need to be aware of?',
    },
    childHasFoodAllergies: {
      id: 'dess.nps.application:different.needs.child.has.food.allergies',
      defaultMessage: 'Barnið er með fæðuofnæmi',
      description: 'Child has food allergies',
    },
    typeOfAllergies: {
      id: 'dess.nps.application:different.needs.type.of.allergies',
      defaultMessage: 'Tegund ofnæmis',
      description: 'Type of allergies',
    },
    typeOfAllergiesPlaceholder: {
      id: 'dess.nps.application:different.needs.type.of.allergies.placeholder',
      defaultMessage: 'Veldu tegund ofnæmis',
      description: 'Select type of allergies',
    },
    confirmFoodAllergiesAlertMessage: {
      id: 'dess.nps.application:different.needs.confirm.food.allergies.alert.message',
      defaultMessage:
        'Athugið að skóli mun krefjast vottorðs frá lækni til staðfestingar á fæðuofnæmi.',
      description:
        "Please note that the school will require a doctor's certificate to confirm food allergies.",
    },
    childHasFoodIntolerances: {
      id: 'dess.nps.application:different.needs.child.has.food.intolerances',
      defaultMessage: 'Barnið er með fæðuóþol',
      description: 'Child has food intolerances',
    },
    typeOfIntolerances: {
      id: 'dess.nps.application:different.needs.type.of.intolerances',
      defaultMessage: 'Tegund óþols',
      description: 'Type of intolerances',
    },
    typeOfIntolerancesPlaceholder: {
      id: 'dess.nps.application:different.needs.type.of.intolerances.placeholder',
      defaultMessage: 'Veldu tegund óþols',
      description: 'Select type of intolerances',
    },
    usesEpinephrinePen: {
      id: 'dess.nps.application:different.needs.uses.epinephrine.pen',
      defaultMessage: 'Notar adrenalínpenna',
      description: 'Uses epinephrine pen',
    },
    eggAllergy: {
      id: 'dess.nps.application:different.needs.egg.allergy',
      defaultMessage: 'Eggjaofnæmi',
      description: 'Egg allergy',
    },
    fishAllergy: {
      id: 'dess.nps.application:different.needs.fish.allergy',
      defaultMessage: 'Fiskiofnæmi',
      description: 'Fish allergy',
    },
    nutAllergy: {
      id: 'dess.nps.application:different.needs.nut.allergy',
      defaultMessage: 'Hnetuofnæmi',
      description: 'Nut allergy',
    },
    wheatAllergy: {
      id: 'dess.nps.application:different.needs.wheat.allergy',
      defaultMessage: 'Hveitiofnæmi',
      description: 'Wheat allergy',
    },
    milkAllergy: {
      id: 'dess.nps.application:different.needs.milk.allergy',
      defaultMessage: 'Mjólkurofnæmi',
      description: 'Milk allergy',
    },
    other: {
      id: 'dess.nps.application:different.needs.other',
      defaultMessage: 'Annað',
      description: 'Other',
    },
    lactoseIntolerance: {
      id: 'dess.nps.application:different.needs.lactose.intolerance',
      defaultMessage: 'Mjólkursykuróþol',
      description: 'Lactose intolerance',
    },
    glutenIntolerance: {
      id: 'dess.nps.application:different.needs.gluten.intolerance',
      defaultMessage: 'Glútenóþol',
      description: 'Gluten intolerance',
    },
    msgIntolerance: {
      id: 'dess.nps.application:different.needs.msg.intolerance',
      defaultMessage: 'MSG-óþol',
      description: 'MSG intolerance',
    },

    // Support
    supportSubSectionTitle: {
      id: 'dess.nps.application:different.needs.support.sub.section.title',
      defaultMessage: 'Stuðningur',
      description: 'Support',
    },
    support: {
      id: 'dess.nps.application:different.needs.support',
      defaultMessage: 'Stuðningur',
      description: 'Support',
    },
    supportDescription: {
      id: 'dess.nps.application:different.needs.support.description',
      defaultMessage:
        'Ef barnið þitt er með greiningu um fötlun, þroskafrávik, langvinn veikindi eða alvarlegan sjúkdóm sem gætu haft áhrif á skólagöngu þess, þá sér núverandi skóli barns um að miðla þeim upplýsingum áfram til þess skóla sem sótt er um í.',
      description:
        "If your child has a diagnosis of a disability, developmental disorder, chronic illness or serious illness that could affect their schooling, the child's current school will forward that information to the school they are applying to.",
    },
    developmentalAssessment: {
      id: 'dess.nps.application:different.needs.developmental.assessment',
      defaultMessage:
        'Hafa farið fram skimanir eða greiningar á þroska eða stöðu barnsins í núverandi skóla?',
      description:
        'Have any assessments or diagnoses been conducted on the development or status of the child in the current school?',
    },
    specialSupport: {
      id: 'dess.nps.application:different.needs.special.support',
      defaultMessage:
        'Hefur nemandinn áður notið sérkennslu eða stuðnings í skóla?',
      description:
        'Has the student previously received special education or support in school?',
    },
    requestMeeting: {
      id: 'dess.nps.application:different.needs.request.meeting',
      defaultMessage:
        'Ef þú telur að grunnskólinn þurfi nánari upplýsingar um þarfir barnsins getur þú óskað eftir samtali. Skólinn mun setja sig í samband við þig, þegar nær dregur fyrsta skóladegi',
      description:
        "If you believe that the elementary school needs more information about the child's needs, you can request a meeting. The school will contact you when the first day of school approaches.",
    },
    requestMeetingDescription: {
      id: 'dess.nps.application:different.needs.request.meeting.info',
      defaultMessage: 'Óska eftir samtali við skóla',
      description: 'Request meeting with the school',
    },

    // Use of footage
    useOfFootageSubSectionTitle: {
      id: 'dess.nps.application:different.needs.use.of.footage.sub.section.title',
      defaultMessage: 'Notkun myndefnis',
      description: 'Use of footage',
    },
    photography: {
      id: 'dess.nps.application:different.needs.photography',
      defaultMessage:
        'Samþykki vegna myndatöku, myndbandsupptöku og birtingu myndefnis grunnskóla',
      description:
        'Consent for photography, video recording and publication of elementary school footage',
    },
    photographyDescription: {
      id: 'dess.nps.application:different.needs.photography.description',
      defaultMessage:
        'Þegar kemur að myndatöku og myndbirtingu skal virða sjálfsákvörðunarrétt barna og ungmenna og taka tillit til skoðana og viðhorfa þeirra í samræmi við aldur og þroska.',
      description:
        'When it comes to taking pictures and publishing pictures, the right of self-determination of children and young people must be respected and their views and attitudes taken into account in accordance with their age and maturity.',
    },
    photographyConsent: {
      id: 'dess.nps.application:different.needs.photography.consent',
      defaultMessage:
        'Er heimilt að taka ljósmyndir/myndbönd af barni þínu í daglegu skólastarfi?',
      description:
        'Is it allowed to take photos/videos of your child during daily school activities?',
    },
    photoSchoolPublication: {
      id: 'dess.nps.application:different.needs.photo.school.publication',
      defaultMessage:
        'Má birta myndefni á vettvangi skólans svo sem á vefsíðu hans, í fréttabréfi, samfélagsmiðlum og kynningarefni?',
      description:
        "Can footage be published on the school's website, in the newsletter, social media and promotional materials?",
    },
    photoMediaPublication: {
      id: 'dess.nps.application:different.needs.photo.media.publication',
      defaultMessage:
        'Má birta myndefni hjá þriðja aðila svo sem í fjölmiðlum?',
      description:
        'Can footage be published by third parties such as in the media?',
    },
    photographyInfo: {
      id: 'dess.nps.application:different.needs.photography.info',
      defaultMessage:
        'Ekki er heimilt að nota myndefni í öðrum tilgangi en samþykki nær til.\n\nEf myndefni er notað í öðrum tilgangi, eða myndataka er fyrirhuguð í öðrum tilgangi en samþykki nær til, verða foreldrar upplýstir sérstaklega og sérstaks samþykkis aflað, af viðkomandi skóla.\n\nForeldri getur afturkallað samþykki sitt með því að hafa samband við skóla. Afturköllun hefur þó ekki áhrif á lögmæti þeirrar myndatöku og myndbirtingar sem fram hefur farið fram að þeim tíma.\n\nHver og einn skóli er ábyrgðaraðili vegna persónuupplýsinga sem þar eru unnar. Frekari leiðbeiningar og fræðsla um mynda- og myndbandstökur sem og myndbirtingar má finna á vef viðkomandi sveitarfélags.',
      description:
        'It is not allowed to use visual material for any purpose other than what has been approved.\n\nIf visual material is used for a purpose other than what has been approved, or if photography is intended for a purpose other than what has been approved, parents will be informed specifically and a separate consent will be obtained from the relevant school.\n\nA parent can revoke their consent by contacting the school. However, revocation does not affect the legality of any photography or publication that has already taken place up to that time.\n\nEach school is responsible for the personal information processed there. Further guidance and education on photography and publication, as well as image processing, can be found on the website of the relevant municipality.',
    },
  }),

  overview: defineMessages({
    sectionTitle: {
      id: 'dess.nps.application:overview.section.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    overviewTitle: {
      id: 'dess.nps.application:confirmation.overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    overviewDescription: {
      id: 'dess.nps.application:overview.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    child: {
      id: 'dess.nps.application:overview.child',
      defaultMessage: 'Barn',
      description: 'Child',
    },
    submitButton: {
      id: 'dess.nps.application:overview.submit.button',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application',
    },
    editButton: {
      id: 'dess.nps.application:overview.edit.button',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    parents: {
      id: 'dess.nps.application:overview.parents',
      defaultMessage: 'Foreldri/forsjáraðili',
      description: 'Parent / guardian',
    },
    nativeLanguage: {
      id: 'dess.nps.application:overview.native.language',
      defaultMessage: 'Móðurmál barnsins',
      description: "The child's native language",
    },
    icelandicSpokenAroundChild: {
      id: 'dess.nps.application:overview.icelandic.spoken.around.child',
      defaultMessage: 'Íslenska er töluð í nærumhverfi barnsins',
      description: "Icelandic is spoken in the child's immediate environment",
    },
    foodAllergies: {
      id: 'dess.nps.application:overview.food.allergies',
      defaultMessage: 'Fæðuofnæmi',
      description: 'Food allergies',
    },
    foodIntolerances: {
      id: 'dess.nps.application:overview.food.intolerances',
      defaultMessage: 'Fæðuóþol',
      description: 'Food intolerances',
    },
    usesEpinephrinePen: {
      id: 'dess.nps.application:overview.uses.epinephrine.pen',
      defaultMessage: 'Notar adrenalínpenna',
      description: 'Uses an epinephrine pen',
    },
    schoolTitle: {
      id: 'dess.nps.application:review.school.title',
      defaultMessage: 'Upplýsingar um skóla',
      description: 'Information about school',
    },
    currentSchool: {
      id: 'dess.nps.application:confirm.current.school',
      defaultMessage: 'Núverandi skóli',
      description: 'Current school',
    },
    selectedSchool: {
      id: 'dess.nps.application:confirm.selected.school',
      defaultMessage: 'Valinn skóli',
      description: 'Selected school',
    },
    class: {
      id: 'dess.nps.application:confirm.class',
      defaultMessage: 'Bekkur',
      description: 'Class',
    },
  }),

  conclusion: defineMessages({
    sectionTitle: {
      id: 'dess.nps.application:conclusion.section.title',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    expandableDescription: {
      id: 'dess.nps.application:conclusion.expandable.description#markdown',
      defaultMessage:
        'Sveitarfélagið og skólinn munu taka afstöðu til umsóknarinnar og svara þér eins fljótt og auðið er.\n\nÁður en afstaða er tekin kann að vera þörf á því að afla frekari gagna í þeim tilgangi að upplýsa betur um aðstæður barns og/eða forsjáraðila. Mun þá sveitarfélagið eða skólinn setja sig í samband við þig.\n\nEf umsókn um nýjan skóla er samþykkt, verður forsjáraðili og barn boðað til móttökuviðtals.',
      description:
        "The municipality and the school will make a decision on the application and will respond to you as quickly and easily as possible.\n\nBefore a decision is made, there may be a need to gather further information in order to provide better information about the child's and/or guardian's circumstances. The municipality or the school will then contact you.\n\nIf the application for a new school is approved, the guardian and child will be invited to an admission interview.",
    },
  }),
}

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'dess.nps.application:inReview.form.title',
    defaultMessage: 'Umsókn í nýjan grunnskóla',
    description: 'Application for a new primary school',
  },
})

export const statesMessages = defineMessages({
  draftDescription: {
    id: 'dess.nps.application:draft.description',
    defaultMessage: 'Þú hefur útbúið drög að umsókn.',
    description: 'You have create a draft application.',
  },
  applicationSent: {
    id: 'dess.nps.application:application.sent.title',
    defaultMessage: 'Umsókn hefur verið send.',
    description: 'The application has been sent',
  },
  applicationSentDescription: {
    id: 'dess.nps.application:application.sent.description',
    defaultMessage: 'Hægt er að breyta umsókn',
    description: 'It is possible to edit the application',
  },
})

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'dess.nps.application:error.phone.number',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  nationalId: {
    id: 'dess.nps.application:error.national.id',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'Error message when the kennitala is invalid.',
  },
  relativesRequired: {
    id: 'dess.nps.application:error.relatives.required',
    defaultMessage: 'Nauðsynlegt er að bæta við a.m.k einum aðstandenda',
    description: 'You must add at least one relative',
  },
  siblingsRequired: {
    id: 'dess.nps.application:error.siblings.required',
    defaultMessage: 'Nauðsynlegt er að bæta við a.m.k einu systkini',
    description: 'You must add at least one sibling',
  },
  languagesRequired: {
    id: 'dess.nps.application:error.languages.required',
    defaultMessage: 'Það þarf að velja a.m.k eitt tungumál',
    description: 'At least one language must be selected',
  },
  foodAllergyRequired: {
    id: 'dess.nps.application:error.food.allergy.required',
    defaultMessage: 'Það þarf að velja a.m.k eitt fæðuofnæmi',
    description: 'At least one food allergy must be selected',
  },
  foodIntoleranceRequired: {
    id: 'dess.nps.application:error.food.intolerance.required',
    defaultMessage: 'Það þarf að velja a.m.k eitt fæðuóþol',
    description: 'At least one food intolerance must be selected',
  },
})
