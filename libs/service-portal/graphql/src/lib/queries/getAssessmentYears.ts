import { gql } from '@apollo/client'

export const GET_ASSESSMENT_YEARS = gql`
  query GetAssessmentYearsQuery {
    getAssessmentYears {
      year
    }
  }
`
