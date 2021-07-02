import { gql } from '@apollo/client'

export const GetApplicationQuery = gql`
  query GetApplicationQuery {
    applications {
      id
      nationalId
      name
      phoneNumber
      email
      modified
      created
      state
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
  query GetApplicationEventQuery {
    applicationEvents {
      id
      created
      applicationId
      state
      comment
    }
  }
`

export const GetCurrentUserQuery = gql`
  query currentUserQuery {
    currentUser {
      name
    }
  }
`

// export const GetApplicationQuery = gql`
//   query GetApplicationQuery {
//     applications {
//       id
//       nationalId
//       name
//       phoneNumber
//       email
//     }
//   }
// `
