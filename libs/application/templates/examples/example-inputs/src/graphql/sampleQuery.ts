import gql from 'graphql-tag'
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
