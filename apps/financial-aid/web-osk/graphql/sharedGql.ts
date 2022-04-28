import { gql } from '@apollo/client'

export const CreateApplicationMutation = gql`
  mutation createApplication($input: CreateApplicationInput!) {
    createApplication(input: $input) {
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
      spouse {
        hasPartnerApplied
        hasFiles
        applicantName
        applicantSpouseEmail
      }
      currentApplicationId
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
      amount {
        aidAmount
        income
        personalTaxCredit
        spousePersonalTaxCredit
        tax
        finalAmount
        deductionFactors {
          description
          amount
        }
      }
      rejection
      created
      modified
      municipalityCode
      spouseNationalId
      familyStatus
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
      homeCircumstances
      usePersonalTaxCredit
      state
      amount {
        aidAmount
        income
        personalTaxCredit
        spousePersonalTaxCredit
        tax
        finalAmount
        deductionFactors {
          description
          amount
        }
      }
      rejection
      created
      modified
      municipalityCode
      spouseNationalId
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

export const NationalRegistryUserQuery = gql`
  query getNationalRegistryUserQuery {
    municipalityNationalRegistryUserV2 {
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

export const GatherTaxDataQuery = gql`
  query gatherTaxDataQuery($input: MunicipalitiesPersonalTaxReturnIdInput!) {
    municipalitiesPersonalTaxReturn(input: $input) {
      personalTaxReturn {
        key
        name
        size
      }
    }
    municipalitiesDirectTaxPayments {
      success
      directTaxPayments {
        totalSalary
        payerNationalId
        personalAllowance
        withheldAtSource
        month
        year
      }
    }
  }
`
