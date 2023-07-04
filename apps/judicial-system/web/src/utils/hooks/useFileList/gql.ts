import { gql } from '@apollo/client'

export const GetSignedUrlQuery = gql`
  query GetSignedUrl($input: GetSignedUrlInput!) {
    getSignedUrl(input: $input) {
      url
    }
  }
`

export const LimitedAccessGetSignedUrlQuery = gql`
  query LimitedAccessGetSignedUrl($input: GetSignedUrlInput!) {
    limitedAccessGetSignedUrl(input: $input) {
      url
    }
  }
`
