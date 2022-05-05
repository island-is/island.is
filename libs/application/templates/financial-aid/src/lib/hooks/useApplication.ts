import { gql, useQuery } from '@apollo/client'
import { Application } from '@island.is/financial-aid/shared/lib'

export const ApplicationQuery = gql`
  query MunicipalitiesFinancialAidApplicationQuery(
    $input: MunicipalitiesFinancialAidApplicationInput!
  ) {
    municipalitiesFinancialAidApplication(input: $input) {
      state
      rejection
      created
      modified
      amount {
        aidAmount
        income
        personalTaxCredit
        spousePersonalTaxCredit
        tax
        finalAmount
        deductionFactors {
          description
          amount
        }
      }
    }
  }
`

const useApplication = (id: string) => {
  const { data } = useQuery<{
    municipalitiesFinancialAidApplication: Application
  }>(ApplicationQuery, {
    variables: { input: { id } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  return {
    currentApplication: data?.municipalitiesFinancialAidApplication,
  }
}

export default useApplication
