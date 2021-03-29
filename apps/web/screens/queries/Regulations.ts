import gql from 'graphql-tag'

export const GET_REGULATION_ORIGINAL_QUERY = gql`
  query GetRegulationOriginal($input: GetRegulationOriginalInput!) {
    getRegulationOriginal(input: $input)
  }
`

export const GET_REGULATION_CURRENT_QUERY = gql`
  query GetRegulationCurrent($input: GetRegulationCurrentInput!) {
    getRegulationCurrent(input: $input)
  }
`

export const GET_REGULATION_BY_DATE_QUERY = gql`
  query GetRegulationByDate($input: GetRegulationByDateInput!) {
    getRegulationByDate(input: $input)
  }
`

export const GET_REGULATIONS_NEWEST_QUERY = gql`
  query GetRegulationsNewest($input: GetRegulationsNewestInput!) {
    getRegulationsNewest(input: $input)
  }
`

export const GET_REGULATIONS_YEARS_QUERY = gql`
  query GetRegulationsYears($input: GetRegulationsYearsInput!) {
    getRegulationsYears(input: $input)
  }
`

export const GET_REGULATIONS_MINISTRIES_QUERY = gql`
  query GetRegulationsMinistries($input: GetRegulationsMinistriesInput!) {
    getRegulationsMinistries(input: $input)
  }
`
