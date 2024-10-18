import gql from 'graphql-tag'

export const GET_FRONTPAGE_QUERY = gql`
  query GetFrontpage($input: GetFrontpageInput!) {
    getFrontpage(input: $input) {
      __typename
      id
      heading
      imageAlternativeText
      image {
        url
        title
      }
      videos {
        url
        title
        contentType
      }
      imageMobile {
        url
        title
      }
      videosMobile {
        url
        title
        contentType
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
        featured {
          title
          attention
          thing {
            slug
            type
          }
        }
        seeMoreText
      }
      namespace {
        fields
      }
      linkList {
        title
        links {
          date
          text
          url
        }
      }
    }
  }
`
