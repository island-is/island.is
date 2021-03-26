import gql from 'graphql-tag'

export const GET_REGULATION_ORIGINAL_QUERY = gql`
  query GetRegulationOriginal($input: GetRegulationOriginalInput!) {
    getRegulationOriginal(input: $input)
  }
`

export const GET_REGULATIONS_NEWEST_QUERY = gql`
  query GetRegulationsNewest($input: GetRegulationsNewestInput!) {
    getRegulationsNewest(input: $input)
  }
`
