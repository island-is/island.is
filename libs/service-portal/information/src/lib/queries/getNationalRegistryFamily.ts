import { gql } from '@apollo/client'

export const NATIONAL_REGISTRY_FAMILY = gql`
  query NationalRegistryFamilyQuery {
    nationalRegistryFamily {
      fullName
      gender
      nationalId
    }
  }
`

export const NATIONAL_REGISTRY_FAMILY_DETAIL = gql`
  query NationalRegistryFamilyDetailQuery($input: GetFamilyInfoInput!) {
    nationalRegistryFamilyDetail(input: $input) {
      nationalId
      fullName
      displayName
      genderDisplay
      birthplace
      custody1
      custodyText1
      nameCustody1
      custody2
      custodyText2
      nameCustody2
      parent1
      nameParent1
      parent2
      nameParent2
      homeAddress
      religion
      nationality
      religion
      homeAddress
      nationality
      legalResidence
    }
  }
`
