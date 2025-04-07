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

export const friggSchoolsByMunicipalityQuery = gql`
  query FriggSchoolsByMunicipality {
    friggSchoolsByMunicipality {
      id
      unitId
      nationalId
      name
      type
      email
      phone
      website
      children {
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
