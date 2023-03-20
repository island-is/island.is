import gql from 'graphql-tag'

export const GET_REGULATION_QUERY = gql`
  query GetRegulation($input: GetRegulationInput!) {
    getRegulation(input: $input)
  }
`

export const GET_REGULATIONS_QUERY = gql`
  query GetRegulations($input: GetRegulationsInput!) {
    getRegulations(input: $input)
  }
`

export const GET_REGULATIONS_SEARCH_QUERY = gql`
  query GetRegulationsSearch($input: GetRegulationsSearchInput!) {
    getRegulationsSearch(input: $input)
  }
`

export const GET_REGULATIONS_YEARS_QUERY = gql`
  query GetRegulationsYears {
    getRegulationsYears
  }
`

export const GET_REGULATIONS_MINISTRIES_QUERY = gql`
  query GetRegulationsMinistries($input: GetRegulationsMinistriesInput!) {
    getRegulationsMinistries(input: $input)
  }
`

export const GET_REGULATIONS_LAWCHAPTERS_QUERY = gql`
  query GetRegulationsLawChapters($input: GetRegulationsLawChaptersInput!) {
    getRegulationsLawChapters(input: $input)
  }
`
