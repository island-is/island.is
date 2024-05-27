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
    fullName: {
      id: 'dess.nps.application:childrenNParents.full.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'dess.nps.application:childrenNParents.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National id',
    },
    email: {
      id: 'dess.nps.application:childrenNParents.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    municipality: {
      id: 'dess.nps.application:childrenNParents.municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
    postalcode: {
      id: 'dess.nps.application:childrenNParents.postalcode',
      defaultMessage: 'Póstfang',
      description: 'Postalcode',
    },
    address: {
      id: 'dess.nps.application:childrenNParents.address',
      defaultMessage: 'Heimilisfang',
      description: 'Address',
    },
    phoneNumber: {
      id: 'dess.nps.application:childrenNParents.phoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'Phonenumber',
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
        'Aðeins forsjáaraðili sem deilir lögheimili með barni getur skráð það í grunnskóla. Ef þú sérð ekki barnið þitt í þessu ferli, þá bendum við á að skoða upplýsingar um forsjá á island.is',
      description: 'Parents section description',
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
    relativesRelation: {
      id: 'dess.nps.application:childrenNParents.relatives.relation',
      defaultMessage: 'Tengsl',
      description: 'Relation',
    },
    relativesRelationPlaceholder: {
      id: 'dess.nps.application:childrenNParents.relatives.relation.placeholder',
      defaultMessage: 'Veldu tengsl',
      description: 'Select relation',
    },
    relativesRelationGrandparents: {
      id: 'dess.nps.application:childrenNParents.relatives.relation.randparents',
      defaultMessage: 'Afi/amma',
      description: 'Grandparents',
    },
    relativesRelationSiblings: {
      id: 'dess.nps.application:childrenNParents.relatives.relation.siblings',
      defaultMessage: 'Systkini',
      description: 'Siblings',
    },
    relativesRelationStepParent: {
      id: 'dess.nps.application:childrenNParents.relatives.relation.step.parent',
      defaultMessage: 'Stjúpforeldri',
      description: 'Step parent',
    },
    relativesRelationRelatives: {
      id: 'dess.nps.application:childrenNParents.relatives.relation.relatives',
      defaultMessage: 'Frændfólk',
      description: 'Relatives',
    },
    relativesRelationFriendsAndOther: {
      id: 'dess.nps.application:childrenNParents.relatives.relation.friends.and.other',
      defaultMessage: 'Vinafólk/annað',
      description: 'Friends/others',
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

    // Starting school
    startingSchoolSubSectionTitle: {
      id: 'dess.nps.application:primary.school.starting.school.sub.section.title',
      defaultMessage: 'Byrjar í skóla',
      description: 'Starting school',
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

    // School bus
    schoolBusSubSectionTitle: {
      id: 'dess.nps.application:different.needs.school.bus.section.title',
      defaultMessage: 'Skólaakstur',
      description: 'School bus',
    },

    // Use of footage
    useOfFootageSubSectionTitle: {
      id: 'dess.nps.application:different.needs.use.of.footage.section.title',
      defaultMessage: 'Notkun myndefnis',
      description: 'Use of footage',
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
    name: {
      id: 'dess.nps.application:review.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'dess.nps.application:review.national.id',
      defaultMessage: 'Kennitala',
      description: 'Icelandic ID number',
    },
    address: {
      id: 'dess.nps.application:review.address',
      defaultMessage: 'Heimilisfang',
      description: 'Address',
    },
    municipality: {
      id: 'dess.nps.application:review.municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
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
    overviewTitle: {
      id: 'dess.nps.application:conclusion.overview.title',
      defaultMessage: 'TBD',
      description: 'TBD',
    },
    title: {
      id: 'dess.nps.application:conclusion.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Application received',
    },
    alertTitle: {
      id: 'dess.nps.application:conclusion.screen.title',
      defaultMessage: 'TBD',
      description: 'TBD',
    },
    accordionText: {
      id: 'dess.nps.application:conclusion.accordion.text#markdown',
      defaultMessage: 'TBD',
      description: 'TBD',
    },
    nextStepsLabel: {
      id: 'dess.nps.application:conclusion.screen.next.steps.label',
      defaultMessage: 'Hvað gerist næst?',
      description: 'What happens next?',
    },
    buttonsViewApplication: {
      id: 'dess.nps.application:conclusion.screen.buttons.view.application',
      defaultMessage: 'Skoða umsókn',
      description: 'View application',
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
})
