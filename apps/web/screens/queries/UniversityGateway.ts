import gql from 'graphql-tag'

export const GET_UNIVERSITY_GATEWAY_PROGRAM_LIST = gql`
  query GetUniversityGatewayPrograms {
    universityGatewayPrograms {
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
        schoolAnswerDate
        id
        iscedCode
        studentAnswerDate
        startingSemesterSeason
        modeOfDelivery
        startingSemesterYear
        universityContentfulKey
      }
    }
  }
`

export const GET_UNIVERSITY_GATEWAY_UNIVERSITIES = gql`
  query GetUniversityGatewayUniversities {
    universityGatewayUniversities {
      id
      nationalId
      contentfulKey
      contentfulLogoUrl
      contentfulTitle
      contentfulLink
    }
  }
`

export const GET_UNIVERSITY_GATEWAY_FILTERS = gql`
  query GetUniversityGatewayProgramFilters {
    universityGatewayProgramFilters {
      field
      options
    }
  }
`

export const GET_UNIVERSITY_GATEWAY_PROGRAM = gql`
  query GetUniversityGateway($input: UniversityGatewayGetPogramInput!) {
    universityGatewayProgram(input: $input) {
      active
      admissionRequirementsEn
      admissionRequirementsIs
      allowException
      allowThirdLevelQualification
      applicationEndDate
      applicationStartDate
      costInformationEn
      costInformationIs
      costPerYear
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
        semesterYearNumber
      }
      credits
      degreeAbbreviation
      degreeType
      departmentNameEn
      departmentNameIs
      descriptionEn
      descriptionIs
      durationInYears
      externalId
      externalUrlEn
      externalUrlIs
      extraApplicationFields {
        descriptionEn
        descriptionIs
        externalId
        fieldType
        nameEn
        nameIs
        options
        required
        uploadAcceptedFileType
      }
      id
      iscedCode
      modeOfDelivery
      nameEn
      nameIs
      schoolAnswerDate
      specializationExternalId
      specializationNameEn
      specializationNameIs
      startingSemesterSeason
      startingSemesterYear
      studentAnswerDate
      studyRequirementsEn
      studyRequirementsIs
      universityContentfulKey
      universityId
    }
  }
`
