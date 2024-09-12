import gql from 'graphql-tag'

import { htmlFields, imageFields } from './fragments'

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
        email
        phone
        tagGroups {
          groupLabel
          tagLabels
        }
        image {
          ...ImageFields
        }
        imageOnSelect {
          ...ImageFields
        }
        intro {
          ...HtmlFields
        }
      }
    }
  }
  ${imageFields}
  ${htmlFields}
`
