import { gql } from '@apollo/client'

export const CREATE_SIGNED_URL = gql`
  mutation createSignedUrl($url: String!) {
    createSignedUrl(url: $url)
  }
`
