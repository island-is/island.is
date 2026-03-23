import { gql } from '@apollo/client'

export const GET_QNA = gql`
  query GetSupportQNAsInCategory($input: GetSupportQNAsInCategoryInput!) {
    getSupportQNAsInCategory(input: $input) {
      id
      title
      slug
      importance
      subCategory {
        title
        description
        slug
        importance
      }
      category {
        title
        description
        slug
      }
    }
  }
`
