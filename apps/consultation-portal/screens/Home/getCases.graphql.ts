import gql from 'graphql-tag'

export const GET_CASES = gql`
  query consultationPortalGetCases($input: ConsultationPortalCasesInput!) {
    consultationPortalGetCases(input: $input) {
      id
      caseNumber
      name
      adviceCount
      shortDescription
      statusName
      institutionName
      typeName
      policyAreaName
      processBegins
      processEnds
      created
    }
  }
`
