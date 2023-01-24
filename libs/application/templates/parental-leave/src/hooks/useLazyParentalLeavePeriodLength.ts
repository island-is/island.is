import { gql } from '@apollo/client'
import { GetParentalLeavesPeriodLengthInput } from '../types/schema'

import { useLazyQuery } from './useLazyQuery'

const query = gql`
  query GetParentalLeavesPeriodLength(
    $input: GetParentalLeavesPeriodLengthInput!
  ) {
    getParentalLeavesPeriodLength(input: $input) {
      periodLength
    }
  }
`

export const useLazyParentalLeavePeriodLength = () => {
  return useLazyQuery<
    {
      getParentalLeavesPeriodLength: { periodLength: number }
    },
    { input: GetParentalLeavesPeriodLengthInput }
  >(query)
}
