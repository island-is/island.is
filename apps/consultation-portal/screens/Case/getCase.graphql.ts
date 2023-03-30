import gql from 'graphql-tag'

export const GET_CASE_BY_ID = gql`
  query consultationPortalCaseById($input: ConsultationPortalCaseInput!) {
    consultationPortalCaseById(input: $input) {
      id
      caseNumber
      name
      typeName
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
      statusName
      documents {
        id
        fileName
      }
    }
  }
`
