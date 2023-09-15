import gql from 'graphql-tag'

export const GET_UNIVERSITY_GATEWAY_PROGRAM_LIST = gql`
  query GetUniversityGatewayPrograms($input: GetProgramsInput!) {
    universityGatewayPrograms(input: $input) {
      data {
        active
        nameIs
        nameEn
        costPerYear
        descriptionIs
        descriptionEn
        departmentNameIs
        departmentNameEn
        degreeType
        universityId
        applicationStartDate
        applicationEndDate
        credits
        degreeAbbreviation
        durationInYears
        externalId
        id
        iscedCode
        searchKeywords
        startingSemesterSeason
        modeOfDelivery
        startingSemesterYear
        tag {
          code
          id
          nameEn
          nameIs
        }
      }
    }
  }
`

export const GET_UNIVERSITY_GATEWAY_PROGRAM = gql`
  query GetUniversityGatewayById($input: GetProgramByIdInput!) {
    universityGatewayProgramById(input: $input) {
      active
      nameIs
      nameEn
      descriptionIs
      descriptionEn
      departmentNameIs
      departmentNameEn
      degreeType
      universityId
      applicationStartDate
      applicationEndDate
      credits
      degreeAbbreviation
      durationInYears
      externalId
      id
      iscedCode
      searchKeywords
      startingSemesterSeason
      startingSemesterYear
      admissionRequirementsEn
      admissionRequirementsIs
      costInformationEn
      costInformationIs
      costPerYear
      externalUrlEn
      externalUrlIs
      modeOfDelivery
      studyRequirementsEn
      studyRequirementsIs
      courses {
        credits
        descriptionEn
        descriptionIs
        externalId
        externalUrlEn
        externalUrlIs
        id
        nameEn
        nameIs
        requirement
        semesterSeason
        semesterYear
      }
      tag {
        code
        id
        nameEn
        nameIs
      }
    }
  }
`
