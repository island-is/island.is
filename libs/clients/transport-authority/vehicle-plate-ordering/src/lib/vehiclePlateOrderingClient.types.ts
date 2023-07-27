export interface DeliveryStation {
  name?: string | null
  type: string
  code: string
}

export interface PlateOrderValidation {
  hasError: boolean
  errorMessages?: Array<PlateOrderValidationMessage> | null
}

export interface PlateOrderValidationMessage {
  errorNo?: string | null
  defaultMessage?: string | null
}

export interface PlateOrder {
  permno: string
  frontType?: string | null
  rearType?: string | null
  deliveryStationType?: string
  deliveryStationCode?: string
  expressOrder: boolean
}

// Note: type=R and code=1 is the option "Pick up at Samgöngustofa"
export const SGS_DELIVERY_STATION_TYPE = 'R'
export const SGS_DELIVERY_STATION_CODE = '1'
