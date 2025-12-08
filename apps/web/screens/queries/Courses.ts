import gql from 'graphql-tag'

import { slices } from './fragments'

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

export const GET_COURSE_CATEGORIES_QUERY = gql`
  query GetCourseCategories($input: GetCourseCategoriesInput!) {
    getCourseCategories(input: $input) {
      items {
        key
        label
      }
    }
  }
`

export const GET_COURSE_BY_ID_QUERY = gql`
  query GetCourseById($input: GetCourseByIdInput!) {
    getCourseById(input: $input) {
      id
      title
      organizationId
      description {
        ...AllSlices
      }
      categories {
        id
        title
        slug
      }
      instances {
        id
        startDate
        price {
          amount
        }
        description
      }
    }
  }
  ${slices}
`
