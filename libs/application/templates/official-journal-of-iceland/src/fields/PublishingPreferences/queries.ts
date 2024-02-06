import { gql } from '@apollo/client'

export const CATEGORIES = gql`
  query ministryOfJusticeCategories($input: MinistryOfJusticeCategoryInput!) {
    categories {
      id
      title
      slug
    }
  }
`
