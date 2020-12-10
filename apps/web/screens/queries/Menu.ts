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

export const GET_GROUPED_MENU_QUERY = gql`
  query GetGroupedMenu($input: GetSingleMenuInput!) {
    getGroupedMenu(input: $input) {
      id
      title
      menus {
        title
        menuLinks {
          title
          link {
            slug
            type
          }
          childLinks {
            title
            link {
              slug
              type
            }
          }
        }
      }
    }
  }
`
