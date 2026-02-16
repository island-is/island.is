import gql from 'graphql-tag'

import { htmlFields, slices } from './fragments'

export const GET_ORGANIZATION_COURSES_QUERY = gql`
  query GetCourses($input: GetCoursesInput!) {
    getCourses(input: $input) {
      total
      items {
        id
        title
        cardIntro {
          ...HtmlFields
        }
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
        courseListPageId
      }
    }
  }
  ${htmlFields}
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
      activeLocales {
        is
        en
      }
      course {
        id
        title
        courseListPageId
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
          startDateTimeDuration {
            startTime
            endTime
          }
          location
          displayedTitle
          description
          chargeItemCode
        }
      }
    }
  }
  ${slices}
`

export const GET_CHARGE_ITEM_CODES_BY_COURSE_ID_QUERY = gql`
  query GetChargeItemCodesByCourseId(
    $input: GetChargeItemCodesByCourseIdInput!
  ) {
    getChargeItemCodesByCourseId(input: $input) {
      items {
        code
        name
        priceAmount
      }
    }
  }
`

export const GET_COURSE_LIST_PAGE_BY_ID_QUERY = gql`
  query GetCourseListPageById($input: GetCourseListPageByIdInput!) {
    getCourseListPageById(input: $input) {
      id
      title
      content {
        ...AllSlices
      }
    }
  }
  ${slices}
`
