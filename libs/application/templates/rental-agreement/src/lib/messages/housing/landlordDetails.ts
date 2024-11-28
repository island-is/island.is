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
    defaultMessage: 'umboðsaðili',
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
  representativeLabel: {
    id: 'ra.application:landlordDetails.representativeLabel',
    defaultMessage: 'Þessi aðili er umboðsaðili leigusala',
    description: 'Landlord details representative label',
  },

  landlordEmptyTableError: {
    id: 'ra.application:landlordDetails.landlordEmptyTableError',
    defaultMessage:
      'Að minnsta kosti einn leigusali þarf að vera skráður á leigusamninginn.',
    description: 'Landlord details no landlords in table',
  },
  landlordOnlyRepresentativeTableError: {
    id: 'ra.application:landlordDetails.landlordOnlyRepresentativeTableError',
    defaultMessage:
      'Að minnsta kosti einn leigusali þarf að vera skráður á leigusamninginn. Ekki er nóg að skrá umboðsaðlia leigusala.',
    description: 'Landlord details only a representative of landlord in table',
  },
  landlordNationalIdEmptyError: {
    id: 'ra.application:landlordDetails.landlordNationalIdEmptyError',
    defaultMessage: 'Kennitala leigusala má ekki vera tómt',
    description: 'Landlord details national id empty error',
  },
})
