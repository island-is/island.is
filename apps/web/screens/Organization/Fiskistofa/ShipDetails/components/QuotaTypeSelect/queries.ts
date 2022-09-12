import gql from 'graphql-tag'

export const GET_QUOTA_TYPES_FOR_TIME_PERIOD = gql`
  query GetQuotaTypesForTimePeriod($input: GetQuotaTypesForTimePeriodInput!) {
    getQuotaTypesForTimePeriod(input: $input) {
      id
      name
    }
  }
`

export const GET_QUOTA_TYPES_FOR_CALENDAR_YEAR = gql`
  query GetQuotaTypesForCalendarYear(
    $input: GetQuotaTypesForCalendarYearInput!
  ) {
    getQuotaTypesForCalendarYear(input: $input) {
      id
      name
    }
  }
`
