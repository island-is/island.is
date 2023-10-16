import gql from 'graphql-tag'

export const GET_UNIVERSITY_GATEWAY_PROGRAM_LIST = gql`
  query GetUniversityGatewayActivePrograms {
    universityGatewayActivePrograms {
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
        languages
        searchKeywords
        studentAnswerDate
        startingSemesterSeason
        modeOfDelivery
        startingSemesterYear
        universityContentfulKey
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

export const GET_UNIVERSITY_GATEWAY_UNIVERSITIES = gql`
  query GetUniversityGatewayUniversities {
    universityGatewayUniversities {
      id
      nationalId
      contentfulKey
      logoUrl
      title
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
      schoolAnswerDate
      iscedCode
      searchKeywords
      studentAnswerDate
      startingSemesterSeason
      startingSemesterYear
      admissionRequirementsEn
      admissionRequirementsIs
      costInformationEn
      costInformationIs
      costPerYear
      languages
      externalUrlEn
      externalUrlIs
      modeOfDelivery
      studyRequirementsEn
      studyRequirementsIs
      universityContentfulKey
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
