import gql from 'graphql-tag'

export const GET_SINGLE_ITEM = gql`
  query GetSingleItem($input: ItemInput!) {
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
