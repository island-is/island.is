import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const pensionSupplementFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'tr.ps.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'tr.ps.application:applicationTitle',
      defaultMessage: 'Umsókn um uppbót á lífeyri',
      description: 'Application for pension supplement',
    },
    formTitle: {
      id: 'tr.ps.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'tr.ps.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'tr.ps.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
  }),

  pre: defineMessages({
    // prerequisitesSection: {
    //   id: 'trps.application:prerequisites.section',
    //   defaultMessage: 'Forsendur',
    //   description: 'Prerequisites',
    // },
    externalDataSection: {
      id: 'tr.ps.application:external.data.section',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    checkboxProvider: {
      id: 'tr.ps.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
    userProfileInformationTitle: {
      id: 'tr.ps.application:userprofile.title',
      defaultMessage: 'Upplýsingar af mínum síðum Ísland.is',
      description: 'Information from your account on Ísland.is',
    },
    userProfileInformationSubTitle: {
      id: 'tr.ps.application:userprofile.subtitle',
      defaultMessage:
        'Sækir upplýsingar um netfang, símanúmer og bankareikning frá mínum síðum Ísland.is.',
      description:
        'Information about email adress, phone number and bank account will be retrieved from your account at Ísland.is.',
    },
    skraInformationTitle: {
      id: 'tr.ps.application:skra.info.title',
      defaultMessage: 'Upplýsingar frá þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    skraInformationSubTitle: {
      id: 'tr.ps.application:skra.info.subtitle',
      defaultMessage: 'Sækir upplýsingar um þig, maka og börn frá Þjóðskrá.',
      description:
        'Information about you, spouse and children will be retrieved from Registers Iceland.',
    },
    startApplication: {
      id: 'tr.ps.application.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
    section: {
      id: 'tr.ps.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    subSectionTitle: {
      id: 'tr.ps.application:info.sub.section.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email and phone number',
    },
    subSectionDescription: {
      id: 'tr.ps.application:info.sub.section.description',
      defaultMessage:
        'Netfang og símanúmer er sótt á mínar síður á Ísland.is. Ef upplýsingarnar eru ekki réttar eða vantar setur þú þær inn hér.',
      description: 'translation',
    },
    applicantEmail: {
      id: 'tr.ps.application:info.applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantPhonenumber: {
      id: 'tr.ps.application:info.applicant.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    paymentTitle: {
      id: 'tr.ps.application:info.payment.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
  }),

  additionalInfo: defineMessages({
    section: {
      id: 'tr.ps.application:additional.info.section',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional information',
    },
  }),

  confirm: defineMessages({
    section: {
      id: 'tr.ps.application:confirm.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirm',
    },
  }),

  errors: defineMessages({
    phoneNumber: {
      id: 'tr.ps.application:error.phonenumber',
      defaultMessage: 'Símanúmerið þarf að vera gilt.',
      description: 'The phone number must be valid.',
    },
  }),
}
