import gql from 'graphql-tag'

export const GET_FRONTPAGE_SLIDES_QUERY = gql`
  query GetFrontpageSliderList($input: GetFrontpageSliderListInput!) {
    getFrontpageSliderList(input: $input) {
      items {
        subtitle
        title
        content
        link
        image {
          url
          title
          contentType
          width
          height
        }
        animationZip {
          url
          contentType
        }
      }
    }
  }
`

export const GET_CONTENTFUL_ASSET_BLOB_QUERY = gql`
  query GetContentfulAssetBlob($input: GetContentfulAssetBlobInput!) {
    getContentfulAssetBlob(input: $input) {
      blob
    }
  }
`
