import gql from 'graphql-tag'
import { nestedFields, slices } from './fragments'

export const GET_GRANTS_QUERY = gql`
  query GetGrants($input: GetGrantsInput!) {
    getGrants(input: $input) {
      items {
        id
        name
        description
        applicationId
        applicationDeadlineText
        applicationUrl {
          slug
          type
        }
        dateFrom
        dateTo
        isOpen
        status
        statusText
        organization {
          id
          title
          logo {
            url
          }
        }
        categoryTag {
          id
          title
          genericTagGroup {
            title
          }
        }
        typeTag {
          id
          title
          genericTagGroup {
            title
          }
        }
        fund {
          id
          title
          url {
            slug
            type
          }
          link {
            slug
            type
          }
          featuredImage {
            id
            url
          }
          parentOrganization {
            id
            title
          }
        }
      }
    }
  }
`

export const GET_GRANT_QUERY = gql`
  query GetGrant($input: GetSingleGrantInput!) {
    getSingleGrant(input: $input) {
      id
      name
      description
      applicationId
      applicationUrl {
          slug
          type
    }
      applicationDeadlineText
      statusText
      categoryTag {
        id
        title
      }
      typeTag {
        id
        title
      }
      organization {
          title
          logo {
            url
          }
      }
      files {
          ...AssetFields
      }
      fund {
        id
        title
        url {
          slug
          type
        }
        link {
          slug
          type
        }
        featuredImage {
          id
          url
        }
        parentOrganization {
          id
          title
        }
      }
      whatIsGranted {
        ...AllSlices
        ${nestedFields}
      }
      specialEmphasis {
        ...AllSlices
        ${nestedFields}
      }
      whoCanApply {
        ...AllSlices
        ${nestedFields}
      }
      howToApply {
        ...AllSlices
        ${nestedFields}
      }
      applicationDeadline {
        ...AllSlices
        ${nestedFields}
      }
    }
  }
  ${slices}
`
