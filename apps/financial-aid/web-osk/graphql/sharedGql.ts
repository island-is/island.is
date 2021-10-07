import { gql } from '@apollo/client'

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

export const CreateApplicationFiles = gql`
  mutation createApplicationFiles($input: CreateApplicationFilesInput!) {
    createApplicationFiles(input: $input) {
      success
    }
  }
`

export const GetMunicipalityQuery = gql`
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

export const GetApplicationQuery = gql`
  query GetApplicationQuery($input: ApplicationInput!) {
    application(input: $input) {
      id
      homeCircumstances
      usePersonalTaxCredit
      state
      amount
      rejection
      created
    }
  }
`

export const UpdateApplicationMutation = gql`
  mutation UpdateApplicationMutation($input: UpdateApplicationInput!) {
    updateApplication(input: $input) {
      id
    }
  }
`

export const getNationalRegistryUserQuery = gql`
  query getNationalRegistryUserQuery {
    nationalRegistryUserV2 {
      nationalId
      fullName
      address {
        streetName
        postalCode
        city
        municipalityCode
      }
      spouse {
        nationalId
        maritalStatus
        name
      }
    }
  }
`
