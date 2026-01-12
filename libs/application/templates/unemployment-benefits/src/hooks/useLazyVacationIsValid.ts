import { useLazyQuery } from '@apollo/client'
import { VALIDATE_VACATION } from '../graphql/queries'
import {
  GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnpaidVacationDTO,
  GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationValidationResponseDTO,
} from '@island.is/clients/vmst-unemployment'

export const useLazyIsVacationValid = () => {
  return useLazyQuery<
    {
      vmstApplicationsVacationValidationUnemploymentApplication: GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationValidationResponseDTO
    },
    {
      input: {
        hasUnpaidVacationTime: boolean
        unpaidVacations?: Array<GaldurDomainModelsApplicationsUnemploymentApplicationsDTOsUnpaidVacationDTO>
        resignationEnds?: string
      }
    }
  >(VALIDATE_VACATION)
}
