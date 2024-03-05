export const GET_UNIVERSITY_APPLICATION_BY_ID = `
  query getUniversityApplicationById($id: String!) {
    universityApplication(id: $id) {
      id
      nationalId
    }
  } 
`

export const GET_UNIVERSITY_GATEWAY_UNIVERSITIES = `
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

export const GET_UNIVERSITY_GATEWAY_PROGRAM = `
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
      arrangementIs
      arrangementEn
      universityContentfulKey
      universityId
    }
  }
`
