import { defineMessages } from 'react-intl'

export const landlordDetails = defineMessages({
  subSectionName: {
    id: 'ra.application:landlordDetails.subSectionName',
    defaultMessage: 'Leigusali',
    description: 'Landlord details subsection name',
  },
  pageTitle: {
    id: 'ra.application:landlordDetails.pageTitle',
    defaultMessage: 'Skrá leigusala',
    description: 'Landlord details page title',
  },
  tableTitle: {
    id: 'ra.application:landlordDetails.tableTitle',
    defaultMessage: 'Leigusali',
    description: 'Landlord details table title',
  },
  pageDescription: {
    id: 'ra.application:landlordDetails.pageDescription',
    defaultMessage:
      'Hér skal skrá leigusala húsnæðis. Hægt er að bæta við eins mörgum leigusölum á samninginn eins og óskað er eftir.',
    description: 'Landlord details page description',
  },

  // DataSchema errors
  landlordEmptyTableError: {
    id: 'ra.application:landlordDetails.landlordEmptyTableError',
    defaultMessage:
      'Að minnsta kosti einn leigusali þarf að vera skráður á leigusamninginn.',
    description: 'Landlord details no landlords in table',
  },
  uniqueApplicantsError: {
    id: 'ra.application:landlordDetails.uniqueApplicantsError',
    defaultMessage:
      'Sami aðili má ekki vera skráður oftar en einu sinni á leigusamninginn.',

    description: 'Applicant already exists on application error',
  },
})

export const tenantDetails = defineMessages({
  subSectionName: {
    id: 'ra.application:tenantDetails.subSectionName',
    defaultMessage: 'Leigjandi',
    description: 'Tenant Details sub section name',
  },
  pageTitle: {
    id: 'ra.application:tenantDetails.pageTitle',
    defaultMessage: 'Skrá leigjanda',
    description: 'Tenant Details page title',
  },
  tableTitle: {
    id: 'ra.application:tenantDetails.tableTitle',
    defaultMessage: 'Leigjandi',
    description: 'Tenant details table title',
  },
  representativeTableTitle: {
    id: 'ra.application:tenantDetails.representativeTableTitle',
    defaultMessage: 'Umboðsaðili (ef við á)',
    description: 'Tenant details representative table title',
  },
  pageDescription: {
    id: 'ra.application:tenantDetails.pageDescription',
    defaultMessage:
      'Hér skal skrá leigjendur í húsnæðinu. Hægt er að bæta við eins mörgum leigjendum á samninginn eins og óskað er eftir.',
    description: 'Tenant Details page description',
  },

  // DataSchema errors
  tenantEmptyTableError: {
    id: 'ra.application:tenantDetails.tenantEmptyTableError',
    defaultMessage:
      'Að minnsta kosti einn leigutaki þarf að vera skráður á leigusamninginn.',
    description: 'Tenant details no tenants in table',
  },
  uniqueApplicantsError: {
    id: 'ra.application:tenantDetails.uniqueApplicantsError',
    defaultMessage:
      'Sami aðili má ekki vera skráður oftar en einu sinni á leigusamninginn.',
    description: 'Applicant already exists on application error',
  },
})

export const landlordAndTenantDetails = defineMessages({
  representativeTableTitle: {
    id: 'ra.application:landlordAndTenantDetails.representativeTableTitle',
    defaultMessage: 'Umboðsaðili (ef við á)',
    description: 'Representative table title',
  },
  nationalIdHeaderLabel: {
    id: 'ra.application:landlordAndTenantDetails.nationalIdHeaderLabel',
    defaultMessage: 'Kennitala',
    description: 'National id header label',
  },
  nameInputLabel: {
    id: 'ra.application:landlordAndTenantDetails.nameLabel',
    defaultMessage: 'Fullt nafn',
    description: 'Name input label',
  },
  emailInputLabel: {
    id: 'ra.application:landlordAndTenantDetails.emailLabel',
    defaultMessage: 'Netfang',
    description: 'Email input label',
  },
  phoneInputLabel: {
    id: 'ra.application:landlordAndTenantDetails.phoneLabel',
    defaultMessage: 'Símanúmer',
    description: 'Phone input label',
  },
  addressInputLabel: {
    id: 'ra.application:landlordAndTenantDetails.addressInputLabel',
    defaultMessage: 'Heimilisfang',
    description: 'Address input label',
  },
  cancelButtonText: {
    id: 'ra.application:landlordAndTenantDetails.cancelButtonText',
    defaultMessage: 'Hætta við',
    description: 'Cancel button text',
  },

  // Error messages
  nationalIdError: {
    id: 'ra.application:landlordAndTenantDetails.nationalIdError',
    defaultMessage: 'Kennitala ógild eða ekki á réttu formi',
    description: 'National id error',
  },
  nationalIdAgeError: {
    id: 'ra.application:landlordAndTenantDetails.nationalIdAgeError',
    defaultMessage: 'Aðili leigusamnings verður að vera 18 ára eða eldri',
    description: 'National id age error',
  },
  phoneNumberEmptyError: {
    id: 'ra.application:landlordAndTenantDetails.phoneNumberEmptyError',
    defaultMessage: 'Símanúmer þarf að vera skráð',
    description: 'Phone number empty error',
  },
  phoneNumberInvalidError: {
    id: 'ra.application:landlordAndTenantDetails.phoneNumberInvalidError',
    defaultMessage: 'Símanúmer er ógilt',
    description: 'Phone number invalid error',
  },
  emailInvalidError: {
    id: 'ra.application:landlordAndTenantDetails.emailInvalidError',
    defaultMessage:
      'Netfangið er rangt ritað. Vinsamlegast athugaðu hvort vanti @-merkið eða lénið (eins og ".is")',
    description: 'Email invalid error',
  },
  addressEmptyError: {
    id: 'ra.application:landlordAndTenantDetails.addressEmptyError',
    defaultMessage: 'Heimilisfang þarf að vera skráð',
    description: 'Address empty error',
  },
})
