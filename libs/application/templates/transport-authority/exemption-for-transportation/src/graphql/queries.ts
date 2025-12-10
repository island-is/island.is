import gql from 'graphql-tag'

export const GET_EXEMPTION_VALIDATION_BY_PERMNO = gql`
  query GetVehicleExemptionValidation($permno: String!, $isTrailer: Boolean!) {
    vehicleExemptionValidation(permno: $permno, isTrailer: $isTrailer) {
      isInspected
      isInOrder
      errorMessages {
        errorNo
        defaultMessage
      }
    }
  }
`
