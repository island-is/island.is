import gql from 'graphql-tag'

export const GET_MASTER_LICENCES_QUERY = gql`
  query GetMasterLicences {
    getMasterLicences {
      licences {
        name
        dateOfPublication
        profession
      }
    }
  }
`
