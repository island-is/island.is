export const GET_UNIVERSITY_APPLICATION_BY_ID = `
  query getUniversityApplicationById($id: String!) {
    universityApplication(id: $id) {
      id
      nationalId
    }
  } 
`
