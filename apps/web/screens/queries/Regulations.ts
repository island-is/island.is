import gql from 'graphql-tag'

export const GET_REGULATION_QUERY = gql`
  query GetRegulation($input: GetRegulationInput!) {
    getRegulation(input: $input) {
      type
      name
      title
      text
      signatureDate
      publishedDate
      effectiveDate
      lastAmendDate
      repealedDate
      appendixes {
        title
        text
      }
      ministry {
        name
        slug
      }
      lawChapters {
        name
        slug
      }
      history {
        date
        name
        title
        effect
      }
      effects {
        date
        name
        title
        effect
      }
      timelineDate
    }
  }
`

export const GET_REGULATIONS_QUERY = gql`
  query GetRegulations($input: GetRegulationsInput!) {
    getRegulations(input: $input) {
      page
      perPage
      totalPages
      data {
        name
        title
        ministry {
          name
          slug
        }
        publishedDate
      }
    }
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

export const GET_REGULATIONS_LAWCHAPTERS_QUERY = gql`
  query GetRegulationsLawChapters($input: GetRegulationsLawChaptersInput!) {
    getRegulationsLawChapters(input: $input)
  }
`
