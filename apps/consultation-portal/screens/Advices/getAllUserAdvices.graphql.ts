import gql from 'graphql-tag'

export const GET_ALL_USER_ADVICES = gql`
  query consultationPortalAllUserAdvices {
    consultationPortalAllUserAdvices {
      id
      caseId
      participantName
      participantEmail
      content
      created
      adviceDocuments {
        id
        fileName
        fileType
        size
      }
    }
  }
`
