export const GET_EXEMPTION_VALIDATION_BY_PERMNO = `
  query GetVehicleExemptionValidation($permno: String!, $isTrailer: Boolean!) {
    vehicleExemptionValidation(permno: $permno, isTrailer: $isTrailer) {
      isInspected
      isInOrder
      numberOfAxles
      color
      make
      permno
      errorMessages {
        errorNo
        defaultMessage
      }
    }
  }
`
