import gql from 'graphql-tag'

import { slices } from './fragments'

export const GET_SINGLE_EVENT_QUERY = gql`
  query GetSingleEvent($input: GetSingleEventInput!) {
    getSingleEvent(input: $input) {
      id
      title
      slug
      startDate
      endDate
      time {
        startTime
        endTime
        endDate
      }
      organization {
        slug
      }
      location {
        streetAddress
        floor
        postalCode
        useFreeText
        freeText
      }
      contentImage {
        url
        title
        width
        height
        description
      }
      thumbnailImage {
        url
        title
        width
        height
        description
      }
      fullWidthImageInContent
      content {
        ...AllSlices
      }
      featuredImage {
        url
        title
        width
        height
        description
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
        endDate
        time {
          startTime
          endTime
          endDate
        }
        location {
          streetAddress
          floor
          postalCode
          useFreeText
          freeText
        }
        thumbnailImage {
          url
          title
          width
          height
          description
        }
      }
    }
  }
`
