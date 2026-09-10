export const GET_VEHICLE_PLATE_ORDER_CHECKS_BY_PERMNO = `
  query GetMyVehiclePlateOrderChecksByPermno($permno: String!) {
    myVehiclePlateOrderChecksByPermno(permno: $permno) {
      validationErrorMessages {
        errorNo
        defaultMessage
      }
      basicVehicleInformation {
        permno
        make
        color
        role
        regGroup
      }
    }
  } 
`

export const GET_VEHICLE_INFORMATION = `
  query GetVehiclesDetail($input: GetVehicleDetailInput!) {
    vehiclesDetail(input: $input) {
      registrationInfo {
        plateTypeFront
        plateTypeRear
      }
    }
  }
`

export const VALIDATE_VEHICLE_PLATE_ORDER = `
  query GetVehiclePlateOrderValidation($answers: PlateOrderAnswers!) {
    vehiclePlateOrderValidation(answers: $answers) {
      hasError
      errorMessages {
        errorNo
        defaultMessage
      }
    }
  } 
`

export const GET_VEHICLE_PLATE_ORDER_OPTIONS = `
  query GetVehiclePlateOrderOptions($permno: String!) {
    vehiclePlateOrderOptions(permno: $permno) {
      plates {
        plateTypeCode
        plateTypeName
        plateSizes {
          plateSizeType
          plateHeight
          plateWidth
        }
      }
    }
  }
`

export const GET_VEHICLE_CURRENT_PLATES = `
  query GetVehicleCurrentPlates($permno: String!) {
    vehicleCurrentPlates(permno: $permno) {
      permno
      plateTypeCode
      plateTypeName
    }
  }
`
