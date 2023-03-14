import gql from 'graphql-tag'

export const GET_CASE_BY_ID = gql`
  query consultationPortalCaseById($input: ConsultationPortalCaseInput!) {
    consultationPortalCaseById(input: $input) {
      id
      caseNumber
      name
      shortDescription
      detailedDescription
      contactName
      contactEmail
      institutionName
      policyAreaName
      processBegins
      processEnds
      announcementText
      summaryDate
      summaryText
      adviceCount
      created
      changed
      oldInstitutionName
    }
  }
`
export const GET_ADVICES = gql`
  query consultationPortalAdviceByCaseId($input: ConsultationPortalCaseInput!) {
    consultationPortalAdviceByCaseId(input: $input) {
      id
      number
      participantName
      participantEmail
      content
      created
      adviceDocuments {
        id
      }
    }
  }
`

export const POST_CASE_ADVICE = gql`
  mutation postConsultationPortalAdvice(
    $input: ConsultationPortalCaseAdviceInput!
  ) {
    postConsultationPortalAdvice(input: $input)
  }
`
