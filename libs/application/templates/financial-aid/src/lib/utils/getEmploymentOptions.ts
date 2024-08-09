import { Employment } from '@island.is/financial-aid/shared/lib'
import { employmentForm } from '../messages'

export const getEmploymentOptions = () => {
  const options = [
    {
      value: Employment.WORKING,
      label: employmentForm.employment.working,
    },
    {
      value: Employment.UNEMPLOYED,
      label: employmentForm.employment.unemployed,
    },
    {
      value: Employment.CANNOTWORK,
      label: employmentForm.employment.cannotWork,
    },
    {
      value: Employment.OTHER,
      label: employmentForm.employment.other,
    },
  ]

  return options
}
