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

export const SEARCH_FOR_PROPERTY_QUERY = gql`
  query SearchForProperty($input: SearchForPropertyInput!) {
    searchForProperty(input: $input) {
      defaultAddress {
        display
      }
    }
  }
`

export const GET_VEHICLE_QUERY = gql`
  query GetVehicle($input: GetVehicleInput!) {
    syslumennGetVehicle(input: $input) {
      modelName
      manufacturer
      licensePlate
      color
    }
  }
`
