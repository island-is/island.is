import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const childPensionFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'cp.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'cp.application:applicationTitle',
      defaultMessage: 'Umsókn um barnalífeyri',
      description: 'Application for child pension',
    },
    formTitle: {
      id: 'cp.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'cp.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'cp.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),

  pre: defineMessages({
    prerequisitesSection: {
      id: 'cp.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    forInfoSection: {
      id: 'cp.application:for.info.section',
      defaultMessage: 'Til upplýsinga',
      description: 'For Information',
    },
    forInfoDescription: {
      id: 'cp.application:for.info.description',
      defaultMessage:
        'TR sækir nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðslu mála. Þær upplýsingar geta varðað bæði tekjur og aðrar aðstæður þínar.\n \nMisjafnt er eftir tegund umsóknar hvaða upplýsingar þarf til úrvinnslu en ekki eru sóttar meiri upplýsingar en nauðsynlegt er hverju sinni.',
      description: 'english translation',
    },
    forInfoSecondDescription: {
      id: 'cp.application:for.info.second.description',
      defaultMessage:
        'Ef tekjur eða aðrar aðstæður þínar breytast verður þú að láta TR vita þar sem það getur haft áhrif á greiðslur þínar.\n \nFrekari upplýsingar um gagnaöflun og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingastofnunar, www.tr.is/personuvernd. \n \nÞeim umsóknum sem sendar eru TR í gegnum Mínar síður Ísland.is verður svarað rafrænt',
      description: 'english translation',
    },
    externalDataSection: {
      id: 'cp.application:externalData.section',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    checkboxProvider: {
      id: 'cp.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
    userProfileTitle: {
      id: 'cp.application:userprofile.title',
      defaultMessage: 'Upplýsingar af mínum síðum Ísland.is',
      description: 'english translation',
    },
    userProfileSubTitle: {
      id: 'cp.application:userprofile.subtitle',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikning eru sóttar á mínar síður á Ísland.is..',
      description: 'english translation',
    },
    registryIcelandTitle: {
      id: 'cp.application:registry.iceland.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'english translation',
    },
    registryIcelandSubTitle: {
      id: 'cp.application:registry.iceland.subtitle',
      defaultMessage:
        'Persónuupplýsingar um þig, maka og börn í þinni forsjá ásamt búsetusögu.',
      description: 'english translation',
    },
    startApplication: {
      id: 'cp.application.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
    section: {
      id: 'cp.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    subSectionTitle: {
      id: 'cp.application:info.sub.section.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email address and phone number',
    },
    subSectionDescription: {
      id: 'cp.application:info.sub.section.description',
      defaultMessage:
        'Netfang og símanúmer er sótt á mínar síður á Ísland.is. Ef upplýsingarnar eru ekki réttar eða vantar setur þú þær inn hér.',
      description: 'translation',
    },
    applicantEmail: {
      id: 'cp.application:info.applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantPhonenumber: {
      id: 'cp.application:info.applicant.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    paymentTitle: {
      id: 'cp.application:info.payment.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    childrenTitle: {
      id: 'cp.application:info.children.title',
      defaultMessage: 'Barn/börn',
      description: 'Child/children',
    },
    chooseChildrenTitle: {
      id: 'cp.application:info.choose.children.title',
      defaultMessage: 'Veldu barn/börn',
      description: 'Choose child/children',
    },
    chooseChildrenDescription: {
      id: 'cp.application:info.choose.children.description',
      defaultMessage:
        'Samkvæmt uppflettingu í þjóðskrá hefur þú forsjá með eftirfarandi barni/börnum. Ef barn er ekki með sama lögheimili og þú verður þú að skila inn skjali sem staðfestir að þú sért með barn/börn á framfæri. Veldu barn/börn sem þú vilt sækja um barnalífeyri fyrir. Ef þú vilt bæta við barni getur þú gert það aftar í ferlinu.',
      description: 'english translation',
    },
    registerChildTitle: {
      id: 'cp.application:info.register.child.title',
      defaultMessage: 'Skráning barns',
      description: 'Register child',
    },
    registerChildChildDoesNotHaveNationalId: {
      id: 'cp.application:info.register.child.child.does.not.have.national.id',
      defaultMessage: 'Barn ekki með íslenska kennitölu',
      description: 'Child does not have an Icelandic national ID',
    },
    registerChildNationalId: {
      id: 'cp.application:info.register.child.national.id',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    registerChildBirthDate: {
      id: 'cp.application:info.register.child.birth.date',
      defaultMessage: 'Fæðingardagur',
      description: 'Date of birth',
    },
    registerChildBirthDatePlaceholder: {
      id: 'cp.application:info.register.child.birth.date.placeholder',
      defaultMessage: 'Veldu fæðingardag',
      description: 'Choose date of birth',
    },
    registerChildFullName: {
      id: 'cp.application:info.register.child.full.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },

    registerChildRepeaterTitle: {
      id: 'cp.application:info.register.child.repeater.title',
      defaultMessage: 'Börn á framfærslu',
      description: 'english translation',
    },
    registerChildRepeaterDescription: {
      id: 'cp.application:info.register.child.repeater.description',
      defaultMessage: 'Barn/börn sem þú ert með á framfærslu.',
      description: 'english translation',
    },
    addChildButton: {
      id: 'cp.application:info.add.child.button',
      defaultMessage: 'Bæta við barni',
      description: 'Add child',
    },
    registerChildRepeaterTableHeaderName: {
      id: 'cp.application:info.register.child.repeater.table.header.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    registerChildRepeaterTableHeaderId: {
      id: 'cp.application:info.register.child.repeater.table.header.id',
      defaultMessage: 'Kennitala / fæðingardagur',
      description: 'National ID',
    },
    registerChildRepeaterTableHeaderReasonOne: {
      id: 'cp.application:info.register.child.repeater.table.header.reason.one',
      defaultMessage: 'Ástæða 1',
      description: 'Reason 1',
    },
    registerChildRepeaterTableHeaderReasonTwo: {
      id: 'cp.application:info.register.child.repeater.table.header.reason.two',
      defaultMessage: 'Ástæða 2',
      description: 'Reason 2',
    },

    childPensionReasonTitle: {
      id: 'cp.application:info.child.pension.reason.title',
      defaultMessage: 'Veldu ástæðu',
      description: 'english translation',
    },
    childPensionReasonDescription: {
      id: 'cp.application:info.child.pension.reason.description',
      defaultMessage: 'Vinsamlegast veldu ástæðu fyrir barnalífeyri.',
      description: 'english translation',
    },
    childPensionReasonParentHasPensionOrDisabilityAllowance: {
      id: 'cp.application:info.child.pension.reason.parentHasPensionOrDisabilityAllowance',
      defaultMessage: 'Innskráð foreldri er lífeyrisþegi eða með örorkustyrk',
      description: 'english translation',
    },
    childPensionReasonParentIsDead: {
      id: 'cp.application:info.child.pension.reason.parentIsDead',
      defaultMessage: 'Foreldri er látið',
      description: 'english translation',
    },
    childPensionReasonChildIsFatherless: {
      id: 'cp.application:info.child.pension.reason.childIsFatherless',
      defaultMessage: 'Barn er ófeðrað',
      description: 'english translation',
    },
    childPensionReasonParentsPenitentiary: {
      id: 'cp.application:info.child.pension.reason.parentsPenitentiary',
      defaultMessage: 'Refsivist foreldris',
      description: 'english translation',
    },

    childPensionReasonParentIsDeadTitle: {
      id: 'cp.application:info.child.pension.reason.parentIsDead.title',
      defaultMessage: 'Foreldri',
      description: 'english translation',
    },
    childPensionReasonOtherParentIsDeadTitle: {
      id: 'cp.application:info.child.pension.reason.other.parentIsDead.title',
      defaultMessage: 'Annað/Hitt foreldri (valkvæmt)',
      description: 'english translation',
    },
    childPensionParentDoesNotHaveNationalId: {
      id: 'cp.application:info.child.pension.parent.does.not.have.national.id',
      defaultMessage: 'Foreldri ekki með íslenska kennitölu',
      description: 'Parent does not have an Icelandic national ID',
    },
    childPensionNameAlertTitle: {
      id: 'cp.application:info.child.pension.name.alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
    childPensionNameAlertMessage: {
      id: 'cp.application:info.child.pension.name.alert.message',
      defaultMessage: 'Ekki tókst að sækja nafn útfrá kennitölu.',
      // defaultMessage: 'Villa kom upp við að sækja nafn útfrá kennitölu. Vinsamlegast prófaðu aftur síðar',
      description: 'No name found for national id in national registry',
    },
  }),

  additionalInfo: defineMessages({
    section: {
      id: 'cp.application:additional.info.section',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional information',
    },
  }),

  confirm: defineMessages({
    title: {
      id: 'cp.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Review and submit',
    },
    section: {
      id: 'cp.application:confirmation.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    description: {
      id: 'cp.application:confirm.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    overviewTitle: {
      id: 'cp.application:overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    buttonEdit: {
      id: 'cp.application:button.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    name: {
      id: 'cp.application:confirm.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'cp.application:confirm.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National registry ID',
    },
    email: {
      id: 'cp.application:confirm.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phonenumber: {
      id: 'cp.application:confirm.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'phonenumber',
    },
    children: {
      id: 'cp.application:confirm.children',
      defaultMessage: 'Börn sem þú sækir um barnalífeyri fyrir',
      description: 'english translation',
    },
  }),

  conclusionScreen: defineMessages({
    title: {
      id: 'cp.application:conclusion.screen.title',
      defaultMessage: 'Umsókn móttekin og bíður tekjuáætlunar',
      description: 'Congratulations, below are the next steps',
    },
  }),

  errors: defineMessages({
    phoneNumber: {
      id: 'cp.application:error.phonenumber',
      defaultMessage: 'Símanúmerið þarf að vera gilt.',
      description: 'The phone number must be valid.',
    },
  }),
}

export const validatorErrorMessages = defineMessages({
  requireAnswer: {
    id: 'cp.application:require.answer',
    defaultMessage: 'Ógilt gildi',
    description: 'Invalid value',
  },
  childNationalId: {
    id: 'cp.application:child.nationalId',
    defaultMessage: 'Vantar kennitölu',
    description: 'The national id is required',
  },
  childNationalIdDuplicate: {
    id: 'cp.application:child.nationalId.duplicate',
    defaultMessage: 'Kennitala er þegar skráð.',
    description: 'National id is already registered.',
  },
  childNationalIdMustBeValid: {
    id: 'cp.application:child.nationalId.must.be.valid',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'The national id must be valid.',
  },
  childBirthDate: {
    id: 'cp.application:child.birthDate',
    defaultMessage: 'Vinsamlegast veldu fæðingardag.',
    description: 'Please select a date of birth.',
  },
  childName: {
    id: 'cp.application:child.name',
    defaultMessage: 'Fullt nafn vantar',
    description: 'Full name missing',
  },
  registerChildNotAList: {
    id: 'cp.application:register.child.not.a.list',
    defaultMessage: 'Svar þarf að vera listi af börnum',
    description: 'Answer must be a list of children',
  },
  registerChildChildMustBeUnder18: {
    id: 'cp.application:register.child.child.must.be.under.18',
    defaultMessage: 'Barnið verður að vera yngra en 18 ára.',
    description: 'The child must be under 18 years of age.',
  },
  childPensionReason: {
    id: 'cp.application:child.pension.reason',
    defaultMessage: 'Skylda að velja einhverja ástæðu',
    description: 'Required to choose some reason',
  },
  childPensionMaxTwoReasons: {
    id: 'cp.application:child.pension.max.two.reasons',
    defaultMessage: 'Má bara velja 2 ástæður',
    description: 'english translation',
  },
  childPensionReasonsDoNotMatch: {
    id: 'cp.application:child.pension.reasons.do.not.match',
    defaultMessage:
      'Ástæður passa ekki saman. Vinsamlegast veldu aðrar ástæður.',
    description: 'english translation',
  },
})
