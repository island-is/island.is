import gql from 'graphql-tag'

export const friggOptionsQuery = gql`
  query FriggOptions($type: EducationFriggOptionsListInput!) {
    friggOptions(input: $type) {
      type
      options {
        id
        key
        value {
          content
          language
        }
      }
    }
  }
`

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
