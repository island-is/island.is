import { gql } from '@apollo/client'

export const GetApplicationQuery = gql`
  query GetApplicantyQuery($input: ApplicationInput!) {
    application(input: $input) {
      homeCircumstances
      usePersonalTaxCredit
    }
  }
`

export const CreateApplicationQuery = gql`
  mutation createApplication($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      id
    }
  }
`

export const CreateApplicationEventQuery = gql`
  mutation createApplicationEvent($input: CreateApplicationEventInput!) {
    createApplicationEvent(input: $input) {
      id
    }
  }
`

export const GetMunicipalityQuery = gql`
  query GetMunicipalityQuery($input: MunicipalityQueryInput!) {
    municipality(input: $input) {
      id
      name
      settings
    }
  }
`

export const GetApplicationEventQuery = gql`
  query GetApplicationEventQuery($input: ApplicationEventInput!) {
    applicationEvents(input: $input) {
      id
      applicationId
      comment
      state
      created
    }
  }
`

export const CreateSignedUrlMutation = gql`
  mutation getSignedUrl($input: GetSignedUrlInput!) {
    getSignedUrl(input: $input) {
      url
      key
    }
  }
`

// export const CurrentUserQuery = gql`
//   query CurrentUserQuery {
//     currentUser {
//       nationalId
//       name
//       phoneNumber
//     }
//   }
// `
export const CurrentUserQuery = gql`
  query CurrentUserQuery {
    currentUser {
      nationalId
      name
      phoneNumber
      activeApplication {
        id
        state
        homeCircumstances
        usePersonalTaxCredit
      }
    }
  }
`
