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

export const GET_INNA_PERIONDS = `
query GetInnaPeriods {
  innaPeriods {
    items {
      courses {
        courseId
        courseName
        finalgrade
        units
        stage
        status
        date
      }
      division
      divisionShort
      organisation
      organisationShort
      periodFrom
      periodName
      periodShort
      periodTo
      studentId
      periodId
      diplomaId
    }
  }
}

`
