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
        slug
        description
      }
      category {
        title
        slug
        description
      }
      relatedArticles {
        title
        slug
      }
    }
  }
`
