import gql from 'graphql-tag'

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories($input: GetCategoriesInput!) {
    getCategories(input: { language: is }) {
      title
      slug
    }
  }
`
