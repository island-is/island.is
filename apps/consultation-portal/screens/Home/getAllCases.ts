import gql from 'graphql-tag'

export const GET_ALL_CASES = gql`
  query consultationPortalAllCases {
    consultationPortalAllCases {
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
