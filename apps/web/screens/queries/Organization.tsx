import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_ORGANIZATIONS_QUERY = gql`
  query GetOrganizations($input: GetOrganizationsInput!) {
    getOrganizations(input: $input) {
      items {
        id
        slug
        title
        description
        link
        tag {
          id
          title
        }
      }
    }
  }
`

export const GET_ORGANIZATION_QUERY = gql`
  query GetOrganization($input: GetOrganizationInput!) {
    getOrganization(input: $input) {
      id
      slug
      title
      logo {
        title
        url
      }
      link
      tag {
        id
        title
      }
      description
    }
  }
`

export const GET_ORGANIZATION_PAGE_QUERY = gql`
  query GetOrganizationPage($input: GetOrganizationPageInput!) {
    getOrganizationPage(input: $input) {
      id
      slug
      title
      description
      menuLinks {
        primaryLink {
          text
          url
        }
        childrenLinks {
          text
          url
        }
      }
      organization {
        logo {
          url
        }
      }
      slices {
        ... on HeadingSlice {
          id
          title
          body
        }
        ... on Districts {
          id
          title
          description
          links {
            text
            url
          }
          image {
            url
          }
        }
        ... on FeaturedArticles {
          id
          title
          image {
            url
          }
          articles {
            title
            slug
            processEntry {
              id
            }
          }
        }
      }
      featuredImage {
        url
        title
        width
        height
      }
      footerItems {
        title
        content
        link {
          text
          url
        }
      }
    }
  }
`

export const GET_ORGANIZATION_SUBPAGE_QUERY = gql`
  query GetOrganizationSubpage($input: GetOrganizationSubpageInput!) {
    getOrganizationSubpage(input: $input) {
      title
      slug
      description
      links {
        text
        url
      }
      menuItem {
        url
      }
      slices {
        ...AllSlices
      }
      sidebarCards {
        intro
        name
        email
        logo {
          url
        }
      }
      featuredImage {
        url
        title
        width
        height
      }
    }
  }
  ${slices}
`

export const GET_ORGANIZATION_TAGS_QUERY = gql`
  query GetOrganizationTags($input: GetOrganizationTagsInput!) {
    getOrganizationTags(input: $input) {
      items {
        id
        title
      }
    }
  }
`
