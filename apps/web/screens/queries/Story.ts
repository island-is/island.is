import gql from 'graphql-tag'

export const GET_STORIES_QUERY = gql`
  query GetStories {
    getStories {
      title
      date
      label
      intro
      body
      logo {
        url
        title
        width
        height
      }
    }
  }
`
