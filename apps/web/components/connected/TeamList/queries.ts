import gql from 'graphql-tag'

export const GET_ORGANIZATION_TEAM_MEMBERS = gql`
  query getOrgTeamMembers($input: IcelandicGovernmentInstitutionsEmployeesInput!) {
    icelandicGovernmentInstitutionsEmployees(input: $input) {
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
