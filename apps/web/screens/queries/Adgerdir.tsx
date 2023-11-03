import { slices } from './fragments'
import gql from 'graphql-tag'

export const GET_ADGERDIR_PAGES_QUERY = gql`
  query GetAdgerdirPages($input: GetAdgerdirPagesInput!) {
    getAdgerdirPages(input: $input) {
      items {
        id
        slug
        title
        description
        tags {
          id
          title
        }
        status
      }
    }
  }
`

export const GET_ADGERDIR_PAGE_QUERY = gql`
  query GetAdgerdirPage($input: GetAdgerdirPageInput!) {
    getAdgerdirPage(input: $input) {
      id
      slug
      title
      description
      longDescription
      processEntry {
        ...ProcessEntryFields
      }
      content {
        ...AllSlices
      }
      tags {
        id
        title
      }
      link
      linkButtonText
    }
  }
  ${slices}
`

export const GET_ADGERDIR_TAGS_QUERY = gql`
  query GetAdgerdirTags($input: GetAdgerdirTagsInput!) {
    getAdgerdirTags(input: $input) {
      items {
        id
        title
      }
    }
  }
`

export const GET_ADGERDIR_FRONTPAGE_QUERY = gql`
  query GetAdgerdirFrontpage($input: GetAdgerdirFrontpageInput!) {
    getAdgerdirFrontpage(input: $input) {
      id
      title
      description
      featuredImage {
        url
        title
        width
        height
      }
      content {
        ... on Html {
          __typename
          id
          document
        }
      }
      slices {
        ... on AdgerdirGroupSlice {
          __typename
          id
          subtitle
          title
          description
          pages {
            title
            slug
            description
            content {
              ... on Html {
                __typename
                id
                document
              }
            }
            tags {
              id
              title
            }
            link
            status
          }
        }
        ... on AdgerdirFeaturedNewsSlice {
          __typename
          id
          title
          featured {
            id
            title
            subtitle
            date
            slug
            intro
            image {
              url
              title
              width
              height
            }
            genericTags {
              id
              title
            }
          }
        }
      }
    }
  }
`
