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
    questionsIsSelfEmployed: {
      id: 'marp.application:general.information.questions.is.self.employed',
      defaultMessage: 'Ertu sjálfstætt starfandi?',
      description: 'Are you self-employed?',
    },
    questionsIsSelfEmployedDescription: {
      id: 'marp.application:general.information.questions.is.self.employed.description',
      defaultMessage:
        'Sjálfstætt starfandi einstaklingar þurfa að setja inn dagsetningu lækkunar á reiknuðu endurgjaldi.',
      description:
        'Self-employed individuals must enter the date of reduction in calculated remuneration',
    },
    questionsCalculatedRemunerationDate: {
      id: 'marp.application:general.information.questions.calculated.remuneration.date',
      defaultMessage: 'Hvenær var lækkun á reiknuðu endurgjaldi?',
      description: 'When was the reduction in calculated remuneration?',
    },
    questionsIsPartTimeEmployed: {
      id: 'marp.application:general.information.questions.is.part.time.employed',
      defaultMessage: 'Ertu í hlutastarfi?',
      description: 'Are you working part-time?',
    },
    questionsIsStudying: {
      id: 'marp.application:general.information.questions.is.studying',
      defaultMessage: 'Ertu í námi?',
      description: 'Are you studying?',
    },
    questionsIsStudyingFileUpload: {
      id: 'marp.application:general.information.questions.is.studying.file.upload',
      defaultMessage: 'Hlaða inn staðfestingarskjali',
      description: 'Upload confirmation document',
    },

    // Employee sick pay
    employeeSickPaySubSectionTitle: {
      id: 'marp.application:general.information.employee.sick.pay.sub.section.title',
      defaultMessage: 'Veikindalaun',
      description: 'Sick pay',
    },
    employeeSickPayTitle: {
      id: 'marp.application:general.information.employee.sick.pay.title',
      defaultMessage:
        'Hefur þú nýtt rétt þinn til veikindalauna hjá atvinnurekanda?',
      description:
        'Have you used your sick pay entitlement at your current employer?',
    },
    employeeSickPayDoesEndDateTitle: {
      id: 'marp.application:general.information.employee.sick.pay.does.end.date.title',
      defaultMessage: 'Hvenær líkur rétti þínum til veikindalauna?',
      description: 'When does your sick pay entitlement end?',
    },
    employeeSickPayDidEndDateTitle: {
      id: 'marp.application:general.information.employee.sick.pay.did.end.date.title',
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
    studyConfirmation: {
      id: 'marp.application:overview.study.confirmation',
      defaultMessage: 'Staðfesting á námi',
      description: 'Confirmation of study',
    },
    sickPayDidEndDate: {
      id: 'marp.application:overiew.sick.pay.did.end.date',
      defaultMessage: 'Réttinum lauk',
      description: 'Your entitlement ended',
    },
    sickPayDoesEndDate: {
      id: 'marp.application:overiew.sick.pay.does.end.date',
      defaultMessage: 'Réttinum lýkur',
      description: 'Your entitlement ends',
    },
  }),

  conclusion: defineMessages({}),
}

export const errorMessages = defineMessages({
  dateRequired: {
    id: 'marp.application:error.date.required',
    defaultMessage: 'Það þarf að velja dagsetningu',
    description: 'You must select a date',
  },
})

export const statesMessages = defineMessages({
  applicationApprovedDescription: {
    id: 'marp.application:applicationApprovedDescription',
    defaultMessage:
      'Umsókn vegna sjúkra- og endurhæfingagreiðslna hefur verið samþykkt',
    description:
      'The application for medical and rehabilitation payments has been approved',
  },
})
