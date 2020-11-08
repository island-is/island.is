import gql from 'graphql-tag'

export const CREATE_VEHICLE_OWNER = gql`
  mutation createSkilavottordVehicleOwner(
    $name: String!
    $nationalId: String!
  ) {
    createSkilavottordVehicleOwner(name: $name, nationalId: $nationalId)
  }
`
