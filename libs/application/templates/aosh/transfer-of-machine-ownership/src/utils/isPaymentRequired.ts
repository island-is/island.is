import { ApplicationContext, ExternalData } from '@island.is/application/types'
import { getSelectedMachine } from './getSelectedMachine'
import { FormValue } from '@island.is/application/types'

export const isPaymentRequired = ({ application }: ApplicationContext) => {
  console.log('isPaymentRequired')
  console.log('application', application)
  console.log(
    'is it',
    getSelectedMachine(application.externalData, application.answers)
      ?.paymentRequiredForOwnerChange,
  )
  // return (
  //   getSelectedMachine(application.externalData, application.answers)
  //     ?.paymentRequiredForOwnerChange || true
  // )
  return false
}

export const isPaymentRequiredSubSection = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  console.log('isPaymentRequiredSubSection')
  console.log('answers', answers)
  console.log('externalData', externalData)
  console.log(
    'is it',
    getSelectedMachine(externalData, answers)?.paymentRequiredForOwnerChange,
  )
  return (
    getSelectedMachine(externalData, answers)?.paymentRequiredForOwnerChange ||
    true
  )
}
