import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { GetOrganizationByNationalIdInput } from '@island.is/api/schema'

export const GET_ORGANIZATIONS = gql`
  query FormSystemGetOrganizations {
    getOrganizations {
      items {
        id
        title
      }
    }
  }
`

export const GET_ORGANIZATION_LOGO = gql`
  query FormSystemGetOrganizationLogo(
    $input: GetOrganizationByNationalIdInput!
  ) {
    getOrganizationByNationalId(input: $input) {
      logo {
        url
      }
    }
  }
` as TypedDocumentNode<
  {
    getOrganizationByNationalId?: { logo?: { url: string } | null } | null
  },
  { input: GetOrganizationByNationalIdInput }
>
