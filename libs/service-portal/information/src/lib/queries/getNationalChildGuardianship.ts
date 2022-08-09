import { gql } from '@apollo/client'

export const NATIONAL_REGISTRY_CHILD_GUARDIANSHIP = gql`
  query NationalRegistryChildrenGuardianshipQuery(
    $input: GetChildGuardianshipInput!
  ) {
    nationalRegistryUserV2ChildGuardianship(input: $input) {
      nationalId
      legalDomicileParent
      residenceParent
    }
  }
`
