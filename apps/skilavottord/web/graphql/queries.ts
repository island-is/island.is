import gql from 'graphql-tag'

export const SkilavottordRecyclingPartnerQuery = gql`
  query SkilavottordRecyclingPartnerQuery($input: RecyclingPartnerInput!) {
    skilavottordRecyclingPartner(input: $input) {
      companyId
      companyName
      nationalId
      email
      address
      postnumber
      city
      website
      phone
      active
      municipalityId
    }
  }
`

export const SkilavottordRecyclingPartnerActive = gql`
  query SkilavottordRecyclingPartnerActive($input: RecyclingPartnerInput!) {
    skilavottordRecyclingPartnerActive(input: $input)
  }
`

export const SkilavottordAllRecyclingPartnersQuery = gql`
  query skilavottordAllRecyclingPartnersQuery {
    skilavottordAllRecyclingPartners {
      companyId
      companyName
      active
      municipalityId
      isMunicipality
    }
  }
`

export const SkilavottordAccessControlsQuery = gql`
  query skilavottordAccessControlsQuery {
    skilavottordAccessControls {
      nationalId
      name
      role
      email
      phone
      recyclingPartner {
        companyId
        companyName
        municipalityId
        isMunicipality
      }
    }
  }
`

export const CreateSkilavottordAccessControlMutation = gql`
  mutation createSkilavottordAccessControlMutation(
    $input: CreateAccessControlInput!
  ) {
    createSkilavottordAccessControl(input: $input) {
      nationalId
      name
      role
      email
      phone
      partnerId
      recyclingPartner {
        companyId
        companyName
        municipalityId
        isMunicipality
      }
    }
  }
`

export const UpdateSkilavottordAccessControlMutation = gql`
  mutation updateSkilavottordAccessControlMutation(
    $input: UpdateAccessControlInput!
  ) {
    updateSkilavottordAccessControl(input: $input) {
      nationalId
      name
      role
      email
      phone
      recyclingPartner {
        companyId
        companyName
      }
    }
  }
`

export const DeleteSkilavottordAccessControlMutation = gql`
  mutation deleteSkilavottordAccessControlMutation(
    $input: DeleteAccessControlInput!
  ) {
    deleteSkilavottordAccessControl(input: $input)
  }
`

export const CreateSkilavottordRecyclingPartnerMutation = gql`
  mutation createSkilavottordRecyclingPartnerMutation(
    $input: CreateRecyclingPartnerInput!
  ) {
    createSkilavottordRecyclingPartner(input: $input) {
      companyId
      companyName
      email
      nationalId
      address
      postnumber
      city
      website
      phone
      active
      isMunicipality
      municipalityId
    }
  }
`

export const UpdateSkilavottordRecyclingPartnerMutation = gql`
  mutation updateSkilavottordRecyclingPartnerMutation(
    $input: UpdateRecyclingPartnerInput!
  ) {
    updateSkilavottordRecyclingPartner(input: $input) {
      companyId
      companyName
      nationalId
      email
      address
      postnumber
      city
      website
      phone
      active
      municipalityId
    }
  }
`

export const SkilavottordRecyclingPartnersQuery = gql`
  query skilavottordRecyclingPartnersQuery(
    $isMunicipalityPage: Boolean!
    $municipalityId: String
  ) {
    skilavottordRecyclingPartners(
      isMunicipalityPage: $isMunicipalityPage
      municipalityId: $municipalityId
    ) {
      companyId
      companyName
      address
      postnumber
      email
      active
      municipalityId
      isMunicipality
    }
  }
`
export const SkilavottordVehicleReadyToDeregisteredQuery = gql`
  query skilavottordVehicleReadyToDeregisteredQuery($permno: String!) {
    skilavottordVehicleReadyToDeregistered(permno: $permno) {
      vehicleId
      vehicleType
      newregDate
      vinNumber
      mileage
      recyclingRequests {
        nameOfRequestor
      }
    }
  }
`

export const SkilavottordTrafficQuery = gql`
  query skilavottordTrafficQuery($permno: String!) {
    skilavottordTraffic(permno: $permno) {
      permno
      outInStatus
      useStatus
      useStatusName
    }
  }
`

export const SkilavottordRecyclingRequestMutation = gql`
  mutation skilavottordRecyclingRequestMutation(
    $permno: String!
    $requestType: RecyclingRequestTypes!
  ) {
    createSkilavottordRecyclingRequest(
      permno: $permno
      requestType: $requestType
    ) {
      ... on RequestErrors {
        message
        operation
      }
      ... on RequestStatus {
        status
      }
    }
  }
`

export const UpdateSkilavottordVehicleInfoMutation = gql`
  mutation updateSkilavottordVehicleInfo(
    $permno: String!
    $mileage: Float!
    $plateCount: Float!
    $plateLost: Boolean!
  ) {
    updateSkilavottordVehicleInfo(
      permno: $permno
      mileage: $mileage
      plateCount: $plateCount
      plateLost: $plateLost
    )
  }
`

export const SkilavottordVehiclesQuery = gql`
  query skilavottordVehiclesQuery($after: String!) {
    skilavottordAllDeregisteredVehicles(first: 20, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      count
      items {
        vehicleId
        vehicleType
        newregDate
        createdAt
        recyclingRequests {
          id
          recyclingPartnerId
          nameOfRequestor
          createdAt
          recyclingPartner {
            companyId
            companyName
            municipalityId
            municipality {
              companyName
            }
          }
        }
      }
    }
  }
`
