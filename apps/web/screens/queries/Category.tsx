import gql from 'graphql-tag'

export const GET_CATEGORIES_QUERY = gql`
  query GetArticleCategories($input: GetArticleCategoriesInput!) {
    getArticleCategories(input: $input) {
      title
      description
      slug
    }
  }
`

export const GET_ARTICLES_QUERY = gql`
  query getArticles($input: GetArticlesInput!) {
    getArticles(input: $input) {
      intro
      category {
        title
      }
      slug
      title
      group {
        slug
        title
        description
      }
      subgroup {
        title
      }
    }
  }
`
