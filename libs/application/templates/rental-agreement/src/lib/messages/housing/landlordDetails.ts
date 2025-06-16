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
  pageDescription: {
    id: 'ra.application:landlordDetails.pageDescription',
    defaultMessage:
      'Hér skal skrá leigusala húsnæðis. Hægt er að bæta við eins mörgum leigusölum á samninginn eins og óskað er eftir.',
    description: 'Landlord details page description',
  },
  nationalIdInputLabel: {
    id: 'ra.application:landlordDetails.nationalIdInputLabel',
    defaultMessage: 'Kennitala leigusala',
    description: 'Landlord details national id input label',
  },
  nationalIdHeaderLabel: {
    id: 'ra.application:landlordDetails.nationalIdHeaderLabel',
    defaultMessage: 'Kennitala',
    description: 'Landlord details national id header label',
  },
  cancelButtonText: {
    id: 'ra.application:landlordDetails.cancelButtonText',
    defaultMessage: 'Hætta við',
    description: 'Landlord details cancel button text',
  },
  nameInputLabel: {
    id: 'ra.application:landlordDetails.nameLabel',
    defaultMessage: 'Fullt nafn',
    description: 'Landlord details name input label',
  },
  isRepresentative: {
    id: 'ra.application:landlordDetails.isRepresentative',
    defaultMessage: 'Umb.',
    description: 'Landlord is representative',
  },
  emailInputLabel: {
    id: 'ra.application:landlordDetails.emailLabel',
    defaultMessage: 'Netfang',
    description: 'Landlord details email input label',
  },
  phoneInputLabel: {
    id: 'ra.application:landlordDetails.phoneLabel',
    defaultMessage: 'Símanúmer',
    description: 'Landlord details phone input label',
  },
  addressInputLabel: {
    id: 'ra.application:landlordDetails.addressInputLabel',
    defaultMessage: 'Heimilisfang',
    description: 'Landlord details address input label',
  },
  representativeLabel: {
    id: 'ra.application:landlordDetails.representativeLabel',
    defaultMessage: 'Þessi aðili er umboðsaðili leigusala',
    description: 'Landlord details representative label',
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
  landlordNationalIdEmptyError: {
    id: 'ra.application:landlordDetails.landlordNationalIdEmptyError',
    defaultMessage: 'Kennitala leigusala þarf að vera skráð',
    description: 'Landlord details national id empty error',
  },
  landlordPhoneNumberEmptyError: {
    id: 'ra.application:landlordDetails.landlordPhoneNumberEmptyError',
    defaultMessage: 'Símanúmer leigusala þarf að vera skráð',
    description: 'Landlord details phone number empty error',
  },
  landlordEmailEmptyError: {
    id: 'ra.application:landlordDetails.landlordEmailEmptyError',
    defaultMessage: 'Netfang leigusala þarf að vera skráð',
    description: 'Landlord details email empty error',
  },
  landlordAddressEmptyError: {
    id: 'ra.application:landlordDetails.landlordAddressEmptyError',
    defaultMessage: 'Heimilisfang leigusala þarf að vera skráð',
    description: 'Landlord details address empty error',
  },
})
