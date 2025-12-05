import gql from 'graphql-tag'

export const friggOrganizationsByTypeQuery = gql`
  query FriggOrganizationsByType($input: EducationFriggOrganizationInput) {
    friggOrganizationsByType(input: $input) {
      id
      unitId
      name
      type
      subType
      sector
      gradeLevels
    }
  }
`
