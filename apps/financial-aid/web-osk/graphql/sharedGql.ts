import { gql } from '@apollo/client'

export const CreateApplicationMutation = gql`
  mutation createApplication($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      id
    }
  }
`

export const ApplicationEventMutation = gql`
  mutation createApplicationEvent($input: CreateApplicationEventInput!) {
    createApplicationEvent(input: $input) {
      id
    }
  }
`

export const ApplicationFilesMutation = gql`
  mutation createApplicationFiles($input: CreateApplicationFilesInput!) {
    createApplicationFiles(input: $input) {
      success
    }
  }
`

export const MunicipalityQuery = gql`
  query GetMunicipalityQuery($input: MunicipalityQueryInput!) {
    municipality(input: $input) {
      id
      name
      homePage
      aid {
        ownApartmentOrLease
        withOthersOrUnknow
        withParents
      }
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

export const CurrentUserQuery = gql`
  query CurrentUserQuery {
    currentUser {
      nationalId
      name
      phoneNumber
      postalCode
      currentApplication {
        id
        state
        homeCircumstances
        usePersonalTaxCredit
      }
    }
  }
`

export const ApplicationQuery = gql`
  query GetApplicationQuery($input: ApplicationInput!) {
    application(input: $input) {
      id
      homeCircumstances
      usePersonalTaxCredit
      state
      amount
      rejection
      created
      applicationEvents {
        id
        applicationId
        eventType
        comment
        created
      }
    }
  }
`

export const ApplicationMutation = gql`
  mutation UpdateApplicationMutation($input: UpdateApplicationInput!) {
    updateApplication(input: $input) {
      id
    }
  }
`
