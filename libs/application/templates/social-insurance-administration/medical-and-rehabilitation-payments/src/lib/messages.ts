import { MessageDescriptor, defineMessages } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const medicalAndRehabilitationPaymentsFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'marp.application:applicationTitle',
      defaultMessage: 'Sjúkra- og endurhæfingargreiðslur',
      description: 'Medical and Rehabilitation Payments',
    },
    date: {
      id: 'marp.application:date',
      defaultMessage: 'Dagsetning',
      description: 'Date',
    },
    datePlaceholder: {
      id: 'marp.application:date.placeholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Select date',
    },
    notApplicable: {
      id: 'marp.application:not.applicable',
      defaultMessage: 'Á ekki við',
      description: 'Not applicable',
    },
  }),

  pre: defineMessages({
    sectionTitle: {
      id: 'marp.application:pre.section.title',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },

    // Application type
    applicationTypeSubSectionTitle: {
      id: 'marp.application:pre.application.type.sub.section.title',
      defaultMessage: 'Tegund umsóknar',
      description: 'Type of application',
    },
    applicationTypeSubSectionDescription: {
      id: 'marp.application:pre.application.type.sub.section.description',
      defaultMessage: 'Vinsamlegast veldu tegund umsóknar',
      description: 'Vinsamlegast veldu tegund umsóknar',
    },

    // Data collection
  }),

  generalInformation: defineMessages({
    // Payment information

    // Questions
    questionsSubSectionTitle: {
      id: 'marp.application:general.information.questions.sub.section.title',
      defaultMessage: 'Spurningar',
      description: 'Questions',
    },

    // Sick pay
    sickPaySubSectionTitle: {
      id: 'marp.application:general.information.sick.pay.sub.section.title',
      defaultMessage: 'Veikindalaun',
      description: 'Sick pay',
    },
    sickPayTitle: {
      id: 'marp.application:general.information.sick.pay.title',
      defaultMessage:
        'Hefur þú nýtt rétt þinn til veikindalauna hjá atvinnurekanda?',
      description:
        'Have you used your sick pay entitlement at your current employer?',
    },
    sickPayDoesEndDateTitle: {
      id: 'marp.application:general.information.sick.pay.does.end.date.title',
      defaultMessage: 'Hvenær líkur rétti þínum til veikindalauna?',
      description: 'When does your sick pay entitlement end?',
    },
    sickPayDidEndDateTitle: {
      id: 'marp.application:general.information.sick.pay.did.end.date.title',
      defaultMessage: 'Hvenær lauk rétti þínum til veikindalauna?',
      description: 'When did your sick pay entitlement end?',
    },

    // Union sick pay
    unionSickPaySubSectionTitle: {
      id: 'marp.application:general.information.union.sick.pay.sub.section.title',
      defaultMessage: 'Sjúkradagpeningar',
      description: 'Union sick pay',
    },
    unionSickPayTitle: {
      id: 'marp.application:general.information.union.sick.pay.title',
      defaultMessage:
        'Hefur þú nýtt rétt þinn til sjúkradagpeninga frá stéttarfélagi?',
      description: 'Have you used your union sick pay entitlement?',
    },

    // Tengdar umsóknir?
  }),

  // Grunnvottorð

  // Endurhæfingaráætlun

  selfAssessment: defineMessages({
    sectionTitle: {
      id: 'marp.application:self.assessment.section.title',
      defaultMessage: 'Sjálfsmat',
      description: 'Self-assessment',
    },
  }),

  overview: defineMessages({
    sickPayEndDate: {
      id: 'marp.application:overiew.sick.pay.end.date',
      defaultMessage: 'Réttinum lauk/lýkur',
      description: 'Your entitlement ended/ends',
    },
  }),

  conclusion: defineMessages({}),
}

export const statesMessages = defineMessages({
  applicationApprovedDescription: {
    id: 'marp.application:applicationApprovedDescription',
    defaultMessage:
      'Umsókn vegna sjúkra- og endurhæfingagreiðslna hefur verið samþykkt',
    description:
      'The application for medical and rehabilitation payments has been approved',
  },
})
