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
    enrollmentApplicationName: {
      id: 'nps.application:enrollment.application.name',
      defaultMessage: 'Innritun í grunnskóla',
      description: 'Enrollment in primary school',
    },
    newPrimarySchoolApplicationName: {
      id: 'nps.application:new.primary.school.application.name',
      defaultMessage: 'Umsókn í nýjan skóla',
      description: 'Application for a new school',
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
    gender: {
      id: 'nps.application:gender',
      defaultMessage: 'Kyn',
      description: 'Gender',
    },
    male: {
      id: 'nps.application:gender.male',
      defaultMessage: 'Karlkyns',
      description: 'Male',
    },
    female: {
      id: 'nps.application:gender.female',
      defaultMessage: 'Kvenkyns',
      description: 'Female',
    },
    otherGender: {
      id: 'nps.application:gender.other',
      defaultMessage: 'Kynsegin/Annað',
      description: 'non-binary/Other',
    },
    language: {
      id: 'nps.application:language',
      defaultMessage: 'Tungumál',
      description: 'Language',
    },
    languagePlaceholder: {
      id: 'nps.application:language.placeholder',
      defaultMessage: 'Veldu tungumál',
      description: 'Choose language',
    },
  }),

  pre: defineMessages({
    externalDataSection: {
      id: 'nps.application:external.data.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },

    // Data collection
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
      defaultMessage: 'Upplýsingar um barn og ólíkar þarfir þess.',
      description: 'Information about the child and their different needs.',
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

  childrenNGuardians: defineMessages({
    sectionTitle: {
      id: 'nps.application:childrenNGuardians.section.title',
      defaultMessage: 'Börn og forsjáraðilar',
      description: 'Children and guardians',
    },

    // Child information
    childInfoSubSectionTitle: {
      id: 'nps.application:childrenNGuardians.child.info.sub.section.title',
      defaultMessage: 'Upplýsingar um barn',
      description: 'Information about child',
    },
    childInfoDescription: {
      id: 'nps.application:childrenNGuardians.child.info.description',
      defaultMessage:
        'Upplýsingar um barn eru sóttar í Þjóðskrá. Athugaðu hvort upplýsingarnar séu réttar áður en þú heldur áfram.',
      description:
        'Information about the child is retrieved from the National Registry. Check that the information is correct before proceeding.',
    },
    childInfoPreferredName: {
      id: 'nps.application:childrenNGuardians.child.info.preferred.name',
      defaultMessage: 'Valið nafn',
      description: 'Preferred name',
    },
    childInfoPronouns: {
      id: 'nps.application:childrenNGuardians.child.info.pronouns',
      defaultMessage: 'Valið persónufornafn',
      description: 'Preferred personal pronoun',
    },
    childInfoPronounsPlaceholder: {
      id: 'nps.application:childrenNGuardians.child.info.pronouns.placeholder',
      defaultMessage: 'Veldu persónufornafn',
      description: 'Select a personal pronoun',
    },
    usePronounAndPreferredName: {
      id: 'nps.application:childrenNGuardians.child.info.use.pronoun.and.preferred.name',
      defaultMessage:
        'Barnið kýs að vera ávarpað með öðru nafni og/eða persónufornafni en hann eða hún',
      description:
        'The child prefers to be addressed by a name and/or personal pronoun other than he or she',
    },
    preferredNameTooltip: {
      id: 'nps.application:childrenNGuardians.child.info.preferred.name.tooltip',
      defaultMessage:
        'Forsjáraðilar geta óskað eftir breytingu á skráðu kyni og nafni barns hjá Þjóðskrá eða barnið sjálft sé það orðið 15 ára. Ef sú breyting er ótímabært má breyta nafni barnsins hér og skrá það nafn sem barn hefur valið sér.',
      description:
        "Guardians can request a change to a child's registered gender and name with the National Registry, or the child themselves if they have reached the age of 15. If the change is premature, the child's name can be changed here and the name the child has chosen can be registered.",
    },
    differentPlaceOfResidence: {
      id: 'nps.application:childrenNGuardians.child.info.different.place.of.residence',
      defaultMessage: 'Er aðsetur barns annað en skráð lögheimili?',
      description:
        "Is the child's temporary residence different from the registered legal domicile?",
    },
    differentPlaceOfResidenceDescription: {
      id: 'nps.application:childrenNGuardians.child.info.different.place.of.residence.description',
      defaultMessage:
        'Aðsetur og lögheimili er ekki sama skráningin. Aðsetur er tímabundin skráning á búsetu sem notuð er þegar dvalið er utan lögheimilis í afmarkaðan tíma svo sem vegna náms eða veikinda.',
      description:
        'Temporary residence and legal domicile are not the same registration. Temporary residence is a temporary registration of residence used when staying outside the legal domicile for a limited time, such as for education or illness.',
    },
    childInfoPlaceOfResidence: {
      id: 'nps.application:childrenNGuardians.child.info.place.of.residence',
      defaultMessage: 'Aðsetur barns',
      description: "Child's temporary residence",
    },

    // Guardians
    guardiansSubSectionTitle: {
      id: 'nps.application:childrenNGuardians.guardians.sub.section.title',
      defaultMessage: 'Forsjáraðilar',
      description: 'Guardians',
    },
    otherGuardian: {
      id: 'nps.application:childrenNGuardians.otherGuardian',
      defaultMessage: 'Upplýsingar um forsjáraðila 2',
      description: 'Information about guardian 2',
    },
    guardian: {
      id: 'nps.application:childrenNGuardians.guardian',
      defaultMessage: 'Upplýsingar um forsjáraðila 1',
      description: 'Information about guardian 1',
    },
    guardiansDescription: {
      id: 'nps.application:childrenNGuardians.guardians.description',
      defaultMessage:
        'Upplýsingar um forsjáraðila eru sóttar úr Þjóðskrá og af Mínum síðum á Ísland.is. Athugaðu hvort símanúmer og netföng séu rétt skráð áður en þú heldur áfram.',
      description:
        'Information about guardians is retrieved from Registers Iceland and from My Pages on Ísland.is. Check that phone numbers and email addresses are entered correctly before proceeding.',
    },
    requiresInterpreter: {
      id: 'nps.application:childrenNGuardians.requires.interpreter',
      defaultMessage: 'Þarf forsjáraðili túlk?',
      description: 'Does the guardian need an interpreter?',
    },

    // Relatives
    relativesSubSectionTitle: {
      id: 'nps.application:childrenNGuardians.relatives.sub.section.title',
      defaultMessage: 'Aðstandendur',
      description: 'Relatives',
    },
    relativesTitle: {
      id: 'nps.application:childrenNGuardians.relatives.title',
      defaultMessage: 'Aðstandendur barns',
      description: "The child's relatives",
    },
    relativesDescription: {
      id: 'nps.application:childrenNGuardians.relatives.description',
      defaultMessage:
        'Aðstandandi er aðili sem er náinn fjölskyldunni og barni og veitir stuðning þegar svo ber við. Skráðu að minnsta kosti einn aðstandanda sem má hafa samband við ef ekki næst í forsjáraðila barnsins. Þú getur bætt allt að fjórum aðilum. Vinsamlegast látið aðstandendur vita af skráningunni.',
      description:
        "A relative is a person who is close to the family and child and provides support when needed. Register at least one relative who can be contacted if the child's guardian cannot be reached. You can add up to four people. Please notify the relatives of the registration.",
    },
    relativesRegistrationTitle: {
      id: 'nps.application:childrenNGuardians.relatives.registration.title',
      defaultMessage: 'Skráning aðstandanda',
      description: 'Registration of a relative',
    },
    relativesAddRelative: {
      id: 'nps.application:childrenNGuardians.relatives.add.relative',
      defaultMessage: 'Bæta við aðstandanda',
      description: 'Add a relative',
    },
    relativesRegisterRelative: {
      id: 'nps.application:childrenNGuardians.relatives.register.relative',
      defaultMessage: 'Skrá aðstandanda',
      description: 'Register relative',
    },
    relativesDeleteRelative: {
      id: 'nps.application:childrenNGuardians.relatives.delete.relative',
      defaultMessage: 'Eyða aðstandanda',
      description: 'Remove relative',
    },
    relativesEditRelative: {
      id: 'nps.application:childrenNGuardians.relatives.edit.relative',
      defaultMessage: 'Breyta aðstandanda',
      description: 'Edit relative',
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
        'Til að aðstoða okkur við að mæta þörfum fjölskyldunnar biðjum við þig að velja þá ástæðu sem best á við í þínu tilfelli.',
      description:
        'To help us meet the needs of your family, please select the reason that is most appropriate in your case.',
    },
    reasonForApplicationEnrollmentDescription: {
      id: 'nps.application:primary.school.reason.for.application.enrollment.description',
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
    currentSchool: {
      id: 'nps.application:primary.school.current.school',
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

    // Current nursery
    currentNurserySubSectionTitle: {
      id: 'nps.application:primary.school.current.nursery.sub.section.title',
      defaultMessage: 'Upplýsingar um núverandi leikskóla',
      description: 'Information about current nursery',
    },
    nursery: {
      id: 'nps.application:primary.school.nursery',
      defaultMessage: 'Leikskóli',
      description: 'Nursery',
    },
    nurseryPlaceholder: {
      id: 'nps.application:primary.school.nursery.placeholder',
      defaultMessage: 'Veldu leikskóla',
      description: 'Select nursery',
    },

    // School page
    schoolSubSectionTitle: {
      id: 'nps.application:primary.school.school.sub.section.title',
      defaultMessage: 'Skóli',
      description: 'School',
    },
    schoolSubSectionDescription: {
      id: 'nps.application:primary.school.school.sub.section.description',
      defaultMessage:
        'Börn eiga rétt á skólavist í því sveitarfélagi þar sem þau eru með skráð lögheimili. Einstaka sveitarfélög úthluta barni námsvist í hverfisskóla eða sem næst þeirra lögheimili. Í báðun tilfellum geta foreldrar sótt um annan skóla hvort sem er innan sveitarfélags eða utan. Ekki er þó víst að nýr skóli sjái sér fært að taka á móti barni. Er það ávalt háð aðstæðum hverju sinni.',
      description:
        'Children have the right to attend school in the municipality where they have their registered domicile. Some municipalities assign a child to a neighbourhood school or the school closest to their domicile. In both cases, parents can apply for another school, whether within the municipality or outside it. However, it is not certain that the new school will be able to accept the child. This is always subject to the circumstances at the time.',
    },
    schoolApplyForNeighbourhoodSchoolLabel: {
      id: 'nps.application:primary.school.school.apply.for.neighbourhood.school.label',
      defaultMessage: 'Staðfesta innritun í hverfisskóla',
      description: 'Confirm enrollment in the neighbourhood school',
    },
    schoolApplyForNeighbourhoodSchoolSubLabel: {
      id: 'nps.application:primary.school.school.apply.for.neighbourhood.school.sub.label',
      defaultMessage: 'Hverfisskólinn ykkar er: {neighbourhoodSchoolName}',
      description: 'Your neighbourhood school is: {neighbourhoodSchoolName}',
    },
    schoolApplyForOtherSchoolLabel: {
      id: 'nps.application:primary.school.school.apply.for.other.school.label',
      defaultMessage: 'Hafna innritun í hverfisskóla',
      description: 'Decline enrollment in the neighbourhood school',
    },
    schoolApplyForOtherSchoolSubLabel: {
      id: 'nps.application:primary.school.school.apply.for.other.school.sub.label',
      defaultMessage:
        'Þú getur sótt um fyrir barnið þitt í skóla utan þíns skólahverfis, en ekki er víst að skólinn geti tekið við barninu.',
      description:
        'You can apply for your child to attend a school outside your school district, but it is not certain that the school will be able to accept your child.',
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
    expectedEndDateDescription: {
      id: 'nps.application:primary.school.expected.end.date.description',
      defaultMessage: 'Vinsamlegast skráið áætlaðan lokadag',
      description: 'Please provide an expected end date',
    },
    expectedEndDateTitle: {
      id: 'nps.application:primary.school.expected.end.date.title',
      defaultMessage: 'Lokadagur',
      description: 'End date',
    },
    temporaryStay: {
      id: 'nps.application:primary.school.temporary.stay',
      defaultMessage: 'Er skóladvölin tímabundin?',
      description: 'Is the school stay temporary?',
    },
  }),

  differentNeeds: defineMessages({
    sectionTitle: {
      id: 'nps.application:different.needs.section.title',
      defaultMessage: 'Ólíkar þarfir',
      description: 'Different needs',
    },

    // Language
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
        "In order to meet the child's needs, the school needs to know what languages are spoken in its surroundings. Select one or more languages that are spoken daily in the home when communicating with or around a child.",
    },
    languageSubTitle: {
      id: 'nps.application:different.needs.language.sub.title',
      defaultMessage:
        'Hvað á best við í tilfelli barnsins og tungumála sem notuð eru í daglegu lífi fjölskyldunnar?',
      description:
        "What best describes the child's daily language environment?",
    },
    languageEnvironmentTitle: {
      id: 'nps.application:different.needs.language.environment.title',
      defaultMessage: 'Tungumálaumhverfi',
      description: 'Language environment',
    },
    languageEnvironmentPlaceholder: {
      id: 'nps.application:different.needs.language.environment.placeholder',
      defaultMessage: 'Veldu það sem best á við',
      description: 'Choose the most appropriate',
    },
    onlyIcelandicOption: {
      id: 'nps.application:different.needs.language.only.icelandic.option',
      defaultMessage: 'Aðeins töluð íslenska',
      description: 'Only Icelandic spoken',
    },
    icelandicAndForeignOption: {
      id: 'nps.application:different.needs.language.icelandic.and.foreign.option',
      defaultMessage: 'Töluð íslenska og annað/önnur tungumál',
      description: 'Icelandic and one or more languages spoken',
    },
    onlyForeignOption: {
      id: 'nps.application:different.needs.language.only.foreign.option',
      defaultMessage: 'Aðeins töluð önnur tungumál en íslenska',
      description: 'Only languages other than Icelandic spoken',
    },
    languagesDescription: {
      id: 'nps.application:different.needs.languages.description',
      defaultMessage:
        'Raðaðu tungumálunum eftir því hvaða tungumál er mest er notað. Það sem er mest notað er nr. 1 og svo koll af kolli.',
      description:
        'Arrange the languages according to which language is most frequently used. What is most used is number 1 and so on.',
    },
    languageSelectionTitle: {
      id: 'nps.application:different.needs.language.selection.title',
      defaultMessage: 'Tungumál {index}',
      description: 'Language {index}',
    },
    addLanguageButton: {
      id: 'nps.application:different.needs.language.add.button',
      defaultMessage: 'Bæta við tungumáli',
      description: 'Add language',
    },
    removeLanguageButton: {
      id: 'nps.application:different.needs.language.remove.button',
      defaultMessage: 'Fjarlægja tungumál',
      description: 'Remove language',
    },
    preferredLanguageTitle: {
      id: 'nps.application:different.needs.preferred.language.title',
      defaultMessage:
        'Á hvaða tungumáli sem þú hefur valið, finnst barninu sjálfu best að tjá sig á?',
      description:
        'Of the chosen languages, in which language does your child feel most comfortable expressing themselves?',
    },
    signLanguage: {
      id: 'nps.application:different.needs.sign.language',
      defaultMessage: 'Notar barnið táknmál?',
      description: 'Does the child use sign language?',
    },

    // Health protection
    healthProtectionSubSectionTitle: {
      id: 'nps.application:different.needs.health.protection.sub.section.title',
      defaultMessage: 'Heilsuvernd',
      description: 'Health protection',
    },
    healthProtectionSubSectionDescription: {
      id: 'nps.application:different.needs.health.protection.sub.section.description',
      defaultMessage:
        'Heilsuvernd skólabarna er hluti af heilsugæslunni og framhald af ung- og smábarnavernd. Til að skólahjúkrunarfræðingur geti sinnt heilsuvernd skólabarns, haft umsjón með umönnun þess þegar svo ber við og veitt starfsfólki skólans viðeigandi fræðslu og ráðgjöf um rétt viðbrögð, er mikilvægt að hann hafi nauðsynlegar upplýsingar um heilsu barnsins.',
      description:
        'Health protection for school children is part of the healthcare system and follows from child health care. For the school nurse to be able to provide health protection for the school child, manage their care when needed, and provide appropriate education and advice to school staff on the right responses, it is important that they have necessary information about the childs health.',
    },
    allergiesAndIntolerances: {
      id: 'nps.application:different.needs.health.protection.allergies.and.intolerances',
      defaultMessage:
        'Er barnið með ofnæmi eða óþol sem starfsfólk skóla þarf að vera meðvitað um?',
      description:
        'Does the child have any allergies or intolerances that school staff need to be aware of?',
    },
    hasFoodAllergiesOrIntolerances: {
      id: 'nps.application:different.needs.health.protection.has.food.allergies.or.intolerances',
      defaultMessage: 'Barnið er með fæðuofnæmi eða -óþol',
      description: 'The child has food allergies or intolerances',
    },
    typeOfFoodAllergiesOrIntolerances: {
      id: 'nps.application:different.needs.health.protection.type.of.food.allergies.or.intolerances',
      defaultMessage: 'Tegund fæðuofnæmis eða -óþols',
      description: 'Type of food allergies or intolerances',
    },
    typeOfFoodAllergiesOrIntolerancesPlaceholder: {
      id: 'nps.application:different.needs.health.protection.type.of.food.allergies.or.intolerances.placeholder',
      defaultMessage: 'Veldu tegund fæðuofnæmis eða -óþols',
      description: 'Select type of food allergies or intolerances',
    },
    hasOtherAllergies: {
      id: 'nps.application:different.needs.health.protection.has.other.allergies',
      defaultMessage: 'Barnið er með annað ofnæmi',
      description: 'The child has other allergies',
    },
    typeOfOtherAllergies: {
      id: 'nps.application:different.needs.health.protection.type.of.other.allergies',
      defaultMessage: 'Tegund ofnæmis',
      description: 'Type of allergies',
    },
    typeOfOtherAllergiesPlaceholder: {
      id: 'nps.application:different.needs.health.protection.type.of.other.allergies.placeholder',
      defaultMessage: 'Veldu tegund ofnæmis',
      description: 'Select type of allergies',
    },
    allergiesCertificateAlertMessage: {
      id: 'nps.application:different.needs.health.protection.allergies.certificate.alert.message',
      defaultMessage:
        'Athugið að skóli getur óskað eftir vottorði til staðfestingar á ofnæmi.',
      description:
        'Please note that the school may request a certificate to confirm allergies.',
    },
    usesEpiPen: {
      id: 'nps.application:different.needs.health.protection.uses.epi.pen',
      defaultMessage:
        'Þarf barnið að hafa tiltækan adrenalínpenna (epi-pen) vegna ofnæmis?',
      description:
        'Does the child need to have an epi-pen available for allergies?',
    },
    hasConfirmedMedicalDiagnoses: {
      id: 'nps.application:different.needs.health.protection.has.confirmed.medical.diagnoses',
      defaultMessage:
        'Er barnið með staðfesta læknisfræðilega greiningu sem skólinn þarf að kunna að bregðast rétt við?',
      description:
        'Does the child have a confirmed medical diagnosis that the school needs to know how to respond to correctly?',
    },
    hasConfirmedMedicalDiagnosesDescription: {
      id: 'nps.application:different.needs.health.protection.has.confirmed.medical.diagnoses.description',
      defaultMessage:
        'Hér er átt við greiningar eins og flogaveiki, sykursýki eða blóðstorknunarsjúkdóm',
      description:
        'This refers to diagnoses such as epilepsy, diabetes, or blood clotting disorders',
    },
    requestsMedicationAdministration: {
      id: 'nps.application:different.needs.health.protection.requests.medication.administration',
      defaultMessage:
        'Er óskað eftir aðstoð við barn vegna lyfjagjafar á skólatíma?',
      description:
        'Is assistance requested for a child due to medication administration during school hours?',
    },
    requestsMedicationAdministrationTooltip: {
      id: 'nps.application:different.needs.health.protection.requests.medication.administration.tooltip',
      defaultMessage:
        'Í fæstum tilvikum geta börn borið ábyrgð á lyfjatöku sinni. Þar skiptir þó aldur og lyfjategund máli. Ábyrgðin er forráðamanna en hjúkrunarfræðingar og starfsmenn skóla aðstoða við lyfjatökuna. Meginreglan er sú að barn á aðeins að fá lyf á skólatíma sem forráðamenn hafa komið með í skólann og óskað eftir að barnið fái.',
      description:
        'In most cases, children cannot be responsible for taking their own medication. However, age and type of medication matter. The responsibility lies with the guardians, but nurses and school staff assist with medication administration. The main rule is that a child should only receive medication at school that the guardians have brought to the school and requested the child to take.',
    },
    schoolNurseAlertMessage: {
      id: 'nps.application:different.needs.health.protection.school.nurse.alert.message',
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
        'Börn eru eins ólík og þau eru mörg. Sum börn þurfa á stuðningi að halda til að líða betur og nýta styrkleika sína sem best. Stuðningur við barn í skólastarfi er veittur af stoðþjónustu skóla og hefur það að markmiðið að tryggja að sérhvert barn fái rétta aðstoð, á réttum tíma, frá réttum aðila. \n\nEf barnið þitt er með greiningu um fötlun, þroskafrávik, langvinn veikindi eða alvarlegan sjúkdóm sem gætu haft áhrif á skólagöngu þess, þá sér núverandi skóli barns um að miðla þeim upplýsingum áfram til þess skóla sem sótt er um í',
      description:
        'Children are as diverse as they are numerous. Some need support in order to feel better and make the best use of their strengths. Support for children in school is provided by the schools support services, with the aim of ensuring that every child receives the right assistance, at the right time, from the right professional. \n\nIf your child has a diagnosis of a disability, developmental delay, chronic illness, or serious condition that may impact their schooling, their current school is responsible for passing that information on to the school you are applying to.',
    },
    enrollmentSupportDescription: {
      id: 'nps.application:different.needs.enrollment.support.description',
      defaultMessage:
        'Börn eru eins ólík og þau eru mörg. Sum börn þurfa á stuðningi að halda til að líða betur og nýta styrkleika sína sem best. Stuðningur við barn í skólastarfi er veittur af stoðþjónustu skóla og hefur það að markmiðið að tryggja að sérhvert barn fái rétta aðstoð, á réttum tíma, frá réttum aðila. \n\nEf barnið þitt er með greiningu um fötlun, þroskafrávik, langvinn veikindi eða alvarlegan sjúkdóm sem gætu haft áhrif á skólagöngu þess, þá sér núverandi leikskóli barns um að miðla þeim upplýsingum áfram til þess skóla sem sótt er um í.',
      description:
        'Children are as different as they are many. Some children need support to feel better and make the most of their strengths. Support in school is provided by the school’s support services and aims to ensure that every child receives the right help, at the right time, from the right person. \n\nIf your child has been diagnosed with a disability, developmental delay, chronic illness, or serious medical condition that could affect their schooling, their current nursery is responsible for passing that information on to the school you are applying to.',
    },
    hasDiagnoses: {
      id: 'nps.application:different.needs.has.diagnoses',
      defaultMessage:
        'Hafa farið fram skimanir eða greiningar á þroska eða stöðu barnsins í núverandi skóla?',
      description:
        'Have any assessments or diagnoses been conducted on the development or status of the child in the current school?',
    },
    enrollmentHasDiagnoses: {
      id: 'nps.application:different.needs.enrollment.has.diagnoses',
      defaultMessage:
        'Hafa farið fram skimanir eða greiningar á þroska eða stöðu barnsins í núverandi leikskóla?',
      description:
        'Have any assessments or diagnoses been conducted on the development or status of the child in the current nursery?',
    },
    hasHadSupport: {
      id: 'nps.application:different.needs.has.had.support',
      defaultMessage:
        'Hefur nemandinn áður notið sérkennslu eða stuðnings í skóla?',
      description:
        'Has the student previously received special education or support in school?',
    },
    enrollmentHasHadSupport: {
      id: 'nps.application:different.needs.enrollment.has.had.support',
      defaultMessage:
        'Hefur nemandinn áður notið sérkennslu eða stuðnings í leikskóla?',
      description:
        'Has the student previously received special education or support in nursery?',
    },
    hasWelfareContact: {
      id: 'nps.application:different.needs.has.welfare.contact',
      defaultMessage: 'Hefur barnið verið með tengilið farsældar?',
      description: 'Has the child had a welfare contact person?',
    },
    hasWelfarePrimarySchoolContactDescription: {
      id: 'nps.application:different.needs.has.welfare.contact.description',
      defaultMessage:
        'Tengiliður farsældar er sá aðili innan grunnskólans sem veitir upplýsingar og leiðbeiningar og hefur verið foreldrum innan handar við að sækja um þjónustu fyrir barnið sitt.',
      description:
        'The welfare contact person is the individual within the primary school who provides information and guidance, and has assisted parents in applying for services for their child.',
    },
    hasWelfareNurserySchoolContactDescription: {
      id: 'nps.application:different.needs.has.welfare.contact.description',
      defaultMessage:
        'Tengiliður farsældar er sá aðili innan leikskólans sem veitir upplýsingar og leiðbeiningar og hefur verið foreldrum innan handar við að sækja um þjónustu fyrir barnið sitt.',
      description:
        'The welfare contact person is the individual within the nursery who provides information and guidance, and has assisted parents in applying for services for their child.',
    },
    welfareContactName: {
      id: 'nps.application:different.needs.welfare.contact.name',
      defaultMessage: 'Nafn tengiliðs',
      description: 'Contact name',
    },
    welfareContactEmail: {
      id: 'nps.application:different.needs.welfare.contact.email',
      defaultMessage: 'Netfang tengiliðs',
      description: 'Contact email',
    },
    hasIntegratedServices: {
      id: 'nps.application:different.needs.has.integrated.services',
      defaultMessage: 'Hefur barnið verið með samþætta þjónustu?',
      description: 'Has the child had integrated services?',
    },
    hasIntegratedServicesDescription: {
      id: 'nps.application:different.needs.has.integrated.services.description',
      defaultMessage:
        'Foreldri hefur óskað eftir og gefið leyfi fyrir því að aðilar sem koma að stuðningi við barnið tali saman og deili upplýsingum sem hjálpað geta barni sín á milli.',
      description:
        "The parent has requested and given permission for the parties involved in the child's support to communicate and share information that can help the child.",
    },
    hasCaseManager: {
      id: 'nps.application:different.needs.has.case.manager',
      defaultMessage: 'Hefur barnið verið með málastjóra?',
      description: 'Has the child had a case manager?',
    },
    hasCaseManagerDescription: {
      id: 'nps.application:different.needs.has.case.manager.description',
      defaultMessage:
        'Málastjóri er sá aðili á vegum sveitarfélagsins sem tilnefndur hefur verið til að stýra stuðningsteymi barnsins og styðja við fjölskylduna.',
      description:
        "A case manager is the person appointed by the municipality to lead the child's support team and support the family.",
    },
    caseManagerName: {
      id: 'nps.application:different.needs.case.manager.name',
      defaultMessage: 'Nafn málastjóra',
      description: 'Case manager name',
    },
    caseManagerEmail: {
      id: 'nps.application:different.needs.case.manager.email',
      defaultMessage: 'Netfang málastjóra',
      description: 'Case manager email address',
    },
    internationalSchoolSupportAlertMessage: {
      id: 'nps.application:different.needs.international.school.alert.message#markdown',
      defaultMessage:
        'If your application is accepted, the school will ask you to send report cards from the last two years, external standardized test results and special needs documentation.',
      description:
        'If your application is accepted, the school will ask you to send report cards from the last two years, external standardized test results and special needs documentation.',
    },
    supportAlertMessage: {
      id: 'nps.application:different.needs.support.alert.message#markdown',
      defaultMessage:
        'Við flutning barns milli leik- og/eða grunnskóla sjá stjórnendur skólanna til þess að persónuupplýsingum um barnið sem nauðsynlegar eru fyrir velferð og aðlögun þess í nýjum skóla, sé miðlað með tryggum og öruggum hætti. \n\nPersónuupplýsingar geta verið:\n\n1. Almennar upplýsingar um félagslega stöðu og þroska barna.\n\n2. Læknisfræðilegar, sálfræðilegar og sérkennslufræðilegar greiningar eða aðrar greiningar og sérúrræði fyrir barn.\n\n3. Sérkennsluumsóknir, námsáætlanir vegna sérúrræða, einstaklingsnámskrár og aðrar bakgrunnsupplýsingar sem að gagni geta komið fyrir velferð og aðlögun barns í skólanum.\n\n4. Prófeinkunnir og vitnisburðir barns, mætingar og/eða agabrot\n\n5. Hverskonar skrifleg eða stafræn gögn svo sem skýrslur, greinargerðir og umsagnir er varða velferð og skólagöngu barns.',
      description:
        "When a child transfers between nursery and/or primary schools, school administrators ensure that personal information about the child that is necessary for their well-being and adjustment to the new school is communicated in a secure and safe manner. \n\nPersonal data can be: \n\n1. General information about the social status and development of children. \n\n2. Medical, psychological, and special education assessments or other evaluations and specialized interventions for a child. \n\n3. Applications for special education, educational plans related to specialized support, individualized learning programs, and other background information that may be useful for the welfare and adaptation of a child in school.\n\n4. The child's exam results and testimonials, attendance, and/or disciplinary infractions.\n\n5. Any kind of written or digital data such as reports, statements, and evaluations concerning the welfare and schooling of the child.",
    },
    requestingMeeting: {
      id: 'nps.application:different.needs.requesting.meeting',
      defaultMessage:
        'Ef þú telur að grunnskólinn þurfi nánari upplýsingar um þarfir barnsins getur þú óskað eftir samtali. Skólinn mun setja sig í samband við þig, þegar nær dregur fyrsta skóladegi',
      description:
        "If you believe that the primary school needs more information about the child's needs, you can request a meeting. The school will contact you when the first day of school approaches.",
    },
    requestingMeetingDescription: {
      id: 'nps.application:different.needs.requesting.meeting.description',
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
    guardians: {
      id: 'nps.application:overview.guardians',
      defaultMessage: 'Forsjáraðili {index}',
      description: 'Guardian {index}',
    },
    languageEnvironment: {
      id: 'nps.application:overview.language.environment',
      defaultMessage: 'Tungumálaumhverfi',
      description: 'Language environment',
    },
    preferredLanguage: {
      id: 'nps.application:overview.preferred.language',
      defaultMessage: 'Tungumálið sem barninu finnst best að tjá sig á',
      description: 'The language the child prefers to express themselves in',
    },
    schoolTitle: {
      id: 'nps.application:overview.school.title',
      defaultMessage: 'Upplýsingar um skóla',
      description: 'Information about school',
    },
    selectedSchool: {
      id: 'nps.application:overview.selected.school',
      defaultMessage: 'Valinn skóli',
      description: 'Selected school',
    },
    neighbourhoodSchool: {
      id: 'nps.application:overview.neigbourhood.school',
      defaultMessage: 'Hverfisskóli',
      description: 'Neighbourhood school',
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
    currentNursery: {
      id: 'nps.application:overview.current.nursery',
      defaultMessage: 'Núverandi leikskóli',
      description: 'Current nursery',
    },
    expectedEndDate: {
      id: 'nps.application:overview.expected.end.date',
      defaultMessage: 'Áætlaður lokadagur',
      description: 'Expected end date',
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
    privateSchoolExpandableDescription: {
      id: 'nps.application:conclusion.private.school.expandable.description#markdown',
      defaultMessage:
        'Takk fyrir að senda inn umsókn.\n\nUmsóknin fer fyrst til umfjöllunar hjá því sveitarfélagi sem barnið á lögheimili en greiðsluþátttaka sveitarfélagsins, til viðbótar við mótframlag umsækjenda, er forsenda þess að barnið fái skólavist í sjálfstætt starfandi skóla.\n\nÞegar ákvörðun um greiðsluþátttöku liggur fyrir tekur skólinn sjálfur umsóknina til umfjöllunar. Ákvörðun skólastjóra er send til foreldra eins fljótt og auðið er.',
      description:
        "Thank you for submitting your application.\n\nFirst the application is reviewed by the municipality in which the child has their place of residence, because the municipality's contribution, in addition to the applicant's contribution, is a prerequisite for the child to be enrolled in an private school.\n\nWhen a decision on payment participation has been made, the school itself will review the application. The decision will be sent to the parents as soon as possible.",
    },
  }),
}

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
  relativesRequired: {
    id: 'nps.application:error.relatives.required',
    defaultMessage:
      'Nauðsynlegt er að bæta við að minnsta kosti einum aðstandanda.',
    description: 'You must add at least one relative',
  },
  siblingsRequired: {
    id: 'nps.application:error.siblings.required',
    defaultMessage: 'Nauðsynlegt er að bæta við að minnsta kosti einu systkini',
    description: 'You must add at least one sibling',
  },
  languagesRequired: {
    id: 'nps.application:error.languages.required',
    defaultMessage: 'Það þarf að velja að minnsta kosti eitt tungumál',
    description: 'At least one language must be selected',
  },
  languageRequired: {
    id: 'nps.application:error.language.required',
    defaultMessage: 'Það þarf að velja tungumál',
    description: 'Language must be selected',
  },
  twoLanguagesRequired: {
    id: 'nps.application:error.two.languages.required',
    defaultMessage: 'Það þarf að velja að minnsta kosti tvö tungumál',
    description: 'At least two language must be selected',
  },
  expectedEndDateRequired: {
    id: 'nps.application:error.expected.end.date.required',
    defaultMessage: 'Það þarf að velja áætlaðan lokadag',
    description: 'You must select an expected end date',
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
  expectedEndDateMessage: {
    id: 'nps.application:expected.end.date.less.than.start.date',
    defaultMessage: 'Lokadagur má ekki vera fyrir byrjunardag',
    description: 'End date cannot be before start date',
  },
  foodAllergiesOrIntolerancesRequired: {
    id: 'nps.application:error.food.allergies.or.intolerances.required',
    defaultMessage:
      'Það þarf að velja að minnsta kosti eitt fæðuofnæmi eða -óþol',
    description: 'At least one food allergy or intolerance must be selected',
  },
  otherAllergiesRequired: {
    id: 'nps.application:error.other.allergies.required',
    defaultMessage: 'Það þarf að velja að minnsta kosti eitt ofnæmi',
    description: 'At least one allergy must be selected',
  },
})
