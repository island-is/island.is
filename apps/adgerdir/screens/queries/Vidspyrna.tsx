import gql from 'graphql-tag'

export const GET_VIDSPYRNA_ITEMS_QUERY = gql`
  query GetVidspyrnaItems($input: GetVidspyrnaItemsInput!) {
    getVidspyrnaItems(input: $input) {
      items {
        id
        slug
        title
        description
        content
      }
    }
  }
`

export const GET_VIDSPYRNA_ITEM_QUERY = gql`
  query GetVidspyrnaItem($input: GetVidspyrnaItemInput!) {
    getVidspyrnaItem(input: $input) {
      id
      slug
      title
      description
      content
    }
  }
`

export const GET_VIDSPYRNA_FRONTPAGE_QUERY = gql`
  query GetVidspyrnaFrontpage($input: GetVidspyrnaFrontpageInput!) {
    getVidspyrnaFrontpage(input: $input) {
      id
      slug
      title
      description
      content
    }
  }
`
