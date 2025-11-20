import gql from 'graphql-tag'

export const GET_VERDICTS_QUERY = gql`
  query GetVerdicts($input: WebVerdictsInput!) {
    webVerdicts(input: $input) {
      total
      items {
        id
        title
        court
        caseNumber
        verdictDate
        keywords
        presentings
        presidentJudge {
          name
          title
        }
      }
      input {
        searchTerm
        page
        courtLevel
        keywords
        caseNumber
        caseCategories
        caseTypes
        laws
        dateFrom
        dateTo
        caseContact
      }
    }
  }
`

export const GET_VERDICT_BY_ID_QUERY = gql`
  query GetVerdictById($input: WebVerdictByIdInput!) {
    webVerdictById(input: $input) {
      item {
        pdfString
        richText
        title
        court
        caseNumber
        verdictDate
        keywords
        presentings
      }
    }
  }
`

export const GET_VERDICT_CASE_TYPES_QUERY = gql`
  query GetVerdictCaseTypes {
    webVerdictCaseTypes {
      caseTypes {
        label
      }
    }
  }
`

export const GET_VERDICT_CASE_CATEGORIES_QUERY = gql`
  query GetVerdictCaseCategories {
    webVerdictCaseCategories {
      caseCategories {
        label
      }
    }
  }
`

export const GET_VERDICT_KEYWORDS_QUERY = gql`
  query GetVerdictKeywords {
    webVerdictKeywords {
      keywords {
        label
      }
    }
  }
`
