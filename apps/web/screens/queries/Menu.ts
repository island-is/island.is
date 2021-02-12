import gql from 'graphql-tag'

export const GET_MENU_QUERY = gql`
  query GetMenu($input: GetMenuInput!) {
    getMenu(input: $input) {
      id
      title
      links {
        text
        url
      }
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
`

export const GET_GROUPED_MENU_QUERY = gql`
  query GetGroupedMenu($input: GetSingleMenuInput!) {
    getGroupedMenu(input: $input) {
      id
      title
      menus {
        id
        title
        links {
          text
          url
        }
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
