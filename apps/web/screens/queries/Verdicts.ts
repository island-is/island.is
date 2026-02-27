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
        verdictJudges {
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
        resolutionLink
      }
    }
  }
`

export const GET_VERDICT_CASE_FILTER_OPTIONS_PER_COURT_QUERY = gql`
  query GetVerdictCaseFilterOptionsPerCourt {
    webVerdictCaseFilterOptionsPerCourt {
      courtOfAppeal {
        options {
          label
          typeOfOption
        }
      }
      supremeCourt {
        options {
          label
          typeOfOption
        }
      }
      districtCourt {
        options {
          label
          typeOfOption
        }
      }
      all {
        options {
          label
          typeOfOption
        }
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
