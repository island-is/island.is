export const GET_MY_PLATE_OWNERSHIP_CHECKS_BY_REGNO = `
  query GetMyPlateOwnershipChecksByRegno($regno: String!) {
    myPlateOwnershipChecksByRegno(regno: $regno) {
      validationErrorMessages {
        errorNo
        defaultMessage
      }
    }
  } 
`
