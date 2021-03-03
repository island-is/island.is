import { defineMessages } from 'react-intl'

// Confirmation
export const info = {
  general: defineMessages({
    pageTitle: {
      id: 'dcap.application:section.info.pageTitle',
      defaultMessage: 'Fyrir hvern ertu að senda inn kvörtun?',
      description: 'Info page title',
    },
    description: {
      id: 'dcap.application:section.info.description',
      defaultMessage: 'Vantar textaupplýsingar',
      description: 'Info page description',
    },
    applicantPageTitle: {
      id: 'dcap.application:section.info.applicantPageTitle',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Applicant page title',
    },
    applicantPageDescription: {
      id: 'dcap.application:section.info.applicantPageDescription',
      defaultMessage: 'Vinsamlegast fylltu út þínar persónuupplýsingar',
      description: 'Applicant page description',
    },
  }),
  labels: defineMessages({
    myself: {
      id: 'dcap.application:section.info.myself',
      defaultMessage: 'Mig',
      description: 'Myself',
    },
    myselfAndOrOthers: {
      id: 'dcap.application:section.info.myselfAndOrOthers',
      defaultMessage: 'Mig ásamt öðrum / í umboði',
      description: 'Myself and others',
    },
    company: {
      id: 'dcap.application:section.info.company',
      defaultMessage: 'Fyrirtæki',
      description: 'Company',
    },
    organizationInstitution: {
      id: 'dcap.application:section.info.organizationInstitution',
      defaultMessage: 'Félagasamtök / stofnun',
      description: 'Organization or institution',
    },
    name: {
      id: 'dcap.application:section.info.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'dcap.application:section.info.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: 'dcap.application:section.info.address',
      defaultMessage: 'Heimili / póstfang',
      description: 'Address',
    },
    postalCode: {
      id: 'dcap.application:section.info.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal Code',
    },
    city: {
      id: 'dcap.application:section.info.city',
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    email: {
      id: 'dcap.application:section.info.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'dcap.application:section.info.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
  }),
}
