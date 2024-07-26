import { personalTaxCreditForm } from '../messages'
import { ApproveOptions } from '../types'

export const getPersonalTaxCreditOptions = () => {
  const options = [
    {
      value: ApproveOptions.Yes,
      label: personalTaxCreditForm.radioChoices.useTaxCredit,
    },
    {
      value: ApproveOptions.No,
      label: personalTaxCreditForm.radioChoices.wontUseTaxCredit,
    },
  ]

  return options
}
