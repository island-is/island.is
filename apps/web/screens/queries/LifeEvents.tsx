import gql from 'graphql-tag'

export const GET_LIFE_EVENTS_QUERY = gql`
  query GetLifeEvents($input: GetLifeEventsInput!) {
    getLifeEvents(input: $input) {
      title
      slug
      intro
      thumbnail {
        url
      }
      image {
        url
      }
      body
    }
  }
`
