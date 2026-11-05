import gql from 'graphql-tag'

export const siaUnionsQuery = gql`
  query SiaUnions($applicationId: String) {
    socialInsuranceGeneral {
      unions(applicationId: $applicationId) {
        nationalId
        name
      }
    }
  }
`

export const siaCountriesQuery = gql`
  query SiaCountries($applicationId: String) {
    socialInsuranceGeneral {
      countries(applicationId: $applicationId) {
        code
        name
      }
    }
  }
`

export const siaEducationalInstitutionsQuery = gql`
  query SiaEducationalInstitutions($applicationId: String) {
    socialInsuranceGeneral {
      educationalInstitutions(applicationId: $applicationId) {
        name
        nationalId
      }
    }
  }
`
