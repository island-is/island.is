import gql from 'graphql-tag'

export const GET_SECONDARY_SCHOOL_ALL_PROGRAMMES_QUERY = gql`
  query SecondarySchoolAllProgrammes {
    secondarySchoolAllProgrammes {
      programmeId
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
      school {
        id
        name
        abbreviation
        countryArea {
          id
          name
          description
        }
      }
      otherSchools {
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

export const GET_SECONDARY_SCHOOL_PROGRAMME_BY_ID_QUERY = gql`
  query SecondarySchoolProgrammeById($id: String!) {
    secondarySchoolProgrammeById(id: $id) {
      id
      ministrySerial
      version
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
      structureDescription
      allowsFreeChoice
      freeChoiceDescription
      academicProgress
      academicProgressDefinedInCurriculum
      academicEvaluation
      academicEvaluationDefinedInCurriculum
      competencyCriteria
      admissionRequirements {
        minimumAge
        elementarySubjects {
          subject
          grade
        }
        priorEducation
        definedInCurriculum
        freeText
      }
      programmeStructure {
        coreSubjectGroups {
          title
          subjects {
            id
            name
            level1
            level2
            level3
            level4
            credits
          }
        }
        packageChoices {
          requiredPackages
          packages {
            title
            subjects {
              id
              name
              level1
              level2
              level3
              level4
              credits
            }
          }
        }
        subjectChoiceGroups {
          requiredCredits
          subjects {
            id
            name
            level1
            level2
            level3
            level4
            credits
          }
        }
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
    }
  }
`
