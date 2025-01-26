export const PROGRAMS_BY_SCHOOLS_ID_QUERY = `
  query GetSecondarySchoolProgramsBySchoolId($schoolId: String!, $isFreshman: Boolean!) {
    secondarySchoolProgramsBySchoolId(schoolId: $schoolId, isFreshman: $isFreshman) {
      id
      nameIs
      nameEn
      registrationEndDate
      isSpecialNeedsProgram
    }
  } 
`
