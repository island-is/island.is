import gql from 'graphql-tag'

export const GET_ALL_USER_ADVICES = gql`
  query consultationPortalAllUserAdvices(
    $input: ConsultationPortalUserAdvicesInput!
  ) {
    consultationPortalAllUserAdvices(input: $input) {
      total
      cases {
        id
        caseId
        participantName
        participantEmail
        content
        created
        _case {
          caseNumber
          name
          institutionName
          typeName
          policyAreaName
          processBegins
          processEnds
        }
        adviceDocuments {
          id
          fileName
          fileType
          size
        }
      }
    }
  }
`
