import { gql } from '@apollo/client'

const coreCaseListFields = gql`
  fragment CoreCaseListFields on CaseListEntry {
    id
    type
    decision
    state
    courtCaseNumber
    accusedAppealDecision
    prosecutorAppealDecision
    accusedPostponedAppealDate
    prosecutorPostponedAppealDate
    courtEndTime
    validToDate
    policeCaseNumbers
    parentCaseId
    appealCaseNumber
    appealState
    appealRulingDecision
    defendants {
      id
      nationalId
      name
      noNationalId
    }
  }
`

export const CasesQuery = gql`
  ${coreCaseListFields}
  query CaseList {
    cases {
      created
      courtDate
      isValidToDateInThePast
      initialRulingDate
      rulingDate
      rulingSignatureDate
      judge {
        id
      }
      prosecutor {
        id
      }
      registrar {
        id
      }
      creatingProsecutor {
        id
      }
      ...CoreCaseListFields
    }
  }
`

export const AppealedCasesQuery = gql`
  ${coreCaseListFields}
  query AppealedCases($input: CaseListQueryInput) {
    cases(input: $input) {
      appealedDate
      initialRulingDate
      rulingDate
      ...CoreCaseListFields
    }
  }
`
