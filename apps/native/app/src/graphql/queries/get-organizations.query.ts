import { gql } from '@apollo/client'

export const GET_ORGANIZATIONS_QUERY = gql`
  query getOrganizations {
    getOrganizations(input: { lang: "is-IS", perPage: 200 }) {
      items {
        id
        title
        shortTitle
        description
        slug
        tag {
          id
          title
        }
        link
        logo {
          id
          title
          url
          width
          height
        }
      }
    }
  }
`;
