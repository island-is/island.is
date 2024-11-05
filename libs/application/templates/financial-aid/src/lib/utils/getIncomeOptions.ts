import { incomeForm } from '../messages'
import { ApproveOptions } from '../types'

export const getIncomeOptions = () => {
  const options = [
    {
      value: ApproveOptions.Yes,
      label: incomeForm.options.yes,
    },
    {
      value: ApproveOptions.No,
      label: incomeForm.options.no,
    },
  ]
  return options
}
