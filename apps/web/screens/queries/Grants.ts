import gql from 'graphql-tag'

export const GET_GRANTS_QUERY = gql`
  query GetGrants($input: GetGrantsInput!) {
    getGrants(input: $input) {
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
    }
  }
`
