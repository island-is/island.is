import gql from 'graphql-tag'

export const GET_ADMINISTRATION_OF_SAFETY_AND_HEALTH_COURSES_QUERY = gql`
  query GetCourses {
    administrationOfOccupationalSafetyAndHealthCourses {
      courses {
        id
        name
        dateFrom
        dateTo
        time
        location
        price
        registrationUrl
        status
        category
        subCategory
        description
        alwaysOpen
      }
    }
  }
`
