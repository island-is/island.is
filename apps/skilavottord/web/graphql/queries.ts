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
