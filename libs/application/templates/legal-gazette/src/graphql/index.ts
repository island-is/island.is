import { gql } from '@apollo/client'

export const LEGAL_GAZETTE_CATEGORIES_QUERY = gql`
  query GetLegalGazetteCategories($input: LegalGazetteGetCategoriesInput!) {
    legalGazetteCategories(input: $input) {
      categories {
        id
        title
        slug
      }
    }
  }
`
