import gql from 'graphql-tag'

export const GET_PROFESSION_RIGHTS_QUERY = gql`
  query GetProfessionRights {
    getProfessionRights {
      list {
        name
        profession
        nationalId
      }
    }
  }
`
