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
      content
      tags {
        id
        title
      }
      link
      status
    }
  }
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
      content
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
            content
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
            subtitle
            title
            slug
            intro
            image {
              url
              title
              contentType
              width
              height
            }
            date
            content
          }
        }
      }
    }
  }
`
