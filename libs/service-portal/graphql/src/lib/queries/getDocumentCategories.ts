import { gql } from '@apollo/client'

export const GET_DOCUMENT_CATEGORIES = gql`
  query getDocumentCategories {
    getDocumentCategories {
      id
      name
    }
  }
`
