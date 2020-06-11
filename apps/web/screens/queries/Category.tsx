import gql from 'graphql-tag'

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories($input: CategoriesInput!) {
    getCategories(input: $input) {
      title
      slug
    }
  }
`
