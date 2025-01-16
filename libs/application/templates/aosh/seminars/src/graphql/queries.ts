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
  query AreIndividualsValid($nationalIds: [String!]!, $courseID: String!) {
    areIndividualsValid(nationalIds: $nationalIds, courseID: $courseID) {
      nationalID
      mayTakeCourse
    }
  }
`
