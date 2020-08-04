import gql from 'graphql-tag'

export const GET_ARTICLE_QUERY = gql`
  query GetArticle($input: ItemInput!) {
    singleItem(input: $input) {
      id
      slug
      title
      content: contentBlob
      group
      category
      categorySlug
    }
  }
`
