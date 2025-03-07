import gql from 'graphql-tag'

export const IS_COMPANY_VALID = `
  query IsCompanyValid($nationalId: String!) {
    seminarsVerIsCompanyValid(nationalId: $nationalId) {
      nationalId
      mayPayWithAnAccount
    }
  }
`

export const ARE_INDIVIDUALS_VALID = gql`
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
    }
  }
`
