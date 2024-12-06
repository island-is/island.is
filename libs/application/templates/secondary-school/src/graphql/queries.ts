export const GET_PROGRAMS_BY_SCHOOL_ID = `
  query GetSecondarySchoolProgramsBySchoolId($schoolId: String!) {
    secondarySchoolProgramsBySchoolId(schoolId: $schoolId) {
      id
      nameIs
      nameEn
      registrationEndDate
    }
  } 
`
