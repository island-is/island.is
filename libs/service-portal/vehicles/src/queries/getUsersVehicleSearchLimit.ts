import { gql } from '@apollo/client'

export const GET_USERS_VEHICLES_SEARCH_LIMIT = gql`
  query GetUsersVehiclesSearchLimit {
    vehiclesSearchLimit
  }
`
