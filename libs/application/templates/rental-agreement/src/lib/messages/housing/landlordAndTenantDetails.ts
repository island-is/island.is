import { defineMessages } from 'react-intl'

export const partiesDetails = defineMessages({
  subSectionName: {
    id: 'ra.application:partiesDetails.subSectionName',
    defaultMessage: 'Aðilar',
    description: 'Parties details subsection name',
  },
  multiFieldTitle: {
    id: 'ra.application:partiesDetails.multiFieldTitle',
    defaultMessage: 'Aðilar samnings',
    description: 'Parties details multi field title',
  },
  multiFieldDescription: {
    id: 'ra.application:partiesDetails.multiFieldDescription',
    defaultMessage:
      'Hér skal skrá aðila samnings: Leigusala, umboðsaðila leigusala og leigjendur. Hægt er að bæta við eins mörgum aðilum á samninginn eins og óskað er eftir.',
    description: 'Parties details multi field description',
  },
  landlordTableTitle: {
    id: 'ra.application:partiesDetails.landlordTableTitle',
    defaultMessage: 'Leigusalar',
    description: 'Parties details page title',
  },
  landlordTitle: {
    id: 'ra.application:partiesDetails.landlordTitle',
    defaultMessage: 'Leigusali',
    description: 'Parties details table title',
  },

  // DataSchema errors
  partiesEmptyTableError: {
    id: 'ra.application:partiesDetails.partiesEmptyTableError',
    defaultMessage:
      'Að minnsta kosti einn leigusali þarf að vera skráður á leigusamninginn.',
    description: 'Parties details no parties in table',
  },
  uniqueApplicantsError: {
    id: 'ra.application:partiesDetails.uniqueApplicantsError',
    defaultMessage:
      'Sami aðili má ekki vera skráður oftar en einu sinni á leigusamninginn.',

    description: 'Applicant already exists on application error',
  },
  duplicateNationalIdError: {
    id: 'ra.application:partiesDetails.duplicateNationalIdError',
    defaultMessage:
      'Þessi kennitala er nú þegar skráð sem aðili að leigusamningnum. Ekki er hægt að skrá sama aðila tvisvar.',
    description: 'Duplicate national ID error in table',
  },
  tenantTableTitle: {
    id: 'ra.application:tenantDetails.tenantTableTitle',
    defaultMessage: 'Leigjendur',
    description: 'Tenant details table title',
  },

  // DataSchema errors
  tenantEmptyTableError: {
    id: 'ra.application:tenantDetails.tenantEmptyTableError',
    defaultMessage:
      'Að minnsta kosti einn leigutaki þarf að vera skráður á leigusamninginn.',
    description: 'Tenant details no tenants in table',
  },
})

export const landlordAndTenantDetails = defineMessages({
  representativeTableTitle: {
    id: 'ra.application:landlordAndTenantDetails.representativeTableTitle',
    defaultMessage: 'Umboðsaðilar leigusala (ef við á)',
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
