import gql from 'graphql-tag'
import { nestedFields, slices } from './fragments'

export const GET_LIFE_EVENT_QUERY = gql`
  query GetLifeEvent($input: GetLifeEventPageInput!) {
    getLifeEventPage(input: $input) {
      id
      title
      slug
      intro
      image {
        ...ImageFields
      }
      content {
        ...AllSlices
        ${nestedFields}
      }
      featuredImage {
        ...ImageFields
      }
    }
  }
  ${slices}
`

export const GET_LIFE_EVENTS_QUERY = gql`
  query GetLifeEvents($input: GetLifeEventsInput!) {
    getLifeEvents(input: $input) {
      id
      title
      slug
      intro
      thumbnail {
        url
        title
      }
      image {
        url
        title
      }
    }
  }
`

export const GET_LIFE_EVENTS_IN_CATEGORY_QUERY = gql`
  query GetLifeEventsInCategory($input: GetLifeEventsInCategoryInput!) {
    getLifeEventsInCategory(input: $input) {
      id
      title
      slug
      intro
      category {
        title
        slug
      }
      thumbnail {
        url
        title
      }
      image {
        url
        title
      }
    }
  }
`
