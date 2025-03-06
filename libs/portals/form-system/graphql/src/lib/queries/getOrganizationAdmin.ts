import { gql } from '@apollo/client'

export const GET_ORGANIZATION_ADMIN = gql`
  query FormSystemGetOrganizationAdmin(
    $input: FormSystemGetOrganizationAdminInput!
  ) {
    formSystemGetOrganizationAdmin(input: $input) {
      selectedCertificationTypes
      certificationTypes {
        id
        name {
          is
          en
        }
        description {
          is
          en
        }
        isCommon
      }
      organizations {
        label
        value
        isSelected
      }
    }
  }
`
