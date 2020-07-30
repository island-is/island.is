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
          id
          title
          description
          inputLabel
          buttonText
        }
        ... on StorySlice {
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
          id
          title
          body
        }
        ... on LogoListSlice {
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
