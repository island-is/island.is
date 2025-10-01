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
  personalInformationDescription: {
    id: 'ra.application:partiesDetails.personalInformationDescription',
    defaultMessage:
      'Hér eru upplýsingar um þig eins og þær eru skráðar í Þjóðskrá og á Ísland.is. Ef þú vilt nota annað netfang eða símanúmer við gerð leigusamnings, þá getur þú breytt því hér að neðan.',
    description: 'Parties details description',
  },

  // DataSchema errors
  partiesEmptyTableError: {
    id: 'ra.application:partiesDetails.partiesEmptyTableError',
    defaultMessage:
      'Að minnsta kosti einn leigusali þarf að vera skráður á leigusamninginn.',
    description: 'Parties details no parties in table',
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

  alertMessageTitle: {
    id: 'ra.application:partiesDetails.alertMessageTitle',
    defaultMessage: 'Leigusala vantar',
    description: 'Alert message title',
  },
  alertMessageDescription: {
    id: 'ra.application:partiesDetails.alertMessageDescription',
    defaultMessage:
      'Fylla verður út að minnsta kosti einn leigusala sem ekki er umboðsaðili',
    description: 'Alert message description',
  },
})

export const landlordAndTenantDetails = defineMessages({
  representativeTableTitle: {
    id: 'ra.application:landlordAndTenantDetails.representativeTableTitle',
    defaultMessage: 'Umboðsaðili leigusala',
    description: 'Representative table title',
  },
  representativeTableDescription: {
    id: 'ra.application:landlordAndTenantDetails.representativeTableDescription',
    defaultMessage:
      'Leigusalar geta skráð einn umboðsmann. Umboðsmaður leigusala verður tengiliður leigjanda á meðan leigutíma stendur.',
    description: 'Representative table description',
  },
  representativeTableCheckboxLabel: {
    id: 'ra.application:landlordAndTenantDetails.representativeTableCheckboxLabel',
    defaultMessage: 'Bæta við umboðsaðilum leigusala',
    description: 'Representative table checkbox label',
  },
  representativeLabel: {
    id: 'ra.application:landlordAndTenantDetails.representativeLabel',
    defaultMessage: 'Umboðsaðili',
    description: 'Representative label',
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
