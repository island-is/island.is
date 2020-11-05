import gql from 'graphql-tag'

export const GET_GDPR_INFO = gql`
  query skilavottordGdpr($nationalId: String!) {
    skilavottordGdpr(nationalId: $nationalId) {
      nationalId
      gdprStatus
      createdAt
      updatedAt
    }
  }
`
