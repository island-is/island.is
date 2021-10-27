import { gql } from '@apollo/client'
import { IdentityInput } from '@island.is/api/schema'
import { useLazyQuery } from './useLazyQuery'

const query = gql`
  query Identity($input: IdentityInput!) {
    identity(input: $input) {
      nationalId
      type
      name
    }
  }
`

export const useLazyGetIdentity = () => {
  return useLazyQuery<
    {
      nationalId: string
    },
    { input: IdentityInput }
  >(query)
}
