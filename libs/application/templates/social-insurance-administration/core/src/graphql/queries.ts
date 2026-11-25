import gql from 'graphql-tag'

export const siaUnionsQuery = gql`
  query SiaUnions($applicationId: String) {
    socialInsuranceGeneral(applicationId: $applicationId) {
      unions {
        nationalId
        name
      }
    }
  }
`

export const siaCountriesQuery = gql`
  query SiaCountries($applicationId: String) {
    socialInsuranceGeneral(applicationId: $applicationId) {
      countries {
        code
        name
      }
    }
  }
`

export const siaEducationalInstitutionsQuery = gql`
  query SiaEducationalInstitutions($applicationId: String) {
    socialInsuranceGeneral(applicationId: $applicationId) {
      educationalInstitutions {
        name
        nationalId
      }
    }
  }
`
