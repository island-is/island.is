import { gql } from '@apollo/client'

export const GetApplicantyQuery = gql`
  query GetApplicantyQuery($input: ApplicationInput!) {
    application(input: $input) {
      id
      nationalId
      created
      modified
      name
      phoneNumber
      email
      homeCircumstances
      student
      employment
      hasIncome
      usePersonalTaxCredit
      bankNumber
      ledger
      accountNumber
      interview
      employmentCustom
      homeCircumstancesCustom
      state
    }
  }
`
export const UpdateApplicationMutation = gql`
  mutation UpdateApplicationMutation($input: UpdateApplicationInput!) {
    updateApplication(input: $input) {
      id
      modified
      state
    }
  }
`
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

export const GetMunicipalityQuery = gql`
  query GetMunicipalityQuery($input: MunicipalityQueryInput!) {
    municipality(input: $input) {
      id
      name
      settings
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
