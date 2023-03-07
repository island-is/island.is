import gql from 'graphql-tag'

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
