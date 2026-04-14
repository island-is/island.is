import gql from 'graphql-tag'

import { nestedFields, slices } from './fragments'

export const GET_ANNUAL_REPORTS_QUERY = gql`
  query GetAnnualReports($input: GetAnnualReportsInput!) {
    getAnnualReports(input: $input) {
      id
      title
      slug
      pageIdentifier
      intro
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

export const GET_ANNUAL_REPORT_QUERY = gql`
  query GetAnnualReport($input: GetAnnualReportInput!) {
    getAnnualReport(input: $input) {
      id
      title
      slug
      pageIdentifier
      intro
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
        content {
          ...AllSlices
          ${nestedFields}
        }
      }
    }
  }
  ${slices}
`
