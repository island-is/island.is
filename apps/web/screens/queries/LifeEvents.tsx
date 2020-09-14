import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_LIFE_EVENT_QUERY = gql`
  query GetLifeEvent($input: GetLifeEventPageInput!) {
    getLifeEventPage(input: $input) {
      title
      slug
      intro
      image {
        ...ImageFields
      }
      content {
        ...AllSlices
      }
    }
  }
  ${slices}
`

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
    }
  }
`

export const GET_LIFE_EVENTS_IN_CATEGORY_QUERY = gql`
  query GetLifeEventsInCategory($input: GetLifeEventsInput!) {
    getLifeEventsInCategory(input: $input) {
      title
      slug
      intro
      category {
        title
        slug
      }
      thumbnail {
        url
      }
      image {
        url
      }
    }
  }
`
