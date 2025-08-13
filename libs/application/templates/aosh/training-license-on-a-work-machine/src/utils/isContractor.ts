import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { TrainingLicenseOnAWorkMachineAnswers } from '../shared/types'

export const isContractor = (answers: FormValue) => {
  const certificateOfTenure = getValueViaPath<
    TrainingLicenseOnAWorkMachineAnswers['certificateOfTenure']
  >(answers, 'certificateOfTenure')
  return !certificateOfTenure?.find((x) => !x?.isContractor?.includes('yes'))
}
