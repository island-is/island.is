import { defineMessages } from 'react-intl'

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
  nationalIdHeaderLabel: {
    id: 'ra.application:tenantDetails.nationalIdHeaderLabel',
    defaultMessage: 'Kennitala',
    description: 'Tenant details national id header label',
  },
  nameInputLabel: {
    id: 'ra.application:tenantDetails.nameLabel',
    defaultMessage: 'Fullt nafn',
    description: 'Tenant Details name input label',
  },
  emailInputLabel: {
    id: 'ra.application:tenantDetails.emailLabel',
    defaultMessage: 'Netfang',
    description: 'Tenant Details email input label',
  },
  phoneInputLabel: {
    id: 'ra.application:tenantDetails.phoneLabel',
    defaultMessage: 'Símanúmer',
    description: 'Tenant Details phone input label',
  },
  addressInputLabel: {
    id: 'ra.application:tenantDetails.addressInputLabel',
    defaultMessage: 'Heimilisfang',
    description: 'Tenant details address input label',
  },
  representativeLabel: {
    id: 'ra.application:tenantDetails.representativeLabel',
    defaultMessage: 'Þessi aðili er umboðsaðili leigjanda',
    description: 'Tenant Details representative label',
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
  tenantNationalIdEmptyError: {
    id: 'ra.application:tenantDetails.tenantNationalIdEmptyError',
    defaultMessage: 'Kennitala leigutaka þarf að vera skráð',
    description: 'Tenant details national id empty error',
  },
  tenantPhoneNumberEmptyError: {
    id: 'ra.application:tenantDetails.tenantPhoneNumberEmptyError',
    defaultMessage: 'Símanúmer leigutaka þarf að vera skráð',
    description: 'Tenant details phone number empty error',
  },
  tenantEmailEmptyError: {
    id: 'ra.application:tenantDetails.tenantEmailEmptyError',
    defaultMessage: 'Netfang leigutaka þarf að vera skráð',
    description: 'Tenant details email empty error',
  },
  tenantAddressEmptyError: {
    id: 'ra.application:tenantDetails.tenantAddressEmptyError',
    defaultMessage: 'Heimilisfang leigutaka þarf að vera skráð',
    description: 'Tenant details address empty error',
  },
})
