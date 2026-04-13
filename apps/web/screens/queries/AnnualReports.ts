import gql from 'graphql-tag'

import { nestedFields, slices } from './fragments'

export const GET_ANNUAL_REPORTS_QUERY = gql`
  query GetAnnualReports($input: GetAnnualReportInput!) {
    getAnnualReports(input: $input) {
      id
      title
      intro
      pageIdentifier
      organizationPage {
        id
        title
        slug
      }
      organization {
        id
        title
        shortTitle
        slug
      }
      chapters {
        id
        title
        slug
        intro
        thumbnailImage {
          url
          title
          width
          height
          description
        }
      }
    }
  }
`

export const GET_ANNUAL_REPORT_CHAPTER_QUERY = gql`
  query GetAnnualReportChapter($input: GetAnnualReportInput!) {
    getAnnualReportChapter(input: $input) {
      id
      title
      slug
      intro
      thumbnailImage {
        url
        title
        width
        height
        description
      }
      content {
        ...AllSlices
        ${nestedFields}
      }
    }
  }
  ${slices}
`
