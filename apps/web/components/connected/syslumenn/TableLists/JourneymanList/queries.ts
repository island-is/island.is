import gql from 'graphql-tag'

export const GET_JOURNEYMAN_LICENCES_QUERY = gql`
  query GetJourneymanLicences {
    getJourneymanLicences {
      licences {
        name
        dateOfPublication
        profession
        nationalId
      }
    }
  }
`
