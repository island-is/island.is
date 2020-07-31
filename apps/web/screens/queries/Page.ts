import gql from 'graphql-tag'

export const GET_PAGE_QUERY = gql`
  query($input: GetPageInput!) {
    getPage(input: $input) {
      title
      slug
      seoDescription
      numSlicesInHeader
      slices {
        ... on TimelineSlice {
          __typename
          id
          title
          events {
            id
            title
            date
            numerator
            denominator
            label
            body
            tags
            link
          }
        }
        ... on MailingListSignupSlice {
          __typename
          id
          title
          description
          inputLabel
          buttonText
        }
        ... on StorySlice {
          __typename
          id
          readMoreText
          stories {
            title
            intro
            label
            logo {
              width
              height
              url
              contentType
            }
            body
          }
        }
        ... on LatestNewsSlice {
          __typename
          id
          title
          news {
            title
            slug
            date
            intro
            content
            image {
              width
              height
              url
              contentType
            }
          }
        }
        ... on LinkCardSlice {
          __typename
          id
          title
          cards {
            title
            body
            link
            linkText
          }
        }
        ... on HeadingSlice {
          __typename
          id
          title
          body
        }
        ... on LogoListSlice {
          __typename
          id
          title
          body
          images {
            width
            height
            url
            contentType
          }
        }
      }
    }
  }
`
