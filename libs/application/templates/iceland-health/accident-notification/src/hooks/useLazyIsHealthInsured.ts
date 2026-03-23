import { gql } from '@apollo/client'
import { IsHealthInsuredInput } from '@island.is/api/schema'
import { useLazyQuery } from './useLazyQuery'

const query = gql`
  query HealthInsuranceIsHealthInsured($input: IsHealthInsuredInput!) {
    healthInsuranceIsHealthInsured(input: $input)
  }
`

export const useLazyIsHealthInsured = () => {
  return useLazyQuery<
    {
      healthInsuranceIsHealthInsured: boolean
    },
    { input: IsHealthInsuredInput }
  >(query)
}
