import { defineMessages } from 'react-intl'

export const dataSchema = defineMessages({
  nationalId: {
    id: 'ra.application:dataSchema.national.id',
    defaultMessage: 'Kennitala er ekki á réttu formi',
    description: 'Error message when nationalid is wrong',
  },
  phoneNumber: {
    id: 'ra.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },

  // Debug error messages
  requiredErrorMsg: {
    id: 'ra.application:error.required',
    defaultMessage: 'Reitur má ekki vera tómur',
    description: 'Error message when a required field has not been filled',
  },
  negativeNumberError: {
    id: 'ra.application:error.negativeNumber',
    defaultMessage: 'Ekki er leyfilegt að setja inn neikvæðar tölur',
    description: 'Error message when a required field has not been filled',
  },

  phoneNumberFormatError: {
    id: 'ra.application:dataSchema.phoneNumberFormatError',
    defaultMessage: 'Símanúmer verður að vera á réttu formi',
    description: 'Tenant details phone number format error',
  },
  emailFormatError: {
    id: 'ra.application:dataSchema.emailFormatError',
    defaultMessage:
      'Netfangið er rangt ritað. Vinsamlegast athugaðu hvort vanti @-merkið eða lénið (eins og ".is")',
    description: 'Tenant details email format error',
  },
  nationalIdNotFoundError: {
    id: 'ra.application:tenantDetails.nationalIdNotFoundError',
    defaultMessage:
      'Enginn aðili í Þjóðskrá hefur þessa kennitölu. Aðilar leigusamnings verða að hafa kennitölu til að geta undirritað samning rafrænt.',
    description: 'National id not found error',
  },
  crossTableDuplicateError: {
    id: 'ra.application:dataSchema.crossTableDuplicateError',
    defaultMessage:
      'Sami aðili má ekki vera skráður sem bæði leigusali og leigjandi eða sem fulltrúi fyrir báða aðila.',
    description: 'Cross-table duplicate national ID error',
  },
})
