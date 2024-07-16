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
      nationalId
      name
      type
      children {
        id
        nationalId
        name
        type
        gradeLevels
      }
    }
  }
`
