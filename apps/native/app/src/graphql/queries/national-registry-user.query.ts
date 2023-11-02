import {gql} from '@apollo/client';

export const NATION_REGISTRY_USER_QUERY = gql`
  query nationalRegistryUser {
    nationalRegistryUser {
      nationalId
      fullName
      gender
      legalResidence
      birthday
      birthPlace
      religion
      maritalStatus
      age
      address {
        code
      }
      citizenship {
        name
      }
      spouse {
        cohabitant
        name
        nationalId
      }
    }
  }
`;
