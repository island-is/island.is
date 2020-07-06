import gql from 'graphql-tag'

export const GET_ARTICLE_QUERY = gql`
  query GetArticle($input: GetArticleInput!) {
    getArticle(input: $input) {
      id
      slug
      title
      content
      group {
        title
      }
      category {
        title
        slug
      }
    }
  }
`

export const GET_ARTICLES_QUERY = gql`
  query articles($input: GetArticlesInput!) {
    getArticles(input: $input) {
      id
      slug
      title
      content
    }
  }
`
