import { gql, useMutation, useQuery } from '@apollo/client'
import {
  Application,
  ApplicationEventType,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'

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
      applicationEvents {
        id
        applicationId
        eventType
        comment
        created
      }
    }
  }
`

export const ApplicationMutation = gql`
  mutation UpdateMunicipalitiesFinancialAidApplicationMutation(
    $input: MunicipalitiesFinancialAidUpdateApplicationInput!
  ) {
    updateMunicipalitiesFinancialAidApplication(input: $input) {
      id
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

  const [updateApplicationMutation] = useMutation<{
    updateApplication: Application
  }>(ApplicationMutation)

  const updateApplication = async (
    state: ApplicationState,
    event: ApplicationEventType,
    comment: string,
  ) => {
    return await updateApplicationMutation({
      variables: {
        input: {
          id: id,
          state: state,
          event: event,
          comment: comment,
        },
      },
    })
  }

  return {
    currentApplication: data?.municipalitiesFinancialAidApplication,
    updateApplication,
  }
}

export default useApplication
