export enum EmailRole {
  seller,
  sellerCoOwner,
  buyer,
  buyerCoOwner,
  buyerOperator,
}

export interface EmailRecipient {
  ssn: string
  name: string
  email?: string
  phone?: string
  role: EmailRole
  approved?: boolean
}

export type VehiclesCurrentVehicle = {
  permno?: string | null
  make?: string | null
  color?: string | null
  role?: string | null
  firstRegistrationDate?: Date | null
  newRegistrationDate?: Date | null
  fuelCode?: string | null
  importCode?: string | null
  vehicleRegistrationCode?: string | null
  vin?: string | null
  vehicleGrant?: number | null
  hasReceivedSubsidy?: boolean | null
  vehicleGrantItemCode?: string | null
}
