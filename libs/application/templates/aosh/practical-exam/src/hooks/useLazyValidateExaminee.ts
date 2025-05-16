import { WorkMachineExamineeValidationDto } from '@island.is/clients/practical-exams-ver'
import { EXAMINEE_VALIDATION_QUERY } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'
import { ExamineeValidationInput } from '@island.is/api/schema'

export const useLazyValidateExaminee = () => {
  return useLazyQuery<
    {
      getExamineeValidation: WorkMachineExamineeValidationDto
    },
    {
      input: ExamineeValidationInput
    }
  >(EXAMINEE_VALIDATION_QUERY)
}
