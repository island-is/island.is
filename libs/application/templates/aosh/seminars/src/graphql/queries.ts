export const IS_COMPANY_VALID = `
  query IsCompanyValid($nationalId: String!) {
    seminarsVerIsCompanyValid(nationalId: $nationalId) {
      nationalId
      mayPayWithAnAccount
    }
  }
`

export const ARE_INDIVIDUALS_VALID = `
  query AreIndividualsValid(
    $nationalIds: [String!]! 
    $courseID: Float!
  ) {
    areIndividualsValid(
      nationalIds: $nationalIds 
      courseID: $courseID
    ) {
      nationalID
      mayTakeCourse
    }
  }
`
