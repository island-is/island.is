import { gql } from '@apollo/client'

export const ApplicationQuery = gql`
  query GetApplicationQuery($input: ApplicationInput!) {
    application(input: $input) {
      id
      applicationSystemId
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
      spouseFormComment
      municipalityCode
      studentCustom
      rejection
      staff {
        name
        municipalityIds
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
        emailSent
      }
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
      spouseHasFetchedDirectTaxPayment
      hasFetchedDirectTaxPayment
      directTaxPayments {
        totalSalary
        payerNationalId
        personalAllowance
        withheldAtSource
        month
        year
        userType
      }
      navSuccess
    }
  }
`

export const ApplicationSearchQuery = gql`
  query ApplicationSearchQuery($input: ApplicationSearchInput!) {
    applicationSearch(input: $input) {
      id
      nationalId
      created
      name
      state
      files {
        id
      }
    }
  }
`

export const ApplicationFilterQuery = gql`
  query ApplicationFilterQuery($input: FilterApplicationsInput!) {
    filterApplications(input: $input) {
      applications {
        id
        nationalId
        name
        state
        modified
        created
        staff {
          name
        }
      }
      totalCount
      staffList {
        name
        nationalId
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
          municipalityIds
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
      rejection
      staff {
        name
        municipalityIds
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
      spouseHasFetchedDirectTaxPayment
      hasFetchedDirectTaxPayment
      directTaxPayments {
        totalSalary
        payerNationalId
        personalAllowance
        withheldAtSource
        month
        year
        userType
      }
      navSuccess
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
        municipalityIds
        phoneNumber
        roles
        active
        nickname
        email
        usePseudoName
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
      familyStatus
      spouseNationalId
      spouseName
      spouseEmail
      spousePhoneNumber
      municipalityCode
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
      spouseFormComment
      studentCustom
      rejection
      applicationEvents {
        id
        applicationId
        eventType
        comment
        created
        staffName
        staffNationalId
        emailSent
      }
      staff {
        name
        municipalityIds
        nationalId
      }
      spouseHasFetchedDirectTaxPayment
      hasFetchedDirectTaxPayment
      directTaxPayments {
        totalSalary
        payerNationalId
        personalAllowance
        withheldAtSource
        month
        year
        userType
      }
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
      navSuccess
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
      municipalityIds
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

export const MunicipalityActivityMutation = gql`
  mutation MunicipalityActivityMutation($input: MunicipalityActivityInput!) {
    municipalityActivity(input: $input) {
      id
      active
    }
  }
`

export const MunicipalityMutation = gql`
  mutation MunicipalityMutation($input: CreateMunicipalityInput!) {
    createMunicipality(input: $input) {
      id
      municipalityId
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
      usingNav
      navUrl
      navUsername
      navPassword
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
      name
      municipalityIds
      phoneNumber
      roles
      active
      nickname
      email
      usePseudoName
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
      municipalityId
      email
      adminUsers {
        name
        nationalId
        email
        active
        id
      }
      allAdminUsers {
        name
        id
        municipalityIds
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

export const AdminUsersQuery = gql`
  query getAdminUsers($input: MunicipalityQueryInput!) {
    municipality(input: $input) {
      municipalityId
      adminUsers {
        name
        nationalId
        email
        active
        id
      }
    }
  }
`

export const AllAdminsQuery = gql`
  query allAdminsQuery {
    admins {
      id
      name
      municipalityIds
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

export const GetAllSignedUrlQuery = gql`
  query GetAllSignedUrlQuery($input: GetSignedUrlForIdInput!) {
    getSignedUrlForAllFilesId(input: $input) {
      url
      key
    }
  }
`
