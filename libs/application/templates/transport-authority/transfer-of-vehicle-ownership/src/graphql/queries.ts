export const GET_CURRENT_VEHICLES = `
  query GetCurrentVehicles($input: GetCurrentVehiclesInput!) {
    currentVehicles(input: $input) {
      permno
      make
      color
      role
    }
  } 
`

export const GET_VEHICLE_INFORMATION = `
  query GetVehiclesDetail($input: GetVehicleDetailInput!) {
    vehiclesDetail(input: $input) {
      isStolen
      fees {
        hasEncumbrances
      }
    }
  } 
`
