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
      importance
      body {
        ...AllSlices
      }
      processEntry {
        id
        type
        processTitle
        processLink
        openLinkInModal
        buttonText
      }
      group {
        title
        slug
        description
      }
      category {
        id
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
      featuredImage {
        url
        title
        width
        height
      }
    }
  }
  ${slices}
`

export const GET_CONTENT_SLUG = gql`
  query GetContentSlug($input: GetContentSlugInput!) {
    getContentSlug(input: $input) {
      slug
      type
    }
  }
`
