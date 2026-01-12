import gql from 'graphql-tag'

import { slices } from './fragments'

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
      }
      featured {
        title
        attention
        thing {
          slug
          type
        }
      }
      featuredImage {
        ...ImageFields
      }
    }
  }
  ${slices}
`

export const GET_LIFE_EVENTS_FOR_OVERVIEW_QUERY = gql`
  query GetLifeEventsForOverview($input: GetLifeEventsInput!) {
    getLifeEventsForOverview(input: $input) {
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
