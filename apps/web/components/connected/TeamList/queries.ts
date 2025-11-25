import gql from 'graphql-tag'

export const GET_ORGANIZATION_TEAM_MEMBERS = gql`
  query getOrgTeamMembers($locale: LocaleEnum!, $organizationId: String!) {
    icelandicGovernmentInstitutionsEmployees(
      locale: $locale
      organizationId: $organizationId
    ) {
      data {
        name
        job
        email
        phoneNumber
        location {
          address
          description
          postalCode
        }
        department
        currentlyActive
      }
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  }
`
