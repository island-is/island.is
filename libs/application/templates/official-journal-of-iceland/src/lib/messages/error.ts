import { defineMessages } from 'react-intl'

export const error = defineMessages({
  dataSubmissionErrorTitle: {
    id: 'ojoi.application:error.dataSubmissionErrorTitle',
    defaultMessage: 'Villa kom upp við vistun gagna',
    description: 'Error message when data is not submitted',
  },
  xIsNotValid: {
    id: 'ojoi.application:error.xIsNotValid',
    defaultMessage: '{x} er ekki gilt',
    description: 'Error message when x is not valid',
  },
  xAlreadyExists: {
    id: 'ojoi.application:error.xAlreadyExists',
    defaultMessage: '{x} er þegar til',
    description: 'Error message when x already exists',
  },
  emptyFieldError: {
    id: 'ojoi.application:error.emptyFieldError',
    defaultMessage: 'Þessi reitur má ekki vera tómur',
    description: 'Error message when field is empty',
  },
  dataGathering: {
    id: 'ojoi.application:error.dataGathering',
    defaultMessage: 'Samþykkja þarf gagnaöflun til að halda áfram',
    description: 'Error message when data gathering is not approved',
  },
  radioErrorMessage: {
    id: 'ojoi.application:section.radioErrorMessage',
    defaultMessage: 'Þú þarft að velja einn valmöguleika',
    description: 'Error message when no option is selected',
  },
  inputErrorMessage: {
    id: 'ojoi.application:section.inputErrorMessage',
    defaultMessage: 'Þú þarft að skrifa í textareitinn',
    description: 'Error message when input is empty',
  },
  email: {
    id: 'ojoi.application:error.email',
    defaultMessage: 'Athugaðu hvort netfang sé rétt slegið inn',
    description: 'Error message when email is invalid or not present',
  },
  phone: {
    id: 'ojoi.application:error.phone',
    defaultMessage: 'Athugaðu hvort símanúmer sé rétt slegið inn',
    description: 'Error message when phone is invalid or not present',
  },
  datePicker: {
    id: 'ojoi.application:error.datePicker',
    defaultMessage: 'Vinsamlegast veldu dagsetningu',
    description: 'Error message when date is invalid or not present',
  },
  invalidDate: {
    id: 'ojoi.application:error.invalidDate',
    defaultMessage: 'Athugaðu hvort dagsetning sé rétt slegin inn',
    description: 'Error message when date is invalid',
  },
  invalidMinsitry: {
    id: 'ojoi.application:error.invalidMinsitry',
    defaultMessage: 'Ráðuneyti er óþekkt',
    description: 'Error message when ministry is invalid',
  },
  submitApplicationFailedTitle: {
    id: 'ojoi.application:error.submitApplicationFailedTitle',
    defaultMessage: 'Athugið',
    description: 'Error message when submit application fails',
  },
  submitApplicationFailedMessage: {
    id: 'ojoi.application:error.submitApplicationFailedMessage',
    defaultMessage: 'Ekki tókst að senda umsókn',
    description: 'Error message when submit application fails',
  },
})
