import gql from 'graphql-tag'

export const GET_TIMELINE_QUERY = gql`
  query GetTimeline {
    getTimeline {
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
`
