import { gql } from '@apollo/client'
import { GetParentalLeavesPeriodEndDateInput } from '../types/schema'
import { useLazyQuery } from './useLazyQuery'

const query = gql`
  query GetParentalLeavesPeriodEndDate(
    $input: GetParentalLeavesPeriodEndDateInput!
  ) {
    getParentalLeavesPeriodEndDate(input: $input) {
      periodEndDate
    }
  }
`

export const useLazyParentalLeavePeriodEndDate = () => {
  return useLazyQuery<
    {
      getParentalLeavesPeriodEndDate: { periodEndDate: number }
    },
    { input: GetParentalLeavesPeriodEndDateInput }
  >(query)
}
