export const GET_PROGRAMS_BY_SCHOOL_ID = `
  query GetSecondarySchoolProgramsBySchoolId($schoolId: String!, $isFreshman: Boolean!) {
    secondarySchoolProgramsBySchoolId(schoolId: $schoolId, isFreshman: $isFreshman) {
      id
      nameIs
      nameEn
      registrationEndDate
    }
  } 
`
