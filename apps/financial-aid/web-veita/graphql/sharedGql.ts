import { gql } from '@apollo/client'

export const ApplicationQuery = gql`
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
      familyStatus
      spouseNationalId
      spouseName
      spouseEmail
      spousePhoneNumber
      city
      streetName
      postalCode
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
        municipalityId
        nationalId
      }
      applicationEvents {
        id
        applicationId
        eventType
        comment
        created
        staffName
        staffNationalId
      }
    }
  }
`

export const UpdateApplicationTableMutation = gql`
  mutation UpdateApplicationTableMutation(
    $input: UpdateApplicationInputTable!
  ) {
    updateApplicationTable(input: $input) {
      applications {
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
          municipalityId
        }
      }
      filters {
        New
        InProgress
        DataNeeded
        Rejected
        Approved
        MyCases
      }
    }
  }
`

export const ApplicationsQuery = gql`
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

// Is defined as a mutation to be callable but is a query, that is doesn't mutate anything.
export const ApplicationFiltersMutation = gql`
  mutation GetApplicationFiltersQuery {
    applicationFilters {
      New
      InProgress
      DataNeeded
      Rejected
      Approved
      MyCases
    }
  }
`

export const ApplicationEventMutation = gql`
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
        municipalityId
      }
      applicationEvents {
        id
        applicationId
        eventType
        comment
        created
        staffNationalId
        staffName
      }
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
        roles
        active
        municipalityHomepage
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
      applicationEvents {
        id
        applicationId
        eventType
        comment
        created
        staffNationalId
        staffName
      }
      staff {
        name
        municipalityId
      }
    }
  }
`

export const StaffForMunicipalityQuery = gql`
  query staffForMunicipality {
    users {
      id
      nationalId
      name
      roles
      active
    }
  }
`

export const StaffQuery = gql`
  query getStaff($input: StaffInput!) {
    user(input: $input) {
      id
      nationalId
      name
      roles
      active
      nickname
      email
    }
  }
`

export const StaffMutation = gql`
  mutation StaffMutation($input: CreateStaffInput!) {
    createStaff(input: $input) {
      id
    }
  }
`

export const ActivityMunicipalityMutation = gql`
  mutation ActivityMunicipalityMutation($input: MunicipalityActivityInput!) {
    activityMunicipality(input: $input) {
      id
      active
    }
  }
`

export const MunicipalityMutation = gql`
  mutation MunicipalityMutation($input: CreateMunicipalityInput!) {
    createMunicipality(input: $input) {
      id
    }
  }
`

export const UpdateMunicipalityMutation = gql`
  mutation UpdateMunicipalityMutation($input: UpdateMunicipalityInput!) {
    updateMunicipality(input: $input) {
      id
      name
      homepage
      active
      municipalityId
      email
      rulesHomepage
      individualAid {
        ownPlace
        registeredRenting
        unregisteredRenting
        livesWithParents
        unknown
        withOthers
        type
      }
      cohabitationAid {
        ownPlace
        registeredRenting
        unregisteredRenting
        livesWithParents
        unknown
        withOthers
        type
      }
    }
  }
`
export const UpdateStaffMutation = gql`
  mutation UpdateStaffMutation($input: UpdateStaffInput!) {
    updateStaff(input: $input) {
      id
      nationalId
      roles
      nickname
      email
    }
  }
`

export const MunicipalitiesQuery = gql`
  query getMunicipalities {
    municipalities {
      id
      name
      active
      numberOfUsers
      municipalityId
    }
  }
`

export const MunicipalityQuery = gql`
  query getMunicipality($input: MunicipalityQueryInput!) {
    municipality(input: $input) {
      id
      name
      active
      rulesHomepage
      homepage
      email
      adminUsers {
        name
        nationalId
        email
        id
      }
      individualAid {
        ownPlace
        registeredRenting
        unregisteredRenting
        livesWithParents
        unknown
        withOthers
        type
      }
      cohabitationAid {
        ownPlace
        registeredRenting
        unregisteredRenting
        livesWithParents
        unknown
        withOthers
        type
      }
    }
  }
`

export const SupervisorsQuery = gql`
  query supervisorsQuery {
    supervisors {
      id
      nationalId
      name
      roles
      active
    }
  }
`
