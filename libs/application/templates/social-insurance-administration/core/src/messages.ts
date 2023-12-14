import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const socialInsuranceAdministrationMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'sia.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Social Insurance Administration',
    },
    formTitle: {
      id: 'sia.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'sia.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'sia.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    alertTitle: {
      id: 'sia.application:alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
  }),

  pre: defineMessages({
    externalDataSection: {
      id: 'sia.application:externalData.section',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection',
    },
    externalDataDescription: {
      id: 'sia.application:externalData.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'The following information will be retrieved electronically',
    },
    checkboxProvider: {
      id: 'sia.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description:
        'I understand that the above information will be collected during the application process',
    },
    skraInformationTitle: {
      id: 'sia.application:prerequisites.national.registry.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    startApplication: {
      id: 'sia.application:prerequisites.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
    section: {
      id: 'sia.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    subSectionTitle: {
      id: 'sia.application:info.sub.section.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email and phone number',
    },
    subSectionDescription: {
      id: 'sia.application:info.sub.section.description',
      defaultMessage:
        'Netfang og símanúmer er sótt frá Tryggingastofnun. Ef símanúmerið er ekki rétt eða vantar getur þú skráð það hérna fyrir neðan.',
      description:
        'Email address and phone number is retrieved from the Social Insurance Administration. If the phone number is incorrect or missing you can register the correct one below.',
    },
    applicantEmail: {
      id: 'sia.application:info.applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantPhonenumber: {
      id: 'sia.application:info.applicant.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
  }),

  period: defineMessages({
    title: {
      id: 'sia.application:period.title',
      defaultMessage: 'Tímabil',
      description: 'Period',
    },
    year: {
      id: 'sia.application:period.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    yearDefaultText: {
      id: 'sia.application:period.year.default.text',
      defaultMessage: 'Veldu ár',
      description: 'Select year',
    },
    month: {
      id: 'sia.application:period.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    monthDefaultText: {
      id: 'sia.application:period.month.default.text',
      defaultMessage: 'Veldu mánuð',
      description: 'Select month',
    },
  }),

  months: defineMessages({
    january: {
      id: 'sia.application:months.january',
      defaultMessage: 'Janúar',
      description: 'January',
    },
    february: {
      id: 'sia.application:months.february',
      defaultMessage: 'Febrúar',
      description: 'February',
    },
    march: {
      id: 'sia.application:months.march',
      defaultMessage: 'Mars',
      description: 'March',
    },
    april: {
      id: 'sia.application:months.april',
      defaultMessage: 'Apríl',
      description: 'April',
    },
    may: {
      id: 'sia.application:months.may',
      defaultMessage: 'Maí',
      description: 'May',
    },
    june: {
      id: 'sia.application:months.june',
      defaultMessage: 'Júní',
      description: 'June',
    },
    july: {
      id: 'sia.application:months.july',
      defaultMessage: 'Júlí',
      description: 'July',
    },
    august: {
      id: 'sia.application:months.august',
      defaultMessage: 'Ágúst',
      description: 'August',
    },
    september: {
      id: 'sia.application:months.september',
      defaultMessage: 'September',
      description: 'September',
    },
    october: {
      id: 'sia.application:months.october',
      defaultMessage: 'Október',
      description: 'October',
    },
    november: {
      id: 'sia.application:months.november',
      defaultMessage: 'Nóvember',
      description: 'November',
    },
    desember: {
      id: 'sia.application:months.desember',
      defaultMessage: 'Desember',
      description: 'December',
    },
  }),
}

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'sia.application:error.phonenumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  bank: {
    id: 'sia.application:error.bank',
    defaultMessage: 'Ógilt bankanúmer. Þarf að vera á forminu: 0000-11-222222',
    description: 'Invalid bank account. Has to be formatted: 0000-11-222222',
  },
  period: {
    id: 'sia.application:error.period',
    defaultMessage: 'Ógildur mánuður.',
    description: 'Invalid month.',
  },
  noEmailFound: {
    id: 'sia.application:error.no.email.found.title',
    defaultMessage: 'Ekkert netfang skráð',
    description: 'english translation',
  },
  noEmailFoundDescription: {
    id: 'sia.application:error.no.email.found.description#markdown',
    defaultMessage:
      'Þú ert ekki með skráð netfang hjá Tryggingastofnun. Vinsamlegast skráðu það [hér](https://minarsidur.tr.is/min-sida) og komdu svo aftur til að sækja um.',
    description: 'english translation',
  },
  iban: {
    id: 'sia.application:error.iban',
    defaultMessage: 'Ógilt IBAN',
    description: 'Invalid IBAN',
  },
  swift: {
    id: 'sia.application:error.swift',
    defaultMessage: 'Ógilt SWIFT',
    description: 'Invalid SWIFT',
  },
})
