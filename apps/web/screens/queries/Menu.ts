import gql from 'graphql-tag'

export const GET_MENU_QUERY = gql`
  query GetMenu($input: GetMenuInput!) {
    getMenu(input: $input) {
      title
      links {
        text
        url
      }
    }
  }
`
