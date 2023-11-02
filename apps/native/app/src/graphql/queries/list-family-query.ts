import {gql} from '@apollo/client';

export const FAMILY_QUERY = gql`
  query NationalRegistryChildrenQuery {
    nationalRegistryUser {
      nationalId
      fullName
      spouse {
        name
        nationalId
      }
    }
    nationalRegistryChildren {
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
`;
