import { gql } from '@apollo/client'
import {
  GetScheduleDistributionInput,
  PaymentScheduleDistribution,
} from '@island.is/api/schema'
import { useLazyQuery } from './useLazyQuery'

const query = gql`
  query PaymentScheduleDistribution($input: GetScheduleDistributionInput!) {
    paymentScheduleDistribution(input: $input) {
      nationalId
      scheduleType
      payments {
        dueDate
        payment
        accumulated
      }
    }
  }
`

export const useLazyDistribution = () => {
  return useLazyQuery<
    {
      paymentScheduleDistribution: PaymentScheduleDistribution
    },
    { input: GetScheduleDistributionInput }
  >(query)
}
