import { ApplicationContext } from '@island.is/application/types'
import { getSelectedMachine } from './getSelectedMachine'

export const isPaymentRequired = ({ application }: ApplicationContext) => {
  return (
    getSelectedMachine(application.externalData, application.answers)
      ?.paymentRequiredForOwnerChange ?? true
  )
}
