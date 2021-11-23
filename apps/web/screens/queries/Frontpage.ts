import gql from 'graphql-tag'

export const GET_FRONTPAGE_QUERY = gql`
  query GetFrontpage($input: GetFrontpageInput!) {
    getFrontpage(input: $input) {
      __typename
      id
      heading
      image {
        url
        title
      }
      video {
        url
        title
      }
      imageMobile {
        url
        title
      }
      videoMobile {
        url
        title
      }
      featured {
        title
        attention
        thing {
          slug
          type
        }
      }
      lifeEvents {
        id
        title
        shortTitle
        slug
        tinyThumbnail {
          url
          title
        }
      }
      namespace {
        fields
      }
    }
  }
`
