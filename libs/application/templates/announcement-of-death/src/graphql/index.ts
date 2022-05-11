import { gql } from '@apollo/client'
export const IDENTITY_QUERY = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const ESTATE_RELATIONS_QUERY = gql`
  query EstateRelationsQuery {
    getSyslumennEstateRelations {
      relations
    }
  }
`
