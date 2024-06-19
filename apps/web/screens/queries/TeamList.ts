import gql from 'graphql-tag'

import { imageFields } from './fragments'

export const GET_TEAM_MEMBERS_QUERY = gql`
  query GetTeamMembers($input: GetTeamMembersInput!) {
    getTeamMembers(input: $input) {
      total
      input {
        page
        queryString
        tags
      }
      items {
        name
        title
        image {
          ...ImageFields
        }
        imageOnSelect {
          ...ImageFields
        }
      }
    }
  }
  ${imageFields}
`
