import { gql } from '@apollo/client'

export const CATEGORIES = gql`
  query AdvertCategories($input: MinistryOfJusticeQueryInput!) {
    ministryOfJusticeCategories(params: $input) {
      categories {
        id
        title
        slug
      }
      paging {
        page
        pageSize
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
        nextPage
        previousPage
      }
    }
  }
`
