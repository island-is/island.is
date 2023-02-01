import gql from 'graphql-tag'

export const GET_ALCOHOL_LICENCES_QUERY = gql`
  query GetAlcoholLicences {
    getAlcoholLicences {
      caseType
      licenceType
      licenceSubType
      licenseNumber
      issuedBy
      year
      validFrom
      validTo
      licenseHolder
      licenseResponsible
    }
  }
`
