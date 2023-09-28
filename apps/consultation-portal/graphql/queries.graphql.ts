import gql from 'graphql-tag'

// screens/Subscriptions
export const SUB_GET_CASES = gql`
  query SUB_GET_CASES($input: ConsultationPortalCasesInput!) {
    consultationPortalGetCases(input: $input) {
      total
      cases {
        id
        caseNumber
        name
        institutionName
        policyAreaName
      }
    }
  }
`

export const SUB_GET_TYPES = gql`
  query SUB_GET_TYPES {
    consultationPortalAllTypes {
      policyAreas
      institutions
    }
  }
`
export const SUB_GET_EMAIL = gql`
  query SUB_GET_EMAIL {
    consultationPortalUserEmail {
      email
      emailVerified
    }
  }
`

export const SUB_POST_SUBS = gql`
  mutation SUB_POST_SUBS(
    $input: ConsultationPortalUserSubscriptionsCommandInput!
  ) {
    consultationPortalPostSubscriptions(input: $input)
  }
`

// screens/UserSubscriptions
export const SUB_GET_USERSUBS = gql`
  query SUB_GET_USERSUBS {
    consultationPortalUserSubscriptions {
      subscribedToAll
      subscribedToAllType
      cases {
        id
        subscriptionType
      }
      institutions {
        id
        subscriptionType
      }
      policyAreas {
        id
        subscriptionType
      }
    }
  }
`

export const SUB_POST_EMAIL = gql`
  mutation SUB_POST_EMAIL($input: ConsultationPortalPostEmailCommandInput!) {
    consultationPortalPostUserEmail(input: $input)
  }
`
// screens/Home
export const HOME_GET_STATISTICS = gql`
  query HOME_GET_STATISTICS {
    consultationPortalStatistics {
      totalCases
      totalAdvices
      casesInReview
    }
  }
`

export const HOME_GET_CASES = gql`
  query HOME_GET_CASES($input: ConsultationPortalCasesInput!) {
    consultationPortalGetCases(input: $input) {
      total
      filterGroups
      cases {
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
  }
`

export const HOME_GET_TYPES = gql`
  query HOME_GET_TYPES {
    consultationPortalAllTypes {
      policyAreas
      institutions
      caseStatuses
      caseTypes
    }
  }
`

// Screens/Case
export const CASE_GET_CASE_BY_ID = gql`
  query CASE_GET_CASE_BY_ID($input: ConsultationPortalCaseInput!) {
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
      summaryLink
      summaryDocumentId
      adviceCount
      advicePublishTypeId
      advicePublishTypeName
      allowUsersToSendPrivateAdvices
      created
      changed
      oldInstitutionName
      extraStakeholderList
      statusName
      stakeholders {
        name
        email
      }
      documents {
        id
        description
        link
        fileName
        fileType
        size
      }
      additionalDocuments {
        id
        description
        link
        fileName
        fileType
        size
      }
      relatedCases {
        id
        caseNumber
        name
      }
    }
  }
`

export const CASE_GET_ADVICES_BY_ID = gql`
  query CASE_GET_ADVICES_BY_ID($input: ConsultationPortalCaseInput!) {
    consultationPortalAdviceByCaseId(input: $input) {
      id
      number
      participantName
      participantEmail
      content
      created
      isPrivate
      isHidden
      adviceDocuments {
        id
        fileName
      }
    }
  }
`

export const CASE_POST_ADVICE = gql`
  mutation CASE_POST_ADVICE($input: ConsultationPortalPostAdviceInput!) {
    consultationPortalPostAdvice(input: $input)
  }
`

export const CASE_GET_CASE_SUBSCRIPTION = gql`
  query CASE_GET_CASE_SUBSCRIPTION($input: ConsultationPortalCaseInput!) {
    consultationPortalSubscriptionType(input: $input) {
      type
    }
  }
`

export const CASE_POST_CASE_SUBSCRIPTION = gql`
  mutation CASE_POST_CASE_SUBSCRIPTION(
    $input: ConsultationPortalPostCaseSubscriptionTypeInput!
  ) {
    consultationPortalPostSubscriptionType(input: $input)
  }
`

export const CASE_DELETE_CASE_SUBSCRIPTION = gql`
  mutation CASE_DELETE_CASE_SUBSCRIPTION($input: ConsultationPortalCaseInput!) {
    consultationPortalDeleteSubscriptionType(input: $input)
  }
`

// Screens/Advices
export const ADVICES_GET_ALL_USER_ADVICES = gql`
  query ADVICES_GET_ALL_USER_ADVICES(
    $input: ConsultationPortalUserAdvicesInput!
  ) {
    consultationPortalAllUserAdvices(input: $input) {
      total
      advices {
        id
        caseId
        participantName
        participantEmail
        content
        created
        _case {
          caseNumber
          name
          statusName
          institutionName
          typeName
          policyAreaName
          processBegins
          processEnds
        }
        adviceDocuments {
          id
          fileName
        }
      }
    }
  }
`

// OTHER
export const CREATE_UPLOAD_URL = gql`
  mutation CreateUploadUrl($filename: String!) {
    createUploadUrl(filename: $filename) {
      url
      fields
    }
  }
`
