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
  query FriggOrganizationsByType {
    friggOrganizationsByType {
      id
      unitId
      nationalId
      name
      type
      email
      phone
      website
      managing {
        id
        unitId
        nationalId
        name
        type
        gradeLevels
        email
        phone
        website
        address {
          municipality
        }
      }
    }
  }
`
