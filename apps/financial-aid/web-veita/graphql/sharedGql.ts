import { gql } from '@apollo/client'

const application = `
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
files {
  id
  applicationId
  name
  size
  created
  type
}
state
formComment
studentCustom
amount
rejection
staff {
  name
}
applicationEvents {
  id
  applicationId
  eventType
  comment
  created
}
`

export const GetApplicationQuery = gql`
  query GetApplicationQuery($input: ApplicationInput!) {
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
      files {
        id
        applicationId
        name
        size
        created
        type
      }
      state
      formComment
      studentCustom
      amount
      rejection
      staff {
        name
      }
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
export const UpdateApplicationMutation = gql`
  mutation UpdateApplicationMutation($input: UpdateApplicationInput!) {
    updateApplication(input: $input) {
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
      files {
        id
        applicationId
        name
        size
        created
        type
      }
      state
      formComment
      studentCustom
      amount
      rejection
      staff {
        name
      }
    }
  }
`
export const GetApplicationsQuery = gql`
  query GetApplicationsQuery($input: AllApplicationInput!) {
    applications(input: $input) {
      id
      nationalId
      name
      phoneNumber
      email
      modified
      created
      state
      staff {
        name
      }
    }
  }
`

export const GetApplicationFiltersQuery = gql`
  query GetApplicationFiltersQuery {
    applicationFilters {
      New
      InProgress
      DataNeeded
      Rejected
      Approved
    }
  }
`

export const CreateApplicationQuery = gql`
  mutation CreateApplication($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      id
    }
  }
`

export const CreateApplicationEventQuery = gql`
  mutation CreateApplicationEvent($input: CreateApplicationEventInput!) {
    createApplicationEvent(input: $input) {
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
      files {
        id
        applicationId
        name
        size
        created
        type
      }
      state
      formComment
      studentCustom
      amount
      rejection
      staff {
        name
      }
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

export const GetMunicipalityQuery = gql`
  query GetMunicipalityQuery($input: MunicipalityQueryInput!) {
    municipality(input: $input) {
      id
      name
      aid {
        ownApartmentOrLease
        withOthersOrUnknow
        withParents
      }
    }
  }
`

export const GetMunacipalityHomePageQuery = gql`
  query GetMunacipalityHomePageQuery($input: MunicipalityQueryInput!) {
    municipality(input: $input) {
      id
      homePage
    }
  }
`

export const CurrentUserQuery = gql`
  query CurrentUserQuery {
    currentUser {
      nationalId
      name
      phoneNumber
      staff {
        id
        nationalId
        name
        municipalityId
        phoneNumber
        role
        active
      }
    }
  }
`
