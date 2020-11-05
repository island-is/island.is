import gql from 'graphql-tag'

export const GDPR_INFO_BY_NATIONAL_ID = gql`
  query skilavottordGdpr($nationalId: String!) {
    skilavottordGdpr(nationalId: $nationalId) {
      nationalId
      gdprStatus
      createdAt
      updatedAt
    }
  }
`
