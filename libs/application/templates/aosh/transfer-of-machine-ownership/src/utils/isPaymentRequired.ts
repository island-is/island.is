import { ApplicationContext, ExternalData } from '@island.is/application/types'
import { getSelectedMachine } from './getSelectedMachine'
import { FormValue } from '@island.is/application/types'

export const isPaymentRequired = ({ application }: ApplicationContext) => {
  console.log('isPaymentRequired')
  console.log('application', application)
  console.log(
    'is it',
    !getSelectedMachine(application.externalData, application.answers)
      ?.paymentRequiredForOwnerChange,
  )
  if (
    getSelectedMachine(application.externalData, application.answers)
      ?.regNumber === 'JL3027'
  ) {
    return false
  }
  return (
    getSelectedMachine(application.externalData, application.answers)
      ?.paymentRequiredForOwnerChange || true
  )
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
  if (getSelectedMachine(externalData, answers)?.regNumber === 'JL3027') {
    return false
  }
  return (
    getSelectedMachine(externalData, answers)?.paymentRequiredForOwnerChange ||
    true
  )
}
