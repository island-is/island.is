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
  landlordOnlyRepresentativeTableError: {
    id: 'ra.application:landlordDetails.landlordOnlyRepresentativeTableError',
    defaultMessage:
      'Að minnsta kosti einn leigusali þarf að vera skráður á leigusamninginn. Ekki er nóg að skrá umboðsaðila leigusala.',
    description: 'Landlord details only a representative of landlord in table',
  },
  landlordSameAsTenantError: {
    id: 'ra.application:landlordDetails.landlordSameAsTenantError',
    defaultMessage:
      'Sami aðili getur ekki verið skráður bæði sem leigusali og leigjandi.',
    description: 'Landlord details landlord cannot be same as tenant error',
  },
  landlordAlreadyExistsError: {
    id: 'ra.application:landlordDetails.landlordAlreadyExistsError',
    defaultMessage:
      'Sami aðili getur ekki verið skráður mörgum sinnum sem leigusali.',
    description: 'Landlord details landlord already registered error',
  },
  landlordSameAsRepresentativeError: {
    id: 'ra.application:landlordDetails.landlordSameAsRepresentativeError',
    defaultMessage:
      'Sami aðili getur ekki verið skráður bæði sem leigusali og umboðsaðili.',
    description: 'Landlord details landlord same as representative error',
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
  tenantOnlyRepresentativeTableError: {
    id: 'ra.application:tenantDetails.tenantOnlyRepresentativeTableError',
    defaultMessage:
      'Að minnsta kosti einn leigjandi þarf að vera skráður á leigusamninginn. Ekki er nóg að skrá umboðsaðila leigjanda.',
    description: 'Tenant details only a representative of tenant in table',
  },
  sameTenantLandlordError: {
    id: 'ra.application:tenantDetails.sameTenantLandlordError',
    defaultMessage:
      'Sami aðili getur ekki verið skráður bæði sem leigusali og leigjandi.',
    description: 'Tenant details same landlord and tenant error',
  },
  tenantAlreadyExistsError: {
    id: 'ra.application:tenantDetails.tenantAlreadyExistsError',
    defaultMessage:
      'Sami aðili getur ekki verið skráður mörgum sinnum sem leigjandi.',
    description: 'Tenant details tenant already registered error',
  },
  tenantSameAsRepresentativeError: {
    id: 'ra.application:tenantDetails.tenantSameAsRepresentativeError',
    defaultMessage:
      'Sami aðili getur ekki verið skráður bæði sem leigjandi og umboðsaðili.',
    description: 'Tenant details tenant same as representative error',
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
  emailEmptyError: {
    id: 'ra.application:landlordAndTenantDetails.emailEmptyError',
    defaultMessage: 'Netfang þarf að vera skráð',
    description: 'Email empty error',
  },
  addressEmptyError: {
    id: 'ra.application:landlordAndTenantDetails.addressEmptyError',
    defaultMessage: 'Heimilisfang þarf að vera skráð',
    description: 'Address empty error',
  },
})
