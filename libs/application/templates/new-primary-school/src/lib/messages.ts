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
    postalcode: {
      id: 'dess.nps.application:postalcode',
      defaultMessage: 'Póstnúmer',
      description: 'Postalcode',
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
    noChildrenFoundTitle: {
      id: 'dess.nps.application:prerequisites.nochildren.title',
      defaultMessage: 'Því miður ert þú ekki með skráð barn á grunnskólaaldri',
      description:
        'Unfortunately, you do not have a child registered at primary school age.',
    },
    noChildrenFoundReasons: {
      id: 'dess.nps.application:prerequisites.nochildren.reasons#markdown',
      defaultMessage:
        'Ástæður fyrir því gætu verið eftirfarandi:\n\n\n* Þú ert ekki skráður forsjáraðili hjá Þjóðskrá með lögheimilistengsl. \n* Barnið er ekki skráð í Þjóðskrá.',
      description:
        'You are not registered as a legal guardian with a domicile connection in the National Registry. The child is not registered in the National Registry.',
    },
    noChildrenFoundNationalRegistryInfo: {
      id: 'dess.nps.application:prerequisites.nochildren.national.registry.info#markdown',
      defaultMessage:
        'Ef þú telur þessi atriði eiga við þig, vinsamlegast hafið samband við Þjóðskrá:\n\n\nBorgartúni 21, 105 Reykjavík\n\nSími: [515 5300](tel:5155300)\n\nOpið frá 10-15 alla virka daga',
      description:
        'If you believe these points apply to you, please contact the National Registry: Borgartún 21, 105 Reykjavík Phone: 515 5300 Open from 10 AM to 3 PM on weekdays',
    },
    noChildrenFoundMMSInfo: {
      id: 'dess.nps.application:prerequisites.nochildren.mmm.info#markdown',
      defaultMessage:
        'Annars er hægt að hafa samband við Miðstöð menntunar og skólaþjónustu:\n\n\nSími: [514 7500](tel:5147500)\n\nNetfang: [postur@midstodmenntunar.is](mailto:postur@midstodmenntunar.is)',
      description:
        'Otherwise, you can contact the Directorate of Education and School Services: Phone: 514 7500 Email: postur@midstodmenntunar.is',
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

    // Apply to a new school
    newSchoolSubSectionTitle: {
      id: 'dess.nps.application:primary.school.new.school.section.title',
      defaultMessage: 'Nýr skóli',
      description: 'New school',
    },

    // Reason for transfer
    reasonForTransferSubSectionTitle: {
      id: 'dess.nps.application:primary.school.starting.school.reason.for.transfer.section.title',
      defaultMessage: 'Ástæða flutnings',
      description: 'Reason for transfer',
    },

    // Siblings
    siblingsSubSectionTitle: {
      id: 'dess.nps.application:primary.school.starting.school.siblings.section.title',
      defaultMessage: 'Systkini',
      description: 'Siblings',
    },
    siblingsTitle: {
      id: 'dess.nps.application:primary.school.starting.school.siblings.title',
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

    // Starting school
    startingSchoolSubSectionTitle: {
      id: 'dess.nps.application:primary.school.starting.school.sub.section.title',
      defaultMessage: 'Byrjar í skóla',
      description: 'Starting school',
    },
    startingSchoolTitle: {
      id: 'dess.nps.application:primary.school.starting.school.title',
      defaultMessage: 'Hvenær viltu að barnið byrji í nýja skólanum?',
      description: 'When do you want your child to start at the new school?',
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
      id: 'dess.nps.application:different.needs.language.section.title',
      defaultMessage: 'Tungumál',
      description: 'Language',
    },

    // School Meal
    schoolMealSubSectionTitle: {
      id: 'dess.nps.application:different.needs.school.meal.section.title',
      defaultMessage: 'Skólamáltíð',
      description: 'School Meal',
    },

    // Support
    supportSubSectionTitle: {
      id: 'dess.nps.application:different.needs.support.section.title',
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
        'Hefur farið fram þroskamat eða skimun námslegri stöðu nemandans',
      description:
        "Has there been a developmental assessment or screening of the student's academic status",
    },
    specialSupport: {
      id: 'dess.nps.application:different.needs.special.support',
      defaultMessage: 'Hefur nemandinn þörf fyrir sérstuðning í skóla',
      description: 'Does the student need special support at school',
    },
    supportInfo: {
      id: 'dess.nps.application:different.needs.support.info',
      defaultMessage:
        'Ef um er að ræða skólaflutning milli landa flytjast gögnin ekki sjálfkrafa á milli. Vinsamlegast hafðu beint samband við skólann ef gera þarf sérstakar ráðstafanir vegna barnsins.',
      description:
        'In the case of a school transfer between countries, the data is not transferred automatically. Please contact the school directly if special arrangements need to be made for the child.',
    },
    requestMeeting: {
      id: 'dess.nps.application:different.needs.request.meeting',
      defaultMessage:
        'Ef þú telur að grunnskólinn þurfi nánari upplýsingar um þarfir barnsins geturðu óskað eftir samtali við umsjónarkennara. Umsjónarkennari mun setja sig í samband við þig áður en barnið byrjar í skólanum.',
      description:
        "If you believe that the elementary school needs more information about the child's needs, you can request a conversation with the supervising teacher. The supervising teacher will contact you before the child starts school.",
    },
    requestMeetingDescription: {
      id: 'dess.nps.application:different.needs.request.meeting.info',
      defaultMessage: 'Óska eftir samtali við skóla',
      description: 'Request meeting with the school',
    },

    // Use of footage
    useOfFootageSubSectionTitle: {
      id: 'dess.nps.application:different.needs.use.of.footage.section.title',
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
        'Ef myndefni er notað í öðrum tilgangi, eða myndataka er fyrirhuguð í öðrum tilgangi en samþykki nær til, þarf að upplýsa foreldra og afla sérstaks samþykkis.',
      description:
        'If footage is used for other purposes, or photography is planned for purposes other than consented for, parents must be informed and special consent obtained.',
    },
  }),

  confirm: defineMessages({
    sectionTitle: {
      id: 'dess.nps.application:confirmation.section.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    overviewDescription: {
      id: 'dess.nps.application:confirmation.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    child: {
      id: 'dess.nps.application:confirmation.child',
      defaultMessage: 'Barn',
      description: 'Child',
    },
    submitButton: {
      id: 'dess.nps.application:confirm.submit.button',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application',
    },
    editButton: {
      id: 'dess.nps.application:confirm.edit.button',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    email: {
      id: 'dess.nps.application:review.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    phoneNumber: {
      id: 'dess.nps.application:review.email',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    parents: {
      id: 'dess.nps.application:review.parents',
      defaultMessage: 'Foreldri/forsjáraðili',
      description: 'Parent / guardian',
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
        'Skólastjóri mun taka afstöðu til umsóknarinnar eftir aðstæðum í skólanum hversu sinni og svara þér eins fljótt og auðið er í tölvupósti. Svarið mun einnig birtast í stafrænu pósthólfi hér á Island.is',
      description:
        'The principal will evaluate the application based on the current circumstances at the school and will respond to you as soon as possible by email. The response will also appear in the digital mailbox here on Island.is.',
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
})
