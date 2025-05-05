import gql from 'graphql-tag'

export const IS_COMPANY_VALID_QUERY = gql`
  query IsCompanyValid($nationalId: String!) {
    seminarsVerIsCompanyValid(nationalId: $nationalId) {
      nationalId
      mayPayWithAnAccount
    }
  }
`

export const ARE_INDIVIDUALS_VALID_QUERY = gql`
  query AreIndividualsValid(
    $input: ValidateSeminarIndividualsInput!
    $courseID: String!
    $nationalIdOfRegisterer: String
  ) {
    areIndividualsValid(
      input: $input
      courseID: $courseID
      nationalIdOfRegisterer: $nationalIdOfRegisterer
    ) {
      nationalID
      mayTakeCourse
      errorMessage
      errorMessageEn
      errorCode
    }
  }
`
