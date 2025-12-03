import gql from 'graphql-tag'

export const GET_ORGANIZATION_COURSES_QUERY = gql`
  query GetCourses($input: GetCoursesInput!) {
    getCourses(input: $input) {
      total
      items {
        id
        title
        categories {
          id
          title
          slug
        }
      }
      input {
        page
        categoryKeys
        lang
        organizationSlug
      }
    }
  }
`
