import { gql } from '@apollo/client'

export const GET_ONE_SYSTEMS_RULINGS = gql`
  query GetOneSystemsRulings($input: GetOneSystemsRulingsInput!) {
    oneSystemsRulings(input: $input) {
      rulings {
        id
        title
        description
        publishedDate
      }
      totalCount
    }
  }
`

export const GET_ONE_SYSTEMS_RULING_PDF = gql`
  query GetOneSystemsRulingPdf($id: ID!) {
    oneSystemsRulingPdf(id: $id) {
      base64
      contentType
    }
  }
`
