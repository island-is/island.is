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
      contentfulTitleEn
      contentfulLink
      contentfulLinkEn
    }
  }
`
