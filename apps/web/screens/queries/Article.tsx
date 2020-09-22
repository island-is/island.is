import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_ARTICLE_QUERY = gql`
  query GetSingleArticle($input: GetSingleArticleInput!) {
    getSingleArticle(input: $input) {
      id
      slug
      title
      shortTitle
      intro
      containsApplicationForm
      importance
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
