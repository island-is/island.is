import gql from 'graphql-tag'

export const GET_ALCOHOL_LICENCES_QUERY = gql`
  query GetAlcoholLicences {
    getAlcoholLicences {
      licenceType
      licenceSubType
      licenseNumber
      issuedBy
      validFrom
      validTo
      licenseHolder
      licenseResponsible
    }
  }
`
