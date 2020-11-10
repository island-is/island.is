import gql from 'graphql-tag'

export const CREATE_VEHICLE = gql`
  mutation createSkilavottordVehicle(
    $vinNumber: String!
    $newRegDate: DateTime!
    $color: String!
    $type: String!
    $nationalId: String!
    $permno: String!
  ) {
    createSkilavottordVehicle(
      vinNumber: $vinNumber
      newRegDate: $newRegDate
      color: $color
      type: $type
      nationalId: $nationalId
      permno: $permno
    )
  }
`
