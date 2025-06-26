import gql from 'graphql-tag'

export const siaUnionsQuery = gql`
  query SiaUnions {
    socialInsuranceUnions {
      nationalId
      name
    }
  }
`

export const siaCountriesQuery = gql`
  query SiaCountries {
    socialInsuranceCountries {
      code
      name
    }
  }
`

export const siaEducationalInstitutionsQuery = gql`
  query SiaEducationalInstitutions {
    socialInsuranceEducationalInstitutions {
      name
      nationalId
    }
  }
`
