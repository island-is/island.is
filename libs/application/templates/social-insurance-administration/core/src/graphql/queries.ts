import gql from 'graphql-tag'

export const siaUnionsQuery = gql`
  query SiaUnions {
    socialInsuranceGeneral {
      unions {
        nationalId
        name
      }
    }
  }
`

export const siaCountriesQuery = gql`
  query SiaCountries {
    socialInsuranceGeneral {
      countries {
        code
        name
      }
    }
  }
`

export const siaEducationalInstitutionsQuery = gql`
  query SiaEducationalInstitutions {
    socialInsuranceGeneral {
      educationalInstitutions {
        name
        nationalId
      }
    }
  }
`
