import gql from 'graphql-tag'

export const GET_SECONDARY_SCHOOL_ALL_PROGRAMMES_QUERY = gql`
  query SecondarySchoolAllProgrammes {
    secondarySchoolAllProgrammes {
      id
      ministrySerial
      title
      studyTrack {
        isced
        name
      }
      qualification {
        id
        uniqueIdentifier
        title
        description
        level {
          id
          name
          description
          shortDescription
        }
      }
      specialization {
        id
        title
        description
        tags {
          value
        }
      }
      credits
      description
      schools {
        id
        name
        abbreviation
        countryArea {
          id
          name
          description
        }
      }
    }
  }
`

export const GET_SECONDARY_SCHOOL_PROGRAMME_FILTER_OPTIONS_QUERY = gql`
  query SecondarySchoolProgrammeFilterOptions {
    secondarySchoolProgrammeFilterOptions {
      studyTracks {
        isced
        name
      }
      levels {
        id
        name
        description
        shortDescription
      }
      schools {
        id
        name
        abbreviation
        countryArea {
          id
          name
          description
        }
      }
      countryAreas {
        id
        name
        description
      }
    }
  }
`
