import gql from 'graphql-tag'

export const GET_GDPR_INFO = gql`
  query getGDPRInfo($nationalId: String!) {
    getGDPRInfo(nationalId: $nationalId) {
      nationalId
      gdprStatus
      createdAt
      updatedAt
    }
  }
`
