import gql from 'graphql-tag'
export const friggSchoolsByMunicipalityQuery = gql`
  query FriggSchoolsByMunicipality {
    friggSchoolsByMunicipality {
      id
      nationalId
      name
      type
      managing {
        id
        nationalId
        name
        type
        gradeLevels
      }
    }
  }
`
