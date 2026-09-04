import gql from 'graphql-tag'

export const GET_ORGANIZATION_TEAM_MEMBERS = gql`
  query getOrgTeamMembers($input: IcelandicGovernmentEmployeesInput!) {
    icelandicGovernmentEmployees(input: $input) {
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
      }
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  }
`
