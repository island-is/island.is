import { gql } from '@apollo/client'

export const GET_ORGANIZATION_ADMIN = gql`
  query FormSystemGetOrganizationAdmin(
    $input: FormSystemGetOrganizationAdminInput!
  ) {
    formSystemOrganizationAdmin(input: $input) {
      organizationId
      selectedCertificationTypes
      selectedListTypes
      selectedFieldTypes
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
      listTypes {
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
      fieldTypes {
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
