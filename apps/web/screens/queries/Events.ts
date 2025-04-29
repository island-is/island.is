import gql from 'graphql-tag'

import { imageFields, slices } from './fragments'

export const GET_SINGLE_EVENT_QUERY = gql`
  query GetSingleEvent($input: GetSingleEventInput!) {
    getSingleEvent(input: $input) {
      id
      title
      slug
      startDate
      time {
        startTime
        endTime
      }
      location {
        streetAddress
        floor
        postalCode
        useFreeText
        freeText
      }
      contentImage {
        ...ImageFields
      }
      thumbnailImage {
        ...ImageFields
      }
      fullWidthImageInContent
      content {
        ...AllSlices
      }
      featuredImage {
        ...ImageFields
      }
      video {
        ...EmbeddedVideoFields
      }
    }
  }
  ${slices}
`

export const GET_EVENTS_QUERY = gql`
  query GetEvents($input: GetEventsInput!) {
    getEvents(input: $input) {
      total
      items {
        id
        title
        slug
        startDate
        firstPublishedAt
        time {
          startTime
          endTime
        }
        location {
          streetAddress
          floor
          postalCode
          useFreeText
          freeText
        }
        thumbnailImage {
          ...ImageFields
        }
      }
    }
  }
  ${imageFields}
`
