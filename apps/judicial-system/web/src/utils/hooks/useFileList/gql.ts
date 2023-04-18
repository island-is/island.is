import { gql } from '@apollo/client'

export const GetSignedUrlQuery = gql`
  query GetSignedUrlQuery($input: GetSignedUrlInput!) {
    getSignedUrl(input: $input) {
      url
    }
  }
`

export const LimitedAccessGetSignedUrlQuery = gql`
  query LimitedAccessGetSignedUrlQuery($input: GetSignedUrlInput!) {
    limitedAccessGetSignedUrl(input: $input) {
      url
    }
  }
`
