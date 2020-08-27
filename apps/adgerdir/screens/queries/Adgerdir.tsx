import gql from 'graphql-tag'

export const GET_ADGERDIR_PAGES_QUERY = gql`
  query GetAdgerdirPages($input: GetAdgerdirPagesInput!) {
    getAdgerdirPages(input: $input) {
      items {
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

export const GET_ADGERDIR_FRONTPAGE_QUERY = gql`
  query GetAdgerdirFrontpage($input: GetAdgerdirFrontpageInput!) {
    getAdgerdirFrontpage(input: $input) {
      id
      slug
      title
      description
      content
    }
  }
`
