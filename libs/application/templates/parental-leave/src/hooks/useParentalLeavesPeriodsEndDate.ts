import { gql } from '@apollo/client'

import { GetParentalLeavesPeriodsEndDateInput } from '@island.is/api/domains/directorate-of-labour'

import { useLazyQuery } from './useLazyQuery'

const query = gql`
  query GetParentalLeavesPeriodsEndDate(
    $input: GetParentalLeavesPeriodsEndDateInput!
  ) {
    getParentalLeavesPeriodsEndDate(input: $input) {
      periodEndDate
    }
  }
`

export const useParentalLeavesPeriodsEndDate = () => {
  return useLazyQuery<
    {
      getParentalLeavesPeriodsEndDate: { periodEndDate: number }
    },
    { input: GetParentalLeavesPeriodsEndDateInput }
  >(query)
}
