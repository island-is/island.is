import { ApplicationContext } from '@island.is/application/types'
import { getSelectedMachine } from './getSelectedMachine'

export const isPaymentRequired = ({ application }: ApplicationContext) => {
  console.log(
    'paymentRequiredForOwnerChange',
    getSelectedMachine(application.externalData, application.answers)
      ?.paymentRequiredForOwnerChange,
  )
  console.log(
    'ispayment required',
    getSelectedMachine(application.externalData, application.answers)
      ?.paymentRequiredForOwnerChange ?? true,
  )
  return (
    getSelectedMachine(application.externalData, application.answers)
      ?.paymentRequiredForOwnerChange ?? true
  )
}
