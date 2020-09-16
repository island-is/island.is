import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_ARTICLE_QUERY = gql`
  query GetArticle($input: GetArticleInput!) {
    getArticle(input: $input) {
      id
      slug
      title
      shortTitle
      intro
      containsApplicationForm,
      body {
        ...AllSlices
      }
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
      subArticles {
        title
        slug
        body {
          ...AllSlices
        }
      }
    }
  }
  ${slices}
`
