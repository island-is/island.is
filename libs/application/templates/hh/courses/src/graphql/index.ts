import gql from 'graphql-tag'

export const GET_COURSE_SELECT_OPTIONS_QUERY = gql`
  query GetCourseSelectOptions($input: GetCourseSelectOptionsInput!) {
    getCourseSelectOptions(input: $input) {
      items {
        id
        title
      }
    }
  }
`

export const GET_COURSE_BY_ID_QUERY = gql`
  query GetCourseById($input: GetCourseByIdInput!) {
    getCourseById(input: $input) {
      course {
        instances {
          id
          startDate
          startDateTimeDuration {
            startTime
            endTime
          }
          location
          displayedTitle
          price {
            amount
          }
          description
        }
      }
    }
  }
`
