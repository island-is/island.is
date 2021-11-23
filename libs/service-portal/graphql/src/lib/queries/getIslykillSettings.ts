import { gql } from '@apollo/client'

export const GET_ISLYKILL_SETTINGS = gql`
  query GetIslykillSettings {
    getIslykillSettings {
      email
      mobile
      bankInfo
      canNudge
    }
  }
`
