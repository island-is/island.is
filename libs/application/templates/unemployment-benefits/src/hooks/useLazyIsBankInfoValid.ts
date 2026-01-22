import { useLazyQuery } from '@apollo/client'
import { VALIDATE_ACCOUNT_NUMBER } from '../graphql/queries'
import {
  GaldurDomainModelsApplicantsApplicantProfileDTOsPensionFund,
  GaldurDomainModelsApplicantsApplicantProfileDTOsUnion,
  GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationValidationResponseDTO,
} from '@island.is/clients/vmst-unemployment'

export const useLazyIsBankInfoValid = () => {
  return useLazyQuery<
    {
      vmstApplicationsAccountNumberValidationUnemploymentApplication: GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationValidationResponseDTO
    },
    {
      input: {
        bankNumber: string
        ledger: string
        accountNumber: string
        pensionFund?: GaldurDomainModelsApplicantsApplicantProfileDTOsPensionFund
        doNotPayToUnion: boolean
        union?: GaldurDomainModelsApplicantsApplicantProfileDTOsUnion
        supplementaryPensionFunds?: Array<GaldurDomainModelsApplicantsApplicantProfileDTOsPensionFund>
      }
    }
  >(VALIDATE_ACCOUNT_NUMBER)
}
